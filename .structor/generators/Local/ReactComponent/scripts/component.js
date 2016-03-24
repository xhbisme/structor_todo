import path from 'path';
import _ from 'lodash';
import { formatJs, readFile, writeFile, writeErrorFileFor } from './commons/utils.js';
import { getMetaModel, enrichRefs, enrichHandlers, enrichPropVars } from './commons/metaUtils.js';
import { makeFlatMetaSyncWithModel } from './component/componentUtils.js';
import { getComponentClass } from './component/componentClass.js';
import * as api from './component/index.js';

export function preProcess(dataObject){

    return Promise.resolve()
        .then( () => {
            return readFile(path.join(dataObject.generator.dirPath, 'readme.md'));
        })
        .then (readmeFile => {
            return {
                metaModel: {
                    component: {
                        handlers: {
                            handleOnClick: '(e) => {}',
                            handleOnChange: '() => {}'
                        }
                    },
                    render: getMetaModel(dataObject.component.model)[0]
                },
                metaHelp:  readmeFile
            };
        });

}

export function process(dataObject){

    return Promise.resolve().then( () => {
        const { component: { model, outputFilePath, imports, componentName }, meta } = dataObject;

        let metaObj = enrichHandlers(enrichPropVars(enrichRefs(meta)));

        makeFlatMetaSyncWithModel(metaObj, model);

        let resultSourceCode = getComponentClass({
            imports, componentName, model, meta: metaObj, api
        });

        try{
            return formatJs(resultSourceCode);
        } catch (e){
            throw Error(e + ' Please look at file: ' + writeErrorFileFor(outputFilePath, resultSourceCode));
        }
    });

}

