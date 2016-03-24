import _ from 'lodash';
import { traverseModel } from '../commons/utils.js';
import { isMetaRef, getMetaRefObj, getMetaVarObject } from '../commons/metaUtils.js';

const childComponentEmpty = _.template(
`<<%= model.type %><%= propsObj %><%= api.getComponentProps({ model: model, meta: meta, api: api }) %> />\n`);

const childComponentWithText = _.template(
`<<%= model.type %><%= propsObj %><%= api.getComponentProps({ model: model, meta: meta, api: api }) %>>
    <%= model.text %>
</<%= model.type %>>\n`);

const childComponentWithVar = _.template(
`<<%= model.type %><%= propsObj %><%= api.getComponentProps({ model: model, meta: meta, api: api }) %>>
    {<%= varName %>}
</<%= model.type %>>\n`);

const childComponent = _.template(
`<<%= model.type %><%= propsObj %><%= api.getComponentProps({ model: model, meta: meta, api: api }) %>>
    <%= api.getComponentChildren({ model: model, meta: meta, api: api }) %>
</<%= model.type %>>\n`);

const localVarForChild = _.template(
`let <%= metaVarName %> = (<%= api.getChildComponent({ model: model, meta: meta, api: api }) %>);\n`);

const localVarForChildMapTraverse = _.template(
`let <%= metaVarName %>;
if(<%= traverseVarName %> && <%= traverseVarName %>.length > 0){
    <%= metaVarName %> = <%= traverseVarName %>.map( (item, index) => {
        return (<%= api.getChildComponent({ model: model, meta: meta, api: api }, ' key={index} ') %>);
    })
} else {
    <%= metaVarName %> = (<%= api.getChildComponent({ model: model, meta: meta, api: api }) %>);
}\n`);

const localVarForChildMapTraverseLocalVar = _.template(
`let <%= traverseVarName %> = [];
let <%= metaVarName %>;
if(<%= traverseVarName %> && <%= traverseVarName %>.length > 0){
    <%= metaVarName %> = <%= traverseVarName %>.map( (item, index) => {
        return (<%= api.getChildComponent({ model: model, meta: meta, api: api }, ' key={index} ') %>);
    })
} else {
    <%= metaVarName %> = (<%= api.getChildComponent({ model: model, meta: meta, api: api }) %>);
}\n`);

const localVarForChildMapTraverseEmpty = _.template(
`let <%= metaVarName %>_list = [1];
let <%= metaVarName %> = <%= metaVarName %>_list.map( (item, index) => {
    return (<%= api.getChildComponent({ model: model, meta: meta, api: api }, ' key={index} ') %>);
});\n`);

const localVarForChildIfTraverse = _.template(
`let <%= metaVarName %> = null;
if(<%= traverseVarName %> === true){
    <%= metaVarName %> = (<%= api.getChildComponent({ model: model, meta: meta, api: api }) %>);
} else {
    <%= metaVarName %> = (<%= api.getChildComponent({ model: model, meta: meta, api: api }) %>);
}\n`);

const localVarForChildIfTraverseLocalVar = _.template(
`let <%= traverseVarName %> = true;
let <%= metaVarName %> = null;
if(<%= traverseVarName %> === true){
    <%= metaVarName %> = (<%= api.getChildComponent({ model: model, meta: meta, api: api }) %>);
} else {
    <%= metaVarName %> = (<%= api.getChildComponent({ model: model, meta: meta, api: api }) %>);
}\n`);

const localVarForChildIfTraverseEmpty = _.template(
`let <%= metaVarName %> = null;
let <%= metaVarName %>_check = true;
if(<%= metaVarName %>_check === true){
    <%= metaVarName %> = (<%= api.getChildComponent({ model: model, meta: meta, api: api }) %>);
}\n`);

