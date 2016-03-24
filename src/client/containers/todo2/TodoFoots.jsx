import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { allClear } from '../../actions/index.js';

class TodoFoots extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleClear = this.handleClear.bind(this);
    }
    handleClear() {
        const {dispatch} = this.props;
        dispatch(allClear());
    }

    render() {
        const {list} = this.props;
        let uncheck = list.filter(alist=>!alist.completed).length;
        return (<div
                     {...this.props}
                     style={ { "display":(list.length)?"block":"none" ,"background": "#23ee67",    "height": "45px",    "paddingTop": "10px",    "textAlign": "left"} }
                     id="foot">
                    <label>
                       {uncheck} item left
                    </label>
                    <a
                       onClick={ this.handleClear }
                       href="#"
                       style={ {    "marginLeft": "300px"} }><span>clear {list.length-uncheck} item</span></a>
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

export default connect(mapStateToProps)(TodoFoots);
