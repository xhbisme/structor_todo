import todoFootsReducer from '../actions/todo2/TodoFootsActions.js';
import todoFoot3Reducer from '../actions/todo2/TodoFoot3Actions.js';
import todoFoot2Reducer from '../actions/todo2/TodoFoot2Actions.js';
import todoFootReducer from '../actions/todo2/TodoFootActions.js';
import todoHead2Reducer from '../actions/todo2/TodoHead2Actions.js';
import todoListReducer from '../actions/todo2/TodoListActions.js';
import reduceReducers from 'reduce-reducers';
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    todoList: reduceReducers(todoFootsReducer, todoFoot3Reducer, todoFoot2Reducer, todoFootReducer, todoHead2Reducer, todoListReducer)
});
export default rootReducer;