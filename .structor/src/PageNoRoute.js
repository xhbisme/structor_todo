import React, {Component} from 'react';

class PageForDesk extends Component {

    constructor(props, content) {
        super(props, content);
    }

    render() {
        return (
            <h4>{'Route not found: ' + this.props.location.pathname}</h4>
        );
    }

}

export default PageForDesk;
