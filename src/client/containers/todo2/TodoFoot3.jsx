import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { clear } from '../../actions/index.js';

class TodoFoot3 extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleClear = this.handleClear.bind(this);
    }
    handleClear() {
        const {dispatch} = this.props;
        dispatch(clear());
    }

    render() {
        const {list} = this.props;
        let uncheck=list.filter(item=>!item.completed).length;
        debugger
        return (<div
                     {...this.props}
                     style={ {    "background": "#23ee67",    "height": "45px",    "paddingTop": "10px",    "textAlign": "left"} }
                     id="foot">
                    <label>
                        {uncheck} item left
                    </label>
                    <a
                       onClick={ this.handleClear }
                       href="#"
                       style={ {    "marginLeft": "300px"} }><span>clear {list.lenth-uncheck} item</span></a>
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

export default connect(mapStateToProps)(TodoFoot3);
