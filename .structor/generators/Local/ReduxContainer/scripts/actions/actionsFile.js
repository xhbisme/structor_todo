import _ from 'lodash';

const asyncActionHandler = _.template(
`if(type === <%= action.constantName %>){
    if(stage === START){
        state = Object.assign({}, state, {
            status: {
                code: 'start',
                text: 'Started'
            },
            result: null
        });
        return state;
    }
    if(stage === DONE){
        state = Object.assign({}, state, {
            status: {
                code: 'done',
                text: 'Completed successfully'
            },
            result: payload
        });
        return state;
    }
    if(stage === ERROR){
        state = Object.assign({}, state, {
            status: {
                code: 'error',
                text: 'Completed with error: ' + payload
            },
            result: null
        });
        return state;
    }
}
`);

const actionHandler = _.template(
`if(type === <%= action.constantName %>){
    state = Object.assign({}, state, {
        result: payload
    });
    return state;
}
`);

const asyncActionReturn = _.template(
`return (dispatch, getState) => wrapPromise(<%= action.constantName %>, dispatch, () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({});
        }, 3000);
    });
});
`);

const actionReturn = _.template(
`return {
    type: <%= action.constantName %>, payload: {}
};
`);

const newAction = _.template(
`export function <%= action.actionName %>(<%= api.getActionParameters({ action: action }) %>){
    <%= api.getActionReturnObject({ action: action }) %>
}
`);

const actionsWrapper = _.template(
`import { START, DONE, ERROR, parseAction, wrapPromise } from '../reduxActionsSequence/reduxActionsUtils';

<%= api.getActionsConstants({ newActions: newActions }) %>
<%= api.getActionsCreators({ newActions: newActions, api: api }) %>
export default function(state = {}, action = {type: 'UNKNOWN'}){
    const { type, stage, payload } = parseAction(action);
    <%= api.getActionsHandlers({ newActions: newActions }) %>
    return state;
}\n`);

export function getActionsHandlers(options){
    const { newActions } = options;
    let result = '';
    newActions.forEach( (action, name) => {
        if(action.label && action.label === 'async'){
            result += asyncActionHandler({ action });
        } else {
            result += actionHandler({ action });
        }
    });
    return result;
}

export function getActionsConstants(options){
    const { newActions } = options;
    let result = '';
    newActions.forEach( (action, name) => {
        result += 'const ' + action.constantName + ' = \'' + action.constantName + '\';\n';
    });
    return result;
}

export function getActionsCreators(options){
    const { newActions, api } = options;
    let result = '';
    newActions.forEach( (action, name) => {
        result += newAction({ api, action });
    });
    return result;
}

export function getActionParameters(options){
    const { action } = options;
    if(action.arguments.length === 0){
        return '';
    }
    let paramsText = '';
    action.arguments.forEach( argument => {
        if(argument.ref){
            paramsText += argument.ref + ',';
        } else if(argument.propVar){
            paramsText += argument.propVar + ',';
        } else if(argument.argumentName){
            paramsText += argument.argumentName + ',';
        }
    });
    paramsText = paramsText.substr(0, paramsText.length - 1);
    return paramsText;
}

export function getActionReturnObject(options){
    const { action } = options;
    if(action.label && action.label === 'async'){
        return asyncActionReturn({ action });
    } else {
        return actionReturn({ action });
    }
}

export function getActionsFile(options){
    return actionsWrapper(options);
}
