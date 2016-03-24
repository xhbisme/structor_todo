import React, { Component, PropTypes } from 'react';

class TodoItem extends Component {

    constructor(props, content) {
        super(props, content);this.handleToggleCheck = this.handleToggleCheck.bind(this);
this.handleOnDel = this.handleOnDel.bind(this);
}
    handleToggleCheck(e){
    e.preventDefault();
    e.stopPropagation();
    const { onToggleCheck } = this.props;
if(onToggleCheck){
onToggleCheck( );
}
}
handleOnDel(){
    const { onDel } = this.props;
if(onDel){
onDel( );
}
}

    render() {
        const {item} = this.props;
let {item.complete} = true;
let textElement = null;
if({item.complete} === true){
    textElement = (<label style={ {"position": "absolute"} } >
    sdf
</label>
);
} else {
    textElement = (<label style={ {"position": "absolute"} } >
    sdf
</label>
);
}
return (<li {...this.props} >
    <input type="checkbox"  onChange={this.handleToggleCheck}  checked={item.completed}  />
{ textElement }<a href="#"  className="fa fa-trash-o"  style={ {"marginLeft": "400px"} }  />

</li>
);
}
}
TodoItem.defaultProps = { item: { completed: 'undefined'}};
TodoItem.propTypes = { item: PropTypes.shape({ completed: PropTypes.string}),onToggleCheck: PropTypes.func,onDel: PropTypes.func};

export default TodoItem;
