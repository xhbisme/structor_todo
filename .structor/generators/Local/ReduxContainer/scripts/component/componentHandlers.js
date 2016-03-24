import _ from 'lodash';

const lifecycleMethods = [
    'getInitialState', 'getDefaultProps',
    'componentDidMount', 'componentWillReceiveProps',
    'shouldComponentUpdate', 'componentWillUpdate',
    'componentDidUpdate', 'componentWillUnmount'
];

const handlerBind = _.template(
`this.<%= handler.methodName %> = this.<%= handler.methodName %>.bind(this);\n`);

const handlerWrapper = _.template(
`<%= handler.methodName %>(<%= handler.parameters.join(',') %>){
    <%= api.getHandlerVars({ handler: handler }) %><%= api.getHandlerRefs({ handler: handler }) %><%= api.getHandlerActions({ handler: handler }) %>}\n`);

const handlerWrapperWithEvent = _.template(
`<%= handler.methodName %>(e){
    e.preventDefault();
    e.stopPropagation();
    <%= api.getHandlerVars({ handler: handler }) %><%= api.getHandlerRefs({ handler: handler }) %><%= api.getHandlerActions({ handler: handler }) %>}\n`);

const handlerActionWrapper = _.template(
`dispatch(<%= actionName %>(<%= actionArgumentsText %>));\n`);

export function getImportHeaderActions(options){
    const { meta } = options;
    let result = '';
    meta.actions.forEach( (action, name) => {
        result += ' ' + name + ',';
    });
    if(result && result.length > 0) {
        result = 'import {' + result.substr(0, result.length - 1) + ' } from \'' + meta.actionsIndexFilePath + '\';\n';
    }
    return result;
}

export function getHandlersBinds(options){
    const { meta } = options;
    let result = '';
    meta.handlerFuncs.forEach( (handler, name) => {
        if(!_.includes(lifecycleMethods, name)){
            options.handler = handler;
            result += handlerBind(options);
        }
    });
    return result;
}

export function getHandlers(options){
    const { meta } = options;
    let result = '';
    meta.handlerFuncs.forEach( (handler, name) => {
        options.handler = handler;
        if(handler.parameters.length === 1 && handler.parameters[0] === 'e'){
            result += handlerWrapperWithEvent(options);
        } else {
            result += handlerWrapper(options);
        }
    });
    return result;
}

export function getHandlerVars(options){
    const { handler } = options;
    let result = '';
    handler.actions.forEach( (action, name) => {
        action.arguments.forEach( argumentObj => {
            if(argumentObj.propVar){
                result += ' ' + argumentObj.propVar + ',';
            }
        });
    });
    if(result && result.length > 0){
        result = 'const { dispatch,' + result.substr(0, result.length - 1) + ' } = this.props;\n';
    } else {
        result = 'const { dispatch } = this.props;\n';
    }
    return result;
}

export function getHandlerRefs(options){
    const { handler } = options;
    let result = '';
    handler.actions.forEach( (action, name) => {
        action.arguments.forEach( argumentObj => {
            if(argumentObj.ref){
                result += ' ' + argumentObj.ref + ',';
            }
        });
    });
    if(result && result.length > 0){
        result = 'const {' + result.substr(0, result.length - 1) + ' } = this.refs;\n';
    }
    return result;
}

export function getHandlerActions(options){
    const { handler } = options;
    let result = '';
    handler.actions.forEach( (action, name) => {
        let actionArgumentsText = '';
        action.arguments.forEach( argumentObj => {
            if(argumentObj.ref){
                actionArgumentsText += ' ' + argumentObj.ref;
            } else if(argumentObj.propVar){
                actionArgumentsText += ' ' + argumentObj.propVar;
            } else if(argumentObj.argumentName){
                actionArgumentsText += ' ' + argumentObj.argumentName;
            }
            if(argumentObj.argumentRestText){
                actionArgumentsText += '.' + argumentObj.argumentRestText;
            }
            actionArgumentsText += ',';
        });
        actionArgumentsText = actionArgumentsText.substr(0, actionArgumentsText.length - 1) + ' ';
        result += handlerActionWrapper({ actionName: name, actionArgumentsText });

    });
    return result;
}