import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addItem, checkAll } from '../../actions/index.js';

class TodoHead extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.handelEnter = this.handelEnter.bind(this);
    }
    handleAddItem() {
        const {dispatch} = this.props;
        const {iptTxt} = this.refs;
        dispatch(addItem(iptTxt.getValue()));
    }
    handleCheckAll() {
        const {dispatch} = this.props;
        dispatch(checkAll());
    }
    handelEnter() {
        const {dispatch} = this.props;
    }

    render() {
        return (<div {...this.props}>
                    <h1><span>todo</span></h1>
                    <input
                           type="text"
                           onKeyDone={ this.handelEnter }
                           placeholder="what needs to be done?"
                           ref="iptTxt"
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
export default connect()(TodoHead);
