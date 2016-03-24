import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { clearAll } from '../../actions/index.js';

class TodoFoot2 extends Component {

    constructor(props, content) {
        super(props, content);this.handleClearAll = this.handleClearAll.bind(this);
}
    handleClearAll(){
    const { dispatch } = this.props;
dispatch(clearAll( ));
}

    render() {
        const {list} = this.props;
let  item left = '0 item left';
return (<div {...this.props}  style={ {"background": "#23ee67","height": "45px","paddingTop": "10px","textAlign": "left"} }  id="foot" >
    <label>
    { item left}
</label>
<a href="#"  onClick={this.handleClearAll}  style={ {"marginLeft": "300px"} } >
    <span>
    clear 0 item
</span>

</a>

</div>
);
}
}
function mapStateToProps(state) {
    const {todoList:{list}} = state;
    return {list};

}

export default connect(mapStateToProps)(TodoFoot2);