function parseMetaVar(metaVar){
    if( metaVar && _.isString(metaVar) && metaVar.length > 0 ){
        const metaVarArray = metaVar.split('_');
        //console.log(JSON.stringify(metaVarArray));
        if(metaVarArray[0]){
            return {
                varName: metaVarArray[0],
                traverseAs: metaVarArray[1],
                traverseVarName: (metaVarArray[2] && metaVarArray[2].indexOf('$') === 0) ? metaVarArray[2].substr(1) : undefined
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function getChildComponent(options, withProps = ''){
    const { model, meta } = options;
    options.propsObj = withProps;
    if(model.text){
        const { seqID } = model;
        const metaVar = seqID !== undefined ? meta.render[seqID].text : undefined;
        if(isMetaRef(metaVar)){
            const metaRefObj = getMetaRefObj(metaVar);
            if(metaRefObj){
                options.varName = metaRefObj.fullName;
                return childComponentWithVar(options);
            } else {
                return childComponentWithText(options);
            }
        } else {
            return childComponentWithText(options);
        }
    } else if(model.children && model.children.length > 0){
        return childComponent(options);
    } else {
        return childComponentEmpty(options);
    }
}

export function getComponentChildren(options){
    let result = '';
    const { model, meta, api } = options;
    if(model.children && model.children.length > 0){
        model.children.forEach( child => {
            const { seqID } = child;
            const metaVar = seqID !== undefined ? meta.render[seqID].var : undefined;
            const metaVarObj = getMetaVarObject(metaVar);
            if(metaVarObj){
                result += '{ '+ metaVarObj.varName +' }';
            } else {
                result += api.getChildComponent({ model: child, meta, api });
            }
        });
    }
    return result;
}

export function getComponentChildrenVars(options){
    let result = '';
    const { model, meta, api } = options;

    meta.childrenVars = new Map();

    traverseModel(model, child => {
        const { seqID } = child;
        const metaVar = seqID !== undefined ? meta.render[seqID].var : undefined;
        const metaVarObj = getMetaVarObject(metaVar);
        if(metaVarObj){
            const { varName: metaVarName, ext: traverseAs, extRef: traverseVarName } = metaVarObj;
            if(meta.propVars && meta.propVars.has(metaVarName)){
                throw Error('Ambiguity in variable definition for element "' + child.type + '". Variable: "'
                    + metaVar + '" has the same name as property mapped from the state');
            }
            if(meta.localVars && meta.localVars.has(metaVarName)){
                throw Error('Duplicate variable definition "'+ metaVarName + '"');
            }
            //if(traverseVarName && !meta.propVars.has(traverseVarName)){
            //    throw Error('Check snippets extensions. Variable "' + traverseVarName + '" was not specified in stateToProps');
            //}
            let childVar;
            if(traverseAs === 'map'){
                if(traverseVarName){
                    if(meta.propVars.has(traverseVarName)){
                        childVar = localVarForChildMapTraverse({ metaVarName, traverseVarName, model: child, meta, api });
                    } else {
                        if(meta.localVars && meta.localVars.has(traverseVarName)){
                            throw Error('Duplicate variable definition "'+ metaVarName + '" in map snippet');
                        }
                        childVar = localVarForChildMapTraverseLocalVar({ metaVarName, traverseVarName, model: child, meta, api });
                    }
                } else {
                    childVar = localVarForChildMapTraverseEmpty({ metaVarName, model: child, meta, api });
                }
            } else if(traverseAs === 'if') {
                if(traverseVarName){
                    if(meta.propVars.has(traverseVarName)){
                        childVar = localVarForChildIfTraverse({ metaVarName, traverseVarName, model: child, meta, api });
                    } else {
                        if(meta.localVars && meta.localVars.has(traverseVarName)){
                            throw Error('Duplicate variable definition "'+ metaVarName + '" in if snippet');
                        }
                        childVar = localVarForChildIfTraverseLocalVar({ metaVarName, traverseVarName, model: child, meta, api });
                    }
                } else {
                    childVar = localVarForChildIfTraverseEmpty({ metaVarName, model: child, meta, api });
                }
            } else {
                childVar = localVarForChild({ metaVarName, model: child, meta, api });
            }
            meta.childrenVars.set(metaVarName, childVar);
        }
    });

    let metaVars = [];
    meta.childrenVars.forEach( childVar => {
        metaVars.push(childVar);
    });

    metaVars.reverse();
    metaVars.forEach( metaVar => {
        result += metaVar;
    });

    return result;
}

export function getRootComponent(options){
    let result = '';
    const { model, model: { seqID }, meta, api } = options;
    const metaVar = seqID !== undefined ? meta.render[seqID].var : undefined;
    const metaVarObj = getMetaVarObject(metaVar);
    if(metaVarObj){
        result += 'return ' + metaVarObj.varName + ';\n';
    } else {
        result += 'return (' + api.getChildComponent({ model, meta, api }, ' {...this.props} ') + ');\n';
    }
    return result;
}
