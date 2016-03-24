import { START, DONE, ERROR, parseAction, wrapPromise } from '../reduxActionsSequence/reduxActionsUtils';

const ADD_ITEM = 'ADD_ITEM';
const CHECK_ALL = 'CHECK_ALL';

export function addItem(iptTxt) {
    return {
        type: ADD_ITEM,
        payload: {}
    };
}
export function checkAll() {
    return {
        type: CHECK_ALL,
        payload: {}
    };
}

export default function(state = {}, action = {
        type: 'UNKNOWN'
    }) {
    const {type, stage, payload} = parseAction(action);
    if (type === ADD_ITEM) {
        state = Object.assign({}, state, {
            result: payload
        });
        return state;
    }
    if (type === CHECK_ALL) {
        state = Object.assign({}, state, {
            result: payload
        });
        return state;
    }

    return state;
}
