import _ from 'lodash';
import path from 'path';
import { enrichHandlers } from './commons/metaUtils.js';
import { readFile, parse, generate, formatJs } from './commons/utils.js';
import { injectNonExistingReducer } from './reducers/reducersIndexFile.js';

export function process(dataObject){

    const { modules, meta, component: { componentName } } = dataObject;

    return Promise.resolve().then( () => {

        return readFile(modules.reducersIndex.outputFilePath).then( fileData => {
            return fileData;
        });

    }).then( fileData => {

        let newAst = null;
        try{
            const ast = parse(fileData);
            newAst = injectNonExistingReducer(ast, meta, componentName, modules.actions.relativeFilePath);
        } catch(e){
            throw Error('Parsing file: ' + modules.reducersIndex.outputFilePath + '. ' + e);
        }

        let resultSourceCode = generate(newAst);
        try{
            return formatJs(resultSourceCode);
        } catch(e){
            throw Error(e + ' Please look at file: ' + writeErrorFileFor(modules.reducersIndex.outputFilePath, resultSourceCode));
        }

    });

}

