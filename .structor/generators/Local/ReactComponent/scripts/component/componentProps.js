import _ from 'lodash';
import { isMetaRef, getMetaRefObj } from '../commons/metaUtils.js';

export function getComponentProps(options){
    const { model: { seqID, props }, meta, api } = options;
    const metaProps = seqID !== undefined ? meta.render[seqID].props : undefined;
    let result = '';
    if(metaProps && !_.isEmpty(metaProps)){
        _.forOwn(metaProps, (value, prop) => {
            if(isMetaRef(value)){
                const metaRefObj = getMetaRefObj(value);
                if(metaRefObj){
                    const localVarName = metaRefObj.fullName;
                    if(meta.handlerFuncs.has(localVarName)){
                        result += ' ' + prop + '={this.' + localVarName + '} ';
                    } else {
                        result += ' ' + prop + '={' + localVarName + '} ';
                    }
                }

            } else {
                let modelPropValue = props[prop];
                if(modelPropValue !== undefined){
                    result += api.getJSXPropValue({ value: modelPropValue, prop, meta, api });
                } else {
                    result += api.getJSXPropValue({ value, prop, meta, api });
                }
            }
        });
    } else if (props && !_.isEmpty(props)) {
        _.forOwn(props, (value, prop) => {
            result += api.getJSXPropValue({value, prop, meta, api});
        });
    }
    return result;
}

export function getJSXPropValue(options){
    const { value, prop, meta, api } = options;
    let result = ' ';
    if(_.isArray(value)){
        result += prop + '={ ' + api.getPropValue({ value, api }) + ' } ';
    } else if(_.isObject(value)){
        if(value['type']){
            result += prop +"={ " + api.getChildComponent({ model: value, meta, api }) + '} ';
        } else {
            result += prop + "={ " + api.getPropValue({ value, api }) +  ' } ';
        }
    } else if (_.isString(value) && value.length > 0) {
        result += prop + "=" + api.getPropValue({ value, api }) + ' ';
    } else if (_.isBoolean(value) || _.isNumber(value)) {
        result += prop + "={" + api.getPropValue({ value, api }) + '} ';
    }
    return result;
}

export function getPropValue(options){
    const { value, prop, api } = options;
    let result = '';
    if(value !== undefined){
        if(_.isString(value) && value.length > 0){
            if(prop){
                result += '"' + prop + '": ';
            }
            result += '"' + value + '",';
        } else if(_.isBoolean(value) || _.isNumber(value)){
            if(prop){
                result += '"' + prop + '": ';
            }
            result += value + ',';
        } else if(_.isArray(value) && value.length > 0){
            if(prop){
                result += '"' + prop + '": ';
            }
            result += '[';
            value.forEach( item => {
                result += api.getPropValue({ value: item, api }) + ',';
            });
            result = result.substr(0, result.length - 1);
            result += '],';
        } else if(_.isObject(value) && !_.isEmpty(value)){
            if(prop){
                result += '"' + prop + '": ';
            }
            result += '{';
            _.forOwn(value, (objValue, objProp) => {
                result += api.getPropValue({ value: objValue, prop: objProp, api }) + ',';
            });
            result = result.substr(0, result.length - 1);
            result += '},';
        }
        result = result.substr(0, result.length - 1);
    }
    return result;
}

