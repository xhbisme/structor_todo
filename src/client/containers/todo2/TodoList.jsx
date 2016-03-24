import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TodoItem from '../../components/todo2/TodoItem.jsx';
import { toggleItem, deleteItem, chTxtItem, chEdit, blurLi } from '../../actions/index.js';

class TodoList extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleToggleCompleted = this.handleToggleCompleted.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOnChTxt = this.handleOnChTxt.bind(this);
        this.handleOnDBClick = this.handleOnDBClick.bind(this);
        this.handleBlurLi = this.handleBlurLi.bind(this);
    }
    handleToggleCompleted(item) {
        const {dispatch} = this.props;
        dispatch(toggleItem(item));
    }
    handleDelete(item) {
        const {dispatch} = this.props;
        dispatch(deleteItem(item));
    }
    handleOnChTxt(item,value){
        const {dispatch} = this.props;
        dispatch(chTxtItem(item,value));
    }
    handleOnDBClick(item){
        const {dispatch} = this.props;
        dispatch(chEdit(item));
    }
    handleBlurLi(item){
        const {dispatch} = this.props;
        dispatch(blurLi(item));
    }

    render() {
        const {list} = this.props;
        let item = 'undefined';
        let listItem;
        if (list && list.length > 0) {
            listItem = list.map((item, index) => {
                return (<TodoItem
                                  key={ index }
                                  item={ item }
                                  handleToggleCheck={ this.handleToggleCompleted }
                                  handleOnDelItem={ this.handleDelete } 
                                  handlechTxt={this.handleOnChTxt}
                                  handledbClick={this.handleOnDBClick}
                                  handleblurLi={this.handleBlurLi}/>
                    );
            })
        }else{}
        return (<ul
                    {...this.props}
                    style={ {    "listStyle": "none"} }>
                    { listItem }
                </ul>
            );
    }
}
function mapStateToProps(state) {
    const {todoList: {list}} = state;
    return {
        list
    };
}

export default connect(mapStateToProps)(TodoList);
