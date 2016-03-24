import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addItem, checkAll } from '../../actions/index.js';

class TodoHead1 extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleAddNewItem = this.handleAddNewItem.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }
    handleAddNewItem() {
        const {dispatch} = this.props;
        const {inputText} = this.refs;
        dispatch(addItem(inputText.getValue()));
    }
    handleCheckAll() {
        const {dispatch} = this.props;
        dispatch(checkAll());
    }
    handleEnter() {
        const {dispatch} = this.props;
    }

    render() {
        return (<div {...this.props}>
                    <h1><span>todo</span></h1>
                    <input
                           type="text"
                           ref="inputText"
                           onKeyDown={ this.handleEnter }
                           placeholder="what needs to be done?"
                           style={ {    "width": 470,    "height": "45px",    "fontSize": "25px",    "marginBottom": "10px"} } />
                    <div style={ {    "textAlign": "left"} }>
                        <input type="checkbox" />
                        <label>
                            mark all
                        </label>
                    </div>
                </div>
            );
    }
}
export default connect()(TodoHead1);
