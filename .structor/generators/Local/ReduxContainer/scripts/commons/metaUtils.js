import _ from 'lodash';
import { parse, traverse, traverseModel, traverseWithResult, traverseModelWithResult } from './utils.js';

export function fixText(textValue){
    if(textValue){
        return textValue.replace(/'/g, "\\'");
    }
}

export function isMetaRef(value){
    return value !== undefined && _.isString(value) && value.indexOf('$') === 0;
}

export function getMetaRefName(value){
    if(value){
        const arr = value.split('_');
        if(arr.length > 0){
            return arr[0].substr(1);
        }
    }
    return undefined;
}

export function getMetaVarObject(value){
    if(value){
        let result = {};
        const arr = value.split('_');
        if(arr.length > 0){
            const ext = arr[arr.length -1];
            const extArr = ext.split('$');
            if(extArr.length > 0){
                result.ext = extArr[0];
                result.extRef = extArr[1];
            } else {
                result.ext = ext;
            }
        }
        result.varName = arr[0];
        return result;
    }
    return undefined;
}

export function getMetaModel(model){
    let result = [];
    traverseModelWithResult(model, (node, tree) => {
        //let metaNode = Object.assign({}, node, {children: []});
        let metaNode = {
            type: node.type,
            text: node.text
        };
        if(node.children && node.children.length > 0){
            metaNode.children = [];
        }
        metaNode.props = node.props || {};
        //if(node.props && !_.isEmpty(node.props)){
        //    metaNode.props = node.props;
        //}
        tree.push(metaNode);
        return metaNode.children;
    }, result);
    return result;
}

export function enrichStateToPropVars(meta){
    let propVars = new Map();
    const { component: { stateToProps } } = meta;
    if(stateToProps && stateToProps.length > 0){
        //throw Error('Meta info parsing: component.stateToProps is not specified')
        try{
            const ast = parse('const ' + stateToProps + '=meta;', {tolerant: true, range: false, comment: false});
            traverse(ast, node => {
                if(node.type === 'Property' && node.value.type === 'Identifier'){
                    propVars.set(node.value.name, true);
                }
            });
        } catch(e){
            throw Error('Meta info "stateToProps" parsing: ' + (e.message || e));
        }
    }
    meta.propVars = propVars;
    return meta;
}

export function enrichRefs(meta){
    let refs = new Map();

    if(meta.render && !_.isEmpty(meta.render)){
        traverseModel(meta.render, node => {
            if(node.props && node.props.ref){
                //let refArray = node.props.ref.split(':');
                //let refObj = {
                //    name: refArray[0],
                //    method: refArray[1]
                //};
                //refs.set(refArray[0], refObj);
                refs.set(node.props.ref, true);
            }
        });
    }

    meta.refs = refs;
    return meta;
}

function initActionArgumentObj(meta, node, rawText){
    let actionArgumentObj = {};
    let argumentText = rawText.substr(node.range[0], node.range[1] - node.range[0]);
    //console.log('Raw handler text: ' + rawText);
    //console.log('Raw arg text: ' + argumentText);
    if(argumentText && argumentText.length > 0){
        let members = argumentText.split('.');
        if(members[0].indexOf('$') === 0){
            const varName = members[0].substr(1);
            if(meta.propVars.has(varName)){
                actionArgumentObj.propVar = varName;
            } else if(meta.refs.has(varName)){
                actionArgumentObj.ref = varName;
            } else {
                throw Error('Could not find a reference for action argument: "$' + varName + '"');
            }
        } else {
            actionArgumentObj.argumentName = members[0];
        }
        //actionArgumentObj.argumentName = members[0];
        actionArgumentObj.argumentRestText = members.slice(1).join('.');
    }
    return actionArgumentObj;
}

function initActionObj(meta, node, actions, handler) {

    let actionCallExpression = undefined;
    if (node.type === 'ExpressionStatement'
        && node.expression
        && node.expression.type === 'CallExpression'
        && node.expression.callee
        && node.expression.callee.name) {
        actionCallExpression = node.expression;
    } else if(node.type === 'CallExpression'
        && node.callee
        && node.callee.name){
        actionCallExpression = node;
    }

    if (actionCallExpression) {
        const { callee: { name: actionName }, arguments: actionArgs } = actionCallExpression;
        const actionVarObj = getMetaVarObject(actionName);
        if(actionVarObj){
            const { varName, ext } = actionVarObj;
            if(!actions.has(varName)){
                if(actionVarObj){
                    let actionObj = {
                        label: ext || 'none',
                        actionName: varName,
                        arguments:[],
                        constantName: _.snakeCase(varName).toUpperCase()
                    };
                    if(actionArgs && actionArgs.length > 0){
                        actionArgs.forEach( argumentNode => {
                            actionObj.arguments.push(initActionArgumentObj(meta, argumentNode, handler.rawText));
                        });
                    }
                    actions.set(varName, actionObj);
                }
            }
            handler.actions.set(varName, actions.get(varName));
        } else{
            throw Error('Action name can not be parsed: ' + actionName);
        }
    }
}

export function enrichHandlers(meta){
    let handlerFuncs = new Map();
    let actionObjs = new Map();
    const handlers = meta.component.handlers;
    if(handlers && !_.isEmpty(handlers)){
        _.forOwn(handlers, (value, prop) => {
            try{
                let handlerObj = {
                    methodName: prop,
                    actions: new Map(),
                    parameters: [],
                    rawText: value
                };
                handlerFuncs.set(prop, handlerObj);
                const ast = parse(value, {tolerant: true, range: true, comment: false});
                //console.log('//---- ' + prop + ' ----------------');
                //console.log(JSON.stringify(ast, null, 4));
                traverse(ast, node => {
                    if(node.type === 'ArrowFunctionExpression'){
                        if(node.params && node.params.length > 0){
                            node.params.forEach( funcParam => {
                                handlerObj.parameters.push(funcParam.name);
                            });
                        }
                        traverse(node.body, innerNode => {
                            initActionObj(meta, innerNode, actionObjs, handlerObj);
                            //if(innerNode.type === 'LabeledStatement' && innerNode.label && innerNode.label.type === 'Identifier'){
                            //    initActionObj(meta, innerNode.body, actionObjs, handlerObj, innerNode.label.name);
                            //} else {
                            //
                            //}
                        });
                    }
                });
            } catch (e){
                throw Error('Meta info "handlers.' + prop + '" parsing: ' + (e.message || e));
            }
        });
    }
    //console.log('//---- Handlers ----------------');
    //console.log(JSON.stringify(handlerFuncs, null, 4));
    meta.handlerFuncs = handlerFuncs;
    meta.actions = actionObjs;
    return meta;
}
