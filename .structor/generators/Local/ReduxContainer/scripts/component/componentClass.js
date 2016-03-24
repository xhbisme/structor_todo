import _ from 'lodash';

const header = _.template(
`import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';\n`);

const headerImportsMembers = _.template(
`import { <%= members.join(',') %> } from '<%= relativeSource %>';\n`);

const headerImportsDefaults = _.template(
`import <%= name %> from '<%= relativeSource %>';\n`);

const classWrapper = _.template(
`<%= api.getComponentClassHeader() %><%= api.getComponentClassMemberImports({ imports: imports }) %><%= api.getComponentClassDefaultImports({ imports: imports }) %><%= api.getImportHeaderActions({ meta: meta }) %>
class <%= componentName %> extends Component {

    constructor(props, content) {
        super(props, content);<%= api.getHandlersBinds({ model: model, meta: meta, api: api }) %>}
    <%= api.getHandlers({ model: model, meta: meta, api: api }) %>
    render() {
        <%= api.getRenderVars({ meta: meta }) %><%= api.getComponentVars({ model: model, meta: meta, api: api }) %><%= api.getComponentChildrenVars({ model: model, meta: meta, api: api }) %><%= api.getRootComponent({ model: model, meta: meta, api: api }) %>}
}
<%= api.getClassFooter({ model: model, meta: meta, api: api, componentName: componentName }) %>`);

const footerWithStateToProps = _.template(
`function mapStateToProps(state) {
    const <%= meta.component.stateToProps %> = state;
    return <%= api.getStateVars({ meta: meta }) %>
}

export default connect(mapStateToProps)(<%= componentName %>);\n`);

const footerWithEmptyStateToProps = _.template(
`export default connect()(<%= componentName %>);\n`);

export function getComponentClassHeader(){
    return header();
}

export function getComponentClassMemberImports(options) {
    const { imports } = options;
    let result = '';
    let importsMap = {};
    imports.forEach(item => {
        if (item.member) {
            importsMap[item.relativeSource] = importsMap[item.relativeSource] || [];
            importsMap[item.relativeSource].push(item.member);
        }
    });
    _.forOwn(importsMap, (members, relativeSource) => {
        result += headerImportsMembers({ members, relativeSource });
    });
    return result;
}

export function getComponentClassDefaultImports(options){
    const { imports } = options;
    let result = '';
    let importsMap = {};
    imports.forEach( item => {
        if(!item.member){
            importsMap[item.relativeSource] = importsMap[item.relativeSource] || [];
            importsMap[item.relativeSource].push(item.name);
        }
    });
    _.forOwn(importsMap, (name, relativeSource) => {
        result += headerImportsDefaults({ name, relativeSource });
    });
    return result;
}

export function getStateVars(options){
    const { meta: { propVars } } = options;
    let result = '';
    if(propVars && propVars.size > 0){
        result += '{';
        for (var key of propVars.keys()) {
            result += key + ',';
        }
        result = result.substr(0, result.length - 1) + '};\n';
    }
    return result;
}

export function getRenderVars(options){
    const { meta: { propVars, actions } } = options;
    let result = '';
    if(propVars && propVars.size > 0){
        result += 'const {';
        for (var key of propVars.keys()) {
            result += key + ',';
        }
        result = result.substr(0, result.length - 1) + '} = this.props;\n';
    }
    return result;
}

export function getClassFooter(options){
    const { meta: { propVars } } = options;
    let result = '';
    if(propVars && propVars.size > 0){
        result = footerWithStateToProps(options);
    } else {
        result = footerWithEmptyStateToProps(options);
    }
    return result;
}

export function getComponentClass(options){
    return classWrapper(options);
}