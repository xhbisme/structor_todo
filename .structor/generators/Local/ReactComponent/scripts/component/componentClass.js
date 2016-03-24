import _ from 'lodash';

const header = _.template(
`import React, { Component, PropTypes } from 'react';\n`);

const headerImportsMembers = _.template(
`import { <%= members.join(',') %> } from '<%= relativeSource %>';\n`);

const headerImportsDefaults = _.template(
`import <%= name %> from '<%= relativeSource %>';\n`);

const classWrapper = _.template(
`<%= api.getComponentClassHeader() %><%= api.getComponentClassMemberImports({ imports: imports }) %><%= api.getComponentClassDefaultImports({ imports: imports }) %>
class <%= componentName %> extends Component {

    constructor(props, content) {
        super(props, content);<%= api.getHandlersBinds({ model: model, meta: meta, api: api }) %>}
    <%= api.getHandlers({ model: model, meta: meta, api: api }) %>
    render() {
        <%= api.getRenderVars({ meta: meta }) %><%= api.getComponentChildrenVars({ model: model, meta: meta, api: api }) %><%= api.getRootComponent({ model: model, meta: meta, api: api }) %>}
}
<%= api.getComponentVars({ model: model, meta: meta, api: api, componentName: componentName }) %>
export default <%= componentName %>;\n`);

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


export function getRenderVars(options){
    const { meta: { propVars } } = options;
    let result = '';
    if(propVars && propVars.size > 0){
        result += 'const {';
        propVars.forEach( (shape, name) => {
            result += name + ',';
        });
        result = result.substr(0, result.length - 1) + '} = this.props;\n';
    }
    return result;
}

export function getComponentClass(options){
    return classWrapper(options);
}