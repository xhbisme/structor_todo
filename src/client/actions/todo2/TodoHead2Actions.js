import { START, DONE, ERROR, parseAction, wrapPromise } from '../reduxActionsSequence/reduxActionsUtils';

const ADD_ONE_ITEM = 'ADD_ONE_ITEM';
const CHECK_ALL = 'CHECK_ALL';

export function addOneItem(inputText) {
    return {
        type: ADD_ONE_ITEM,
        payload: inputText
    };
}
export function checkAll(bool) {
    return {
        type: CHECK_ALL,
        payload: bool
    };
}

export default function(state = {}, action = {
        type: 'UNKNOWN'
    }) {
    const {type, stage, payload} = parseAction(action);
    if (type === ADD_ONE_ITEM) {
        let { list } = state;
        state = Object.assign({}, state, {
            list:[
                ...list,
                {
                    text:payload,
                    completed:false,
                    edit:false
                }
            ]
        });
        return state;
    }
    if (type === CHECK_ALL) {
        let { list } = state;
        state = Object.assign({}, state, {
            list:list.map(alist=>{
                return Object.assign({},alist,{
                    completed:payload
                })
            })
        });
        return state;
    }
    return state;
}
