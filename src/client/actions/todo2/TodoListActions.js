import { START, DONE, ERROR, parseAction, wrapPromise } from '../reduxActionsSequence/reduxActionsUtils';

const TOGGLE_ITEM = 'TOGGLE_ITEM';
const DELETE_ITEM = 'DELETE_ITEM';
const CH_TXT = 'CH_TXT';
const CH_EDIT = 'CH_EDIT';
const BLUR_LI = 'BLUR_LI';

export function toggleItem(item) {
    
    return {
        type: TOGGLE_ITEM,
        payload: item
    };
}
export function deleteItem(item) {
    return {
        type: DELETE_ITEM,
        payload: item
    };
}
export function chTxtItem(item,value){
    return{
        type: CH_TXT,
        payload: item,
        val: value
    }
}
export function chEdit(item){
    return {
        type: CH_EDIT,
        payload: item
    };
}
export function blurLi(item){
    return {
        type: BLUR_LI,
        payload: item
    };
}
export default function(state = {}, action = {
        type: 'UNKNOWN'
    }) {
    const {type, stage, payload, value} = parseAction(action);
    if (type === TOGGLE_ITEM) {
        let { list } = state;
        let index = list.indexOf(payload);
        
        state = Object.assign({}, state, {
            list:[
                ...list.slice(0,index),
                Object.assign({},list[index],{
                    completed:!list[index].completed
                }),
                ...list.slice(index+1)
            ]
        });
        return state;
    }
    if (type === DELETE_ITEM) {
        let { list } = state;
        let index = list.indexOf(payload);
        state = Object.assign({}, state, {
             list:[
                ...list.slice(0,index),
                ...list.slice(index+1)
            ]
        });
        return state;
    }
    if (type === CH_TXT) {
        
        let { list } = state;
        let index = list.indexOf(payload);
        state = Object.assign({}, state, {
             list:[
                ...list.slice(0,index),
                Object.assign({},list[index],{
                    text:action.val
                }),
                ...list.slice(index+1)
            ]
        });
        return state;
    }
    if (type === CH_EDIT) {
        let { list } = state;
        let index = list.indexOf(payload);
        state = Object.assign({}, state, {
             list:[
                ...list.slice(0,index),
                Object.assign({},list[index],{
                    edit:true
                }),
                ...list.slice(index+1)
            ]
        });
        return state;
    }
    if (type === BLUR_LI) {
        let { list } = state;
        let index = list.indexOf(payload);
        state = Object.assign({}, state, {
             list:[
                ...list.slice(0,index),
                Object.assign({},list[index],{
                    edit:false
                }),
                ...list.slice(index+1)
            ]
        });
        return state;
    }

    return state;
}
