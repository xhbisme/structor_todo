import _ from 'lodash';
import { traverse } from '../commons/utils.js';

export function findDefaultExportNode(ast){
    let result = null;
    traverse(ast, node => {
        if (node.type === 'ExportDefaultDeclaration'
            && node.declaration){
            if(node.declaration.type === 'Identifier'){
                const defaultExportVarName = node.declaration.name;
                traverse(ast, function(innerNode){
                    if(innerNode.type === 'VariableDeclarator'
                        && innerNode.id
                        && innerNode.id.type === 'Identifier' && innerNode.id.name === defaultExportVarName){
                        result = innerNode.init;
                    }
                });
            } else if(node.declaration.type === 'ObjectExpression'){
                result = node.declaration;
            }
        }
    });
    return result;
}

function fixReduceReducersImport(ast){
    let isPresent = false;
    if(ast.body && ast.body.length > 0){
        ast.body.forEach( node => {
            if(node.type === 'ImportDeclaration' && node.source && node.source.value === 'reduce-reducers'){
                isPresent = true;
            }
        });
    } else {
        ast.body = [];
    }
    if(!isPresent){
        ast.body.splice(0, 0, {
            type: 'ImportDeclaration',
            specifiers: [
                {
                    type: "ImportDefaultSpecifier",
                    local: {
                        type: "Identifier",
                        name: 'reduceReducers'
                    }
                }
            ],
            "source": {
                "type": "Literal",
                "value": 'reduce-reducers',
                "raw": '\'reduce-reducers\''
            }
        });
    }
}

export function injectNonExistingReducer(ast, meta, componentName, actionsFilePath) {
    //console.log('//--- Reducers index file AST -----------------------------------------------------------------------');
    //console.log(JSON.stringify(ast, null, 4));
    const defaultNodeAst = findDefaultExportNode(ast);
    if (!meta.component.reducerRoot || meta.component.reducerRoot.length <= 0) {
        throw Error('Reducer root was not specified');
    }
    const reducerName = _.camelCase(componentName + "Reducer");
    if (ast.body) {
        if(_.findIndex(ast.body, item => {
                return (
                    item.type === 'ImportDeclaration'
                    && item.source
                    && item.source.value
                    && item.source.value === actionsFilePath
                )
            }) < 0){
            ast.body.splice(0, 0, {
                type: 'ImportDeclaration',
                specifiers: [
                    {
                        type: "ImportDefaultSpecifier",
                        local: {
                            type: "Identifier",
                            name: reducerName
                        }
                    }
                ],
                "source": {
                    "type": "Literal",
                    "value": actionsFilePath,
                    "raw": '\'' + actionsFilePath + '\''
                }
            });
        }
    }
    if (defaultNodeAst.callee
        && defaultNodeAst.callee.name === 'combineReducers'
        && defaultNodeAst.arguments
        && defaultNodeAst.arguments[0].properties) {

        let reduceReducersArgs = undefined;
        let existingReducerProp = undefined;
        if (defaultNodeAst.arguments[0].properties.length > 0) {
            _.remove(defaultNodeAst.arguments[0].properties, prop => {
                return (prop.value && prop.value.type === 'Identifier' && prop.value.name === reducerName);
            });
            defaultNodeAst.arguments[0].properties.forEach(prop => {
                if(prop.value){
                    if(prop.value.type === 'CallExpression'
                        && prop.value.callee
                        && prop.value.callee.name === 'reduceReducers') {
                        _.remove(prop.value.arguments, arg => {
                            return (arg.type === 'Identifier' && arg.name === reducerName);
                        });
                    }
                }
            });
            defaultNodeAst.arguments[0].properties.forEach(prop => {
                if (prop.key && prop.key.name === meta.component.reducerRoot) {
                    //console.log('I found reducer: ' + meta.component.reducerRoot);
                    if(prop.value){
                        if(prop.value.type === 'Identifier'){
                            existingReducerProp = prop;
                        } else if(prop.value.type === 'CallExpression'
                            && prop.value.callee
                            && prop.value.callee.name === 'reduceReducers') {

                            reduceReducersArgs = prop.value.arguments;

                        }
                    } else {
                        throw Error('Specified reducer root is existing and has not compatible value ' + prop.value.name);
                    }
                }
            });
        }

        if(reduceReducersArgs){
            reduceReducersArgs.splice(0, 0, {
                type: "Identifier",
                name: reducerName
            });
        } else if(existingReducerProp){
            //console.log('I change reducer to reduceReducers.');
            let existingReducerName = existingReducerProp.value.name;
            existingReducerProp.value = {
                type: "CallExpression",
                callee: {
                    "type": "Identifier",
                    "name": "reduceReducers"
                },
                arguments: [
                    {
                        type: "Identifier",
                        name: reducerName
                    },
                    {
                        type: "Identifier",
                        name: existingReducerName
                    }
                ]
            };
            fixReduceReducersImport(ast);
        } else {
            defaultNodeAst.arguments[0].properties.splice(0, 0, {
                type: "Property",
                key: {
                    type: "Identifier",
                    name: meta.component.reducerRoot
                },
                computed: false,
                value: {
                    type: "Identifier",
                    name: reducerName
                },
                kind: "init",
                method: false,
                shorthand: false
            });
        }

    } else {
        throw Error('Could not find "combineReducers" function in reducers index file or it has wrong call expression');
    }
    return ast;
}

