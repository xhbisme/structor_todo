import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { clearAll } from '../../actions/index.js';

class TodoFoot extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleClearAll = this.handleClearAll.bind(this);
    }
    handleClearAll() {
        const {dispatch} = this.props;
        dispatch(clearAll());
    }

    render() {
        debugger
        const {list} = this.props;
        return (<div
                     {...this.props}
                     style={ {    "background": "#23ee67",    "height": "45px",    "paddingTop": "10px",    "textAlign": "left"} }
                     id="foot">
                    <label>
                        0 item left
                    </label>
                    <a
                       href="#"
                       onClick={ this.handleClearAll }
                       style={ {    "marginLeft": "300px"} }><span>clear 0 item</span></a>
                </div>
            );
    }
}
function mapStateToProps(state) {
    const {todos: {list}} = state;
    return {
        list
    };
}

export default connect(mapStateToProps)(TodoFoot);
