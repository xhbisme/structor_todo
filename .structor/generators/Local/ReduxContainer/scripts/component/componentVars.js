import _ from 'lodash';
import { isMetaRef, getMetaRefName, fixText } from '../commons/metaUtils.js';

export function getComponentVars(options){
    let result = '';

    const { model, meta, api } = options;
    meta.localVars = new Map();
    api.fillLocalVars({ model, meta, api });

    meta.localVars.forEach( localVarExpression => {
        result += localVarExpression + ';\n';
    });

    return result;
}

export function fillLocalVars(options){
    const { model, model: { seqID, props, text: modelText }, meta, api } = options;
    const { props: metaProps, text: metaText } = meta.render[seqID];
    if(metaProps && !_.isEmpty(metaProps)){
        _.forOwn(metaProps, (value, prop) => {
            if(isMetaRef(value)){
                const localVarName = getMetaRefName(value);
                if(!meta.propVars.has(localVarName)
                    && !meta.localVars.has(localVarName)
                    && !meta.handlerFuncs.has(localVarName)){

                    let modelPropValue = props[prop];
                    if(modelPropValue !== undefined){
                        meta.localVars.set(localVarName, api.getLocalVarValue({ value: modelPropValue, prop: localVarName, meta, api }));
                    } else {
                        let emptyValue = 'undefined';
                        if(localVarName === 'style'){
                            emptyValue = { border: '1px solid #000' };
                        }
                        meta.localVars.set(localVarName, api.getLocalVarValue({ value: emptyValue, prop: localVarName, meta, api }));
                    }
                }
            }
        });
    }

    if(isMetaRef(metaText)) {
        const localVarName = getMetaRefName(metaText);
        if(!meta.propVars.has(localVarName) && !meta.localVars.has(localVarName)){
            meta.localVars.set(localVarName, 'let ' + localVarName + ' = \'' + fixText(modelText) + '\'');
        }
    }

    if(model.children && model.children.length > 0){
        model.children.forEach( child => {
            api.fillLocalVars({ model: child, meta, api });
        });
    }
}

export function getLocalVarValue(options){
    const { value, prop, meta, api } = options;

    let result = 'let ';
    if(_.isArray(value)){
        result += prop + ' = ' + api.getVarValue({ value, api });
    } else if(_.isObject(value)){
        if(value['type']){
            result += prop +" = (" + api.getChildComponent({ model: value, meta, api }) + ')';
        } else {
            result += prop + " = " + api.getVarValue({ value, api });
        }
    } else if (_.isString(value) && value.length > 0) {
        result += prop + " = " + api.getVarValue({ value, api });
    } else if (_.isBoolean(value) || _.isNumber(value)) {
        result += prop + " = " + api.getVarValue({ value, api });
    }
    return result;
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

