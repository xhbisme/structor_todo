import { START, DONE, ERROR, parseAction, wrapPromise } from '../reduxActionsSequence/reduxActionsUtils';

const CLEAR_ALL = 'CLEAR_ALL';

export function clearAll() {
    return {
        type: CLEAR_ALL,
        payload: {}
    };
}

export default function(state = {}, action = {
        type: 'UNKNOWN'
    }) {
    const {type, stage, payload} = parseAction(action);
    if (type === CLEAR_ALL) {
        state = Object.assign({}, state, {
            result: payload
        });
        return state;
    }

    return state;
}
