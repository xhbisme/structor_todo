import { START, DONE, ERROR, parseAction, wrapPromise } from '../reduxActionsSequence/reduxActionsUtils';

const ALL_CLEAR = 'ALL_CLEAR';

export function allClear() {
    return {
        type: ALL_CLEAR,
        payload: {}
    };
}

export default function(state = {}, action = {
        type: 'UNKNOWN'
    }) {
    const {type, stage, payload} = parseAction(action);
    if (type === ALL_CLEAR) {
        let { list } = state;
        
        state = Object.assign({}, state, {
            list: list.filter(alist=>!alist.completed)
        });
        return state;
    }

    return state;
}
