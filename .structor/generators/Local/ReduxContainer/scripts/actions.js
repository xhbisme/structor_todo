
import _ from 'lodash';
import path from 'path';
import { enrichHandlers } from './commons/metaUtils.js';
import { readFile, parse, generate, formatJs, writeErrorFileFor } from './commons/utils.js';
import { getNonExistingActions } from './actionsIndex/actionsUtils.js';
import { getActionsFile } from './actions/actionsFile.js';
import * as api from './actions/index.js';

export function process(dataObject){

    const { modules, meta } = dataObject;

    return Promise.resolve().then( () => {

        return readFile(modules.actionsIndex.outputFilePath);

    }).then( fileData => {

        const ast = parse(fileData);
        let metaObj = enrichHandlers(meta);
        const nonExistingActionsMap = getNonExistingActions(ast, metaObj.actions);

        if(nonExistingActionsMap.size > 0){
            let resultSourceCode = getActionsFile({ meta: metaObj, newActions: nonExistingActionsMap, api });
            try{
                return formatJs(resultSourceCode);
            } catch (e){
                throw Error(e + ' Please look at file: ' + writeErrorFileFor(modules.actions.outputFilePath, resultSourceCode));
            }
        } else {
            return '';
        }

    });

}

