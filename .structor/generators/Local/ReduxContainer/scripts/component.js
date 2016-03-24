import path from 'path';
import _ from 'lodash';
import { formatJs, readFile, writeFile, writeErrorFileFor } from './commons/utils.js';
import { enrichStateToPropVars, getMetaModel, enrichRefs, enrichHandlers } from './commons/metaUtils.js';
import { makeFlatMetaSyncWithModel } from './component/componentUtils.js';
import { getComponentClass } from './component/componentClass.js';
import * as api from './component/index.js';

export function preProcess(dataObject){

    let resultObject = {
        metaModel: null,
        metaHelp: ''
    };
    return Promise.resolve()
        .then(() => {
            return readFile(path.join(dataObject.generator.dirPath, 'readme.md'))
                .then(readmeFile => {
                    resultObject.metaHelp = readmeFile;
                });
        }).then(() => {
            return readFile(path.join(dataObject.generator.dirPath, 'log.json')).then(logFile => {
                let logFileJSON = JSON.parse(logFile);
                resultObject.metaModel = logFileJSON[dataObject.component.componentName];
                if(resultObject.metaModel){
                    resultObject.metaModel.render = getMetaModel(dataObject.component.model)[0];
                }
            }).catch(err => {
                // do nothing
            });
        })
        .then (() => {
            if(!resultObject.metaModel){
                resultObject.metaModel = {
                    component: {
                        stateToProps: '',
                        handlers: {
                            componentWillReceiveProps: '(nextProps) => {}',
                            componentWillUpdate: '(nextProps, nextState) => {}',
                            componentDidMount: '() => {}'
                        },
                        reducerRoot: _.camelCase(dataObject.component.componentName)
                    },
                    render: getMetaModel(dataObject.component.model)[0]
                };
            }
            return resultObject;
        });

}

export function process(dataObject){

    return Promise.resolve().then( () => {
        const { component: { model, outputFilePath, imports, componentName }, modules, meta } = dataObject;

        const logFilePath = path.join(dataObject.generator.dirPath, 'log.json');
        return readFile(logFilePath).then(logFile => {
            let logFileJSON = JSON.parse(logFile);
            logFileJSON[componentName] = meta;
            return logFileJSON;
        }).then(jsonData => {
            writeFile(logFilePath, JSON.stringify(jsonData));
        }).catch(err => {
            writeFile(logFilePath, JSON.stringify({ [componentName]: meta }));
        }).then( () => {
            let metaObj = enrichHandlers(enrichRefs(enrichStateToPropVars(meta)));

            metaObj.actionsIndexFilePath = modules.actionsIndex.relativeFilePath;

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

    });

}

