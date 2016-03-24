import _ from 'lodash';
import { getNonExistingActions } from './actionsUtils.js';

export function injectNonExistingActions(ast, actionsMap, actionsFilePath){
    _.remove(ast.body, item => {
        return (item.type === 'ExportNamedDeclaration' && item.source && item.source.value === actionsFilePath);
    });
    const nonExistingActionsMap = getNonExistingActions(ast, actionsMap);
    if(nonExistingActionsMap.size > 0){
        if(ast.body){
            let specifiers = [];
            nonExistingActionsMap.forEach((action, name) => {
                specifiers.push({
                    type: "ExportSpecifier",
                    exported: {
                        "type": "Identifier",
                        "name": name
                    },
                    local: {
                        "type": "Identifier",
                        "name": name
                    }
                });
            });
            ast.body.splice(0, 0, {
                type: "ExportNamedDeclaration",
                declaration: null,
                specifiers: specifiers,
                "source": {
                    "type": "Literal",
                    "value": actionsFilePath,
                    "raw": '\'' + actionsFilePath + '\''
                }
            });
        }
    }
    return ast;
}

