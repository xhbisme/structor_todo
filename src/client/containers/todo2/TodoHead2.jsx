import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addOneItem, checkAll } from '../../actions/index.js';

class TodoHead2 extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleAddNewItem = this.handleAddNewItem.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
    }
   
    handleAddNewItem(e) {
       
        const {dispatch} = this.props;
        const {inputText} = this.refs;
         if(e.which===13){
            
            dispatch(addOneItem(inputText.value));
            inputText.value='';
        }
       
    }
    handleCheckAll(e) {
        const {dispatch} = this.props;
        dispatch(checkAll(e.target.checked));
    }
    render() {
        let {list}=this.props;
        let check=list.some(alist=>!alist.completed);
        return (<div {...this.props}>
                    <h1><span>todo</span></h1>
                    <input
                           ref="inputText"
                           onKeyDown={ this.handleAddNewItem }
                           type="text"
                           
                           placeholder="what needs to be done?"
                           style={ {    "width": 470,    "height": "45px",    "fontSize": "25px",    "marginBottom": "10px"} } ></input>
                    <div style={ {  "display":(list.length)?"block":"none",  "textAlign": "left"} }>
                        <input
                               type="checkbox"
                               checked={!check}
                               onChange={ this.handleCheckAll } />
                        <label>
                            mark all
                        </label>
                    </div>
                </div>
            );
    }
}
function mapStateToProps(state) {
    const {todoList: {list}} = state;
    return {
        list
    };
}
export default connect(mapStateToProps)(TodoHead2);
