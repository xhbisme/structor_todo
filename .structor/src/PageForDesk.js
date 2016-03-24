import  _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PreviewOverlay from './PreviewOverlay.js';
import components from './index.js';
import { matchPattern, formatPattern, getParams } from 'react-router/lib/PatternUtils.js';
import pageDefaultModel from './model.js';

let instanceMap = {};

function wrapComponent(WrappedComponent, instanceMap) {
    var klass = React.createClass({
        componentDidMount: function(){
            instanceMap[this.props['data-umyid']] = ReactDOM.findDOMNode(this);
        },
        render: function(){
            return <WrappedComponent {...this.props} />
        }
    });
    klass.displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    return klass;
}

class PageForDesk extends Component {

    constructor(props, content) {
        super(props, content);
        this.state = {
            pageModel: pageDefaultModel
        };
        this._updatePageModel = this._updatePageModel.bind(this);
        this.updateModel = this.updateModel.bind(this);
        this.updatePreviewModel = this.updatePreviewModel.bind(this);
        this.handleClosePreview = this.handleClosePreview.bind(this);
        this.handleDeletePreview = this.handleDeletePreview.bind(this);
        this.createElements = this.createElements.bind(this);
        this.createElement = this.createElement.bind(this);
        this.findComponent = this.findComponent.bind(this);
        this.getInstanceMap = this.getInstanceMap.bind(this);
    }

    componentDidMount(){
        window.Page = this;
        var pathname = this.props.location.pathname;
        this._updatePageModel(pathname);
        if(window.onPageDidMount){
            window.onPageDidMount();
        }
    }

    componentWillUnmount(){
        window.Page = null;
        if(window.onPageWillUnmount){
            window.onPageWillUnmount();
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.location.pathname !== this.props.location.pathname){
            this._updatePageModel(nextProps.location.pathname);
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(window.onPageDidUpdate){
            window.onPageDidUpdate();
        }
    }

    componentWillUpdate(nextProps, nextState){
        if(window.onPageWillUpdate){
            window.onPageWillUpdate();
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return (this.state.pageModel !== nextProps.pageModel
        || this.state.previewModel !== nextProps.previewModel);
    }

    _updatePageModel(pathname){
        let pageModel = null;
        if(window.__model && window.__model.pages && window.__model.pages.length > 0){
            let pages = window.__model.pages;
            if(pathname === '/'){
                pageModel = pages[0];
            } else {
                pages.forEach( function(page, index){
                    if(pathname === page.pagePath){
                        pageModel = page;
                    }
                });
                if(!pageModel){
                    //check if pathname has valid parameters for route path pattern
                    pages.forEach((page, index) => {
                        try{
                            let paramsObj = getParams(page.pagePath, pathname);
                            let formattedPath = formatPattern(page.pagePath, paramsObj);
                            if(pathname === formattedPath){
                                pageModel = page;
                            }
                        } catch(e){
                            console.error(e.message);
                            pageDefaultModel.children[0].children[0].text = e.message;
                        }
                    });
                }
            }
        }
        if(pageModel){
            this.setState({ pageModel: pageModel });
        } else {
            this.setState({ pageModel: pageDefaultModel });
        }
        if(window.__setCurrentPathname && pageModel){
            window.__setCurrentPathname(pageModel.pagePath);
        }
    }

    updateModel(model){
        window.__model = model;
        if(this.props.location.pathname){
            this._updatePageModel(this.props.location.pathname);
        }
    }

    updatePreviewModel(model){
        this.setState({ previewModel: model });
    }

    handleClosePreview(){
        if(window.__closePreview){
            window.__closePreview();
        }
    }

    handleDeletePreview(){
        if(window.__deletePreview){
            window.__deletePreview();
        }
    }

    createElements(model){

        let elements = [];
        instanceMap = {};
        model.children.forEach((child, index) => {
            elements.push(this.createElement(child, index));
        });
        return elements;
    }

    createElement(options, ref){

        let type = 'div';
        if(options.type){
            type = this.findComponent(components, options.type, 0);
            if(!type){
                type = options.type;
            } else if(!_.isObject(type)){
                console.error('Element type: ' + options.type + ' is not object. Please check your index.js file');
                type = 'div';
            }
        }

        let props = _.extend({}, { params: this.props.params, location: this.props.location }, options.props);
        props.key = ref;

        if(_.isObject(type)){
            _.forOwn(props, (prop, propName) => {
                if(prop && _.isObject(prop) && prop.type){
                    props[propName] = this.createElement(prop, 0);
                }
            });
        }

        let nestedElements = null;
        if(options.children && options.children.length > 0){
            let children = [];
            options.children.forEach(childOptions => {
                children.push(this.createElement(childOptions, ++ref));
            });
            nestedElements = children;
        } else if(options.text) {
            nestedElements = options.text;
        }
        let result = null;
        try{
            if(_.isString(type)){
                result = React.createElement(type, props, nestedElements);
            } else {
                result = React.createElement(wrapComponent(type, instanceMap), props, nestedElements);
            }
            if(result.type.prototype){
                if(result.type.prototype.render){
                    result.type.prototype.render = ((fn) => {
                        return function render(){
                            try {
                                 return fn.apply(this, arguments);
                            } catch (err) {
                                console.error(err);
                                return React.createElement('div', {
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#c62828',
                                        color: 'white',
                                        padding: '3px',
                                        display: 'table'
                                    },
                                    'data-umyid': this.props['data-umyid']
                                }, React.createElement('span', {
                                    style: {
                                        display: 'table-cell',
                                        verticalAlign: 'middle'
                                    }
                                }, '\`' + options.type + '\` ' + err.toString()));
                            }
                        }
                    })(result.type.prototype.render);
                }
            }

        } catch(e){
            console.error('Element type: ' + options.type + ' is not valid React Element. Please check your index.js file. ' + e);
        }
        return result;
    }

    findComponent(index, componentName, level){
        let result = null;
        if(index && _.isObject(index) && level <= 1){
            level++;
            _.forOwn(index, (value, key) => {
                if(!result){
                    if(key === componentName){
                        result = value;
                    } else if(value && _.isObject(value)){
                        result = this.findComponent(value, componentName, level);
                    }
                }
            });
        }
        return result;
    }

    getInstanceMap(){
        let nodeMap = {};
        let nodeList = $("[data-umyid]");
        let visitedIds = [];
        if(nodeList && nodeList.length > 0){
            let umyId = null;
            nodeList.each((index, node) => {
                umyId = node.attributes['data-umyid'].value;
                if(!instanceMap[umyId]){
                    nodeMap[umyId] = node;
                    visitedIds.push(umyId);
                }
            });
        }
        let allIds = _.keys(instanceMap);
        let difference = _.difference(allIds, visitedIds);
        if(difference && difference.length > 0){
            difference.forEach( id => {
                nodeMap[id] = instanceMap[id];
            });
        }
        nodeList = null;
        return nodeMap;
    }

    render(){
        let content = null;
        if(this.state.previewModel){
            let previewElementTree = this.createElements(this.state.previewModel);
            content = (
                <PreviewOverlay
                    onClose={this.handleClosePreview}
                    onDelete={this.handleDeletePreview}>
                    {previewElementTree}
                </PreviewOverlay>
            );
        } else {
            content = this.createElements(this.state.pageModel);
        }
        return (
            <div>
                {content}
            </div>
        );
    }

}

export default PageForDesk;

