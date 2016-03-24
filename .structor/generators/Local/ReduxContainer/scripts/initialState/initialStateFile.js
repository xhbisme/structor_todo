import { parse, traverse, traverseWithResult } from '../commons/utils.js';

function getObjectAstMap(ast){
    const result = new Map();
    let nodeStore = {
        key: '0'
    };
    traverseWithResult(ast, (node, res) => {
        if( node.type === 'Property' && node.key && node.key.type === 'Identifier' && node.value){
            if(node.value.type === 'ObjectExpression' || node.value.type === 'ArrayExpression'){
                let key = res.key + '.' + node.key.name;
                res[node.key.name] = {
                    key: key
                };
                result.set(key, { parentKey: res.key, node });
                return res[node.key.name];
            } else if(node.value.type === 'Literal') {
                let key = res.key + '.' + node.key.name;
                res[node.key.name] = {
                    key: key
                };
                result.set(key, { parentKey: res.key, node });
                return res;
            }
        }
        return res;
    }, nodeStore);

    return result;
}

//function getMetaStateMap(ast){
//    const result = new Map();
//    let nodeStore = {
//        key: '0'
//    };
//
//    traverseWithResult(ast, (node, res) => {
//        if( node.type === 'Property' && node.key && node.key.type === 'Identifier' && node.value){
//            if(node.value.type === 'ObjectPattern' || node.value.type === 'ArrayPattern'){
//                let key = res.key + '.' + node.key.name;
//                res[node.key.name] = {
//                    key: key
//                };
//                result.set(key, { parentKey: res.key, node });
//                return res[node.key.name];
//            } else if(node.value.type === 'Identifier'){
//                let key = res.key + '.' + node.key.name;
//                res[node.value.name] = {
//                    key: key
//                };
//                result.set(key, { parentKey: res.key, node });
//                return res;
//            }
//        }
//        return res;
//    }, nodeStore);
//
//    return result;
//}

function transformRestructuringToObject(ast){
    traverse(ast, node => {
        if( node.type === 'Property' && node.key && node.key.type === 'Identifier' && node.value) {
            if(node.value.type === 'ObjectPattern'){
                node.value.type = 'ObjectExpression';
            } else if(node.value.type === 'ArrayPattern'){
                node.value.type = 'ArrayExpression'
            } else if(node.value.type === 'Identifier'){
                node.value = {
                    type: 'Literal',
                    value: null,
                    raw: 'null'
                };
                node.shorthand = false;
            }
        }
    });
}

function mergeMetaAstToInitialAst(metaMap, initialMap, rootNode){
    metaMap.forEach( (value, key, thisMap) => {
        let initialEntry = initialMap.get(key);
        if(!initialEntry){
            let initialParentEntry = initialMap.get(value.parentKey);
            if(initialParentEntry){
                if(initialParentEntry.node.value.type === 'ArrayExpression'){
                    let elements = initialParentEntry.node.value.elements;
                    if(elements && elements.length > 0){
                        elements.forEach( element => {
                            if(element.type === 'ObjectExpression'){
                                element.properties.push(value.node);
                            }
                        });
                    }
                } else if(initialParentEntry.node.value.type === 'ObjectExpression') {
                    initialParentEntry.node.value.properties.push(value.node);
                }
            } else {
                let metaParentEntry = thisMap.get(value.parentKey);
                if(!metaParentEntry){
                    rootNode.properties.push(value.node);
                }
            }

        }
    });
}

export function findInitialStateNode(ast){
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

export function mergeInitialStateWithMeta(initialStateAstNode, metaStateAst){

    transformRestructuringToObject(metaStateAst);
    let metaStateMap = getObjectAstMap(metaStateAst);
    let initialStateMap = getObjectAstMap(initialStateAstNode);
    mergeMetaAstToInitialAst(metaStateMap, initialStateMap, initialStateAstNode);

}
