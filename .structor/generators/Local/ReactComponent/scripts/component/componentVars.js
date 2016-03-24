import _ from 'lodash';
import { isMetaRef, getMetaRefObj, fixText } from '../commons/metaUtils.js';

export function getComponentVars(options){

    const { model, meta, api, componentName } = options;
    meta.localVars = new Map();
    meta.localTypes = new Map();
    api.fillLocalVars({ model, meta, api });

    let result = '';
    if(meta.localVars.size > 0){
        result += componentName + '.defaultProps = {';
        meta.localVars.forEach( (localVar, name) => {
            if(localVar.members){
                result += ' ' + name + ': {';
                localVar.members.forEach( (member, name) => {
                    result += ' ' + member + ',';
                });
                result = result.substr(0, result.length - 1);
                result += '},'
            } else {
                result += ' ' + localVar + ',';
            }
        });
        result = result.substr(0, result.length - 1) + '};\n';
    }
    if(meta.localTypes.size > 0 || meta.actions.size > 0){
        result += componentName + '.propTypes = {';
        meta.localTypes.forEach( (localType, name) => {
            if(localType.members){
                result += ' ' + name + ': PropTypes.shape({';
                localType.members.forEach( (member, name) => {
                    result += ' ' + member + ',';
                });
                result = result.substr(0, result.length - 1);
                result += '}),'
            } else {
                result += ' ' + localType + ',';
            }
        });
        meta.actions.forEach( (actions, name) => {
            result += name + ': PropTypes.func,'
        });
        result = result.substr(0, result.length - 1) + '};\n';
    }

    return result;
}

export function fillLocalVars(options){
    const { model: { seqID, props, text: modelText, children }, meta, api } = options;
    const { props: metaProps, text: metaText } = meta.render[seqID];
    if(metaProps && !_.isEmpty(metaProps)){
        _.forOwn(metaProps, (value, prop) => {
            let modelPropValue = props[prop];
            if(modelPropValue === undefined){
                if(prop === 'style'){
                    modelPropValue = { border: '1px solid #000' };
                } else {
                    modelPropValue = 'undefined';
                }
            }
            api.getLocalVarValue({ value: modelPropValue, metaRef: value, api, meta });
        });
    }

    if(isMetaRef(metaText)) {
        api.getLocalVarValue({ value: fixText(modelText), metaRef: metaText, api, meta });
    }

    if(children && children.length > 0){
        children.forEach( child => {
            api.fillLocalVars({ model: child, meta, api });
        });
    }
}

export function getLocalVarValue(options){
    const { value, metaRef, api, meta } = options;
    if(isMetaRef(metaRef)){
        const metaRefObj = getMetaRefObj(metaRef);
        if(metaRefObj){
            if(!meta.handlerFuncs.has(metaRefObj.member)){
                if(metaRefObj.shape){
                    let shapeObj = meta.localVars.get(metaRefObj.shape);
                    if(!shapeObj){
                        shapeObj = {
                            members: new Map()
                        };
                        meta.localVars.set(metaRefObj.shape, shapeObj);
                    }
                    shapeObj.members.set(metaRefObj.member, api.getVarValue({ value, prop: metaRefObj.member, api }));

                    let typeShape = meta.localTypes.get(metaRefObj.shape);
                    if(!typeShape){
                        typeShape = {
                            members: new Map()
                        };
                        meta.localTypes.set(metaRefObj.shape, typeShape);
                    }
                    typeShape.members.set(metaRefObj.member, api.getVarType({ value, prop: metaRefObj.member}));


                } else if(metaRefObj.member) {
                    meta.localVars.set(metaRefObj.member, api.getVarValue({ value, prop: metaRefObj.member, api }));
                    meta.localTypes.set(metaRefObj.member, api.getVarType({ value, prop: metaRefObj.member}));
                }
            }
        } else {
            throw Error('Meta ref has not proper format: ' + value);
        }
    }
}

export function getVarValue(options){
    const { value, prop, api } = options;
    let result = '';
    if(value !== undefined){
        if(_.isString(value) && value.length > 0){
            if(prop){
                result += prop + ': ';
            }
            result += '\'' + value + '\',';
        } else if(_.isBoolean(value) || _.isNumber(value)){
            if(prop){
                result += prop + ': ';
            }
            result += value + ',';
        } else if(_.isArray(value) && value.length > 0){
            if(prop){
                result += prop + ': ';
            }
            result += '[';
            value.forEach( item => {
                result += api.getVarValue({ value: item, api }) + ',';
            });
            result = result.substr(0, result.length - 1);
            result += '],';
        } else if(_.isObject(value) && !_.isEmpty(value)){
            if(prop){
                result += prop + ': ';
            }
            result += '{';
            _.forOwn(value, (objValue, objProp) => {
                result += api.getVarValue({ value: objValue, prop: objProp, api }) + ',';
            });
            result = result.substr(0, result.length - 1);
            result += '},';
        }
        result = result.substr(0, result.length - 1);
    }
    return result;
}

export function getVarType(options){
    const { value, prop } = options;
    let result = '';
    if(value !== undefined){
        if(_.isString(value) && value.length > 0){
            if(prop){
                result += prop + ': ';
            }
            result += 'PropTypes.string,';
        } else if(_.isBoolean(value)){
            if(prop){
                result += prop + ': ';
            }
            result += 'PropTypes.bool,';
        } else if(_.isNumber(value)){
            if(prop){
                result += prop + ': ';
            }
            result += 'PropTypes.number,';
        } else if(_.isArray(value) && value.length > 0){
            if(prop){
                result += prop + ': ';
            }
            result += 'PropTypes.array,';
        } else if(_.isObject(value) && !_.isEmpty(value)){
            if(prop){
                result += prop + ': ';
            }
            result += 'PropTypes.object,';
        }
        result = result.substr(0, result.length - 1);
    }
    return result;
}

