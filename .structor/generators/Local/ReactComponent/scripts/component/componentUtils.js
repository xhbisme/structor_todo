import _ from 'lodash';
import { traverseModelWithResult } from '../commons/utils.js';

function countModel(model){
    let counter = 0;
    traverseModelWithResult(model, (node, dummy) => {
        if(!node.type){
            throw Error('Some of nodes in tree does not have "type" field');
        }
        //if(!node.props){
        //    throw Error('Some of nodes in tree does not have "props" field');
        //}
        node.seqID = ++counter;
        return dummy;
    }, 0);
    return counter;
}

function makeFlat(model){
    let result = [];
    traverseModelWithResult(model, (node, list) => {
        list.push({
            seqID: node.seqID,
            type: node.type,
            props: node.props,
            text: node.text,
            'var': node['var']
        });
        return list;
    }, result);
    return result;
}

export function makeFlatMetaSyncWithModel(meta, model){

    if(!meta.render){
        throw Error('Meta info field "render" is missing');
    }
    let metaCount = countModel(meta.render);
    let modelCount = countModel(model);
    if(metaCount !== modelCount){
        throw Error('Meta info has less nodes in tree than model for generation');
    }
    let flatMeta = makeFlat(meta.render);
    let newRender = {};
    flatMeta.forEach( item => {
        newRender[item.seqID] = item;
    });
    meta.render = newRender;
}