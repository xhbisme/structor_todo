import { traverse } from '../commons/utils.js';

export function getNonExistingActions(ast, actionsMap){
    const result = new Map();
    const existing = new Map();
    traverse(ast, node => {

        if(node.type === 'ExportNamedDeclaration' && node.specifiers && node.specifiers.length > 0){
            node.specifiers.forEach( specifier => {
                existing.set(specifier.exported.name, true);
            });
        }

    });

    actionsMap.forEach( (action, name) =>{
        if(!existing.has(name)){
            result.set(name, actionsMap.get(name));
        }
    });

    return result;
}
