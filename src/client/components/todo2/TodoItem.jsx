import React, { Component, PropTypes } from 'react';

class TodoItem extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleToggleCheck = this.handleToggleCheck.bind(this);
        this.handleOnDelItem = this.handleOnDelItem.bind(this);
        this.change = this.change.bind(this);
        this.dblClick = this.dblClick.bind(this);
        this.blurLi = this.blurLi.bind(this);
    }
    handleToggleCheck() {
        const {item} = this.props;
        const toggleCheck=this.props.handleToggleCheck;
        if (toggleCheck) {
            toggleCheck(item);
        }
    }
    handleOnDelItem() {
        const {item} = this.props;
        const delItem=this.props.handleOnDelItem;
        if (delItem) {
            delItem(item);
        }
    }
    change(e){// change input text
      
      const {item} = this.props;
        const chTxt=this.props.handlechTxt;
        if (chTxt) {
            chTxt(item,e.target.value);
        }
    }
    dblClick(e){// dblclick to edit model
      const {item} = this.props;
        const dbClick=this.props.handledbClick;
        if (dbClick) {
            dbClick(item);
        }
    }
    blurLi(e){// blur to view model
      const {item} = this.props;
        const blurALi=this.props.handleblurLi;
        if (blurALi) {
            blurALi(item);
        }
    }
    render() {
        const {item} = this.props;
        let {text,completed,edit}= item;
        let textElement = null;
        if (completed === true) {
            textElement = (<label style={ {    "position": "absolute", "textDecoration":"line-through","color":"#aaa"} }>
                               {text}
                           </label>
            );
        } else {
            textElement = (<label style={ {    "position": "absolute"} }>
                               {text}
                           </label>
            );
        }
        return (<li {...this.props}>
                  <div onDoubleClick={this.dblClick}
                  style={ {    "display":(edit)?"none":"block"} }>
                    <input
                           type="checkbox"
                           checked={ completed }
                           onChange={ this.handleToggleCheck } />
                    { textElement }<a
                                              href="#"
                                              className="fa fa-trash-o"
                                              onClick={ this.handleOnDelItem }
                                              style={ {    "marginLeft": "400px"} } />
                  </div>
                  <input 
                          type="text"
                          onBlur={this.blurLi}
                          value={text} 
                          onChange={this.change}
                          style={ { "display":(edit)?"block":"none"} }/>
                </li>
            );
    }
}
TodoItem.defaultProps = {
    item: {
        completed: 'undefined'
    }
};
TodoItem.propTypes = {
    item: PropTypes.shape({
        text:PropTypes.String,
        completed: PropTypes.boolean,
        edit:PropTypes.boolean
    }),
    toggleCheck: PropTypes.func,
    delItem: PropTypes.func,
    chTxt: PropTypes.func,
    dbClick: PropTypes.func,
    blurALi: PropTypes.func
};

export default TodoItem;
