
import React, { Component, PropTypes } from 'react';



class MainPage extends Component {

    render() {
        return (
            <div>
                <h3 style={ {    padding: '1em',    textAlign: 'center'} } params={ this.props.params }><span params={ this.props.params }>This is an empty page. To add new component select needed element on left-side panel and click on an element on the page where you want to put new component, than choose action for right component's place.</span></h3>
            </div>
            );
    }
}

export default MainPage;

