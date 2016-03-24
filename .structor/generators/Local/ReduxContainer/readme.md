## Generator creates a scaffold for Redux smart component structure.

##### Used libraries:
* `redux` `react-redux` `redux-actions (sequence)` `redux-promise (sequence)` `reduce-reducers`

##### Files:
* Component: `src/client/containers/{groupName}/{componentName}.jsx`
* Initial state: ```src/client/store/initialState.js```
* Actions (creators + reducers): ```src/client/actions/{groupName}/{componentName}Actions.js```
* Actions index: ```src/client/actions/index.js```
* Reducers combination: ```src/client/reducers/index.js```

___*to change output file path edit ./structor/generators/redux-smart-component/generator.json___

### Examples

Examples show how to set up a component's model with meta info before the source code generation. In meta section of each example you can see how to specify meta variables to obtain resulted JavaScript code which follows meta section.


----
## Action + event with prevent propagation + ref to input element

* ___Meta___ 

```json5
"component": {
    ...
    "handlers": {
        // set up handler function which will invoke the dispatching of printText action,
        // handler accepts only the arrow function syntax, you may specify a number of actions,
        // $inputText is a ref to input component within model scope
        "handleClick": "(e) => printText($inputText.getValue())"
    },
    "reducerRoot": "rootState" // all specified actions results will be reduced to this state node field
    ...
}
"render": {
    ...
    "type": "Button",
    "props": {
        "onClick": "$handleClick" // a reference to handler
    }
    ...
    "type": "Input",
    "props": {
        "ref": "inputText" // ref of input element see handleClick handler above
    }
    ...
}
```

* ___Component file___ 

```JavaScript
...
handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const {dispatch} = this.props;
    const {inputText} = this.refs;
    dispatch(printText(inputText.getValue()));
}
...
render(){
    ...
    return (
        <Button onClick={this.handleClick}>...</Button>
        <Input ref="inputText" />
    )
    ...
}
...

```

* ___Actions file___ ```has to be edited after saving```

```JavaScript
const PRINT_TEXT = 'PRINT_TEXT';

export const printText = createAction(PRINT_TEXT, inputText => {
    return {};
});

export default handleActions({
    [PRINT_TEXT]: (state, action) => {
        state = Object.assign({}, state, {
            result: action.payload
        });
        return state;
    }
}
```

* ___Actions index file___ ```no editing is needed```

```JavaScript
export { printText } from './TestGroup/TestComponentActions.js';
```

* ___Reducers combination file___ ```no editing is needed```

```JavaScript
import testComponentReducer from '../actions/TestGroup/TestComponentActions.js';
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    rootState: testComponentReducer
});
export default rootReducer;
```

----
## Async action + ref to input element + no state to props mapping

* ___Meta___ 

```json5
"component": {
    ...
    "handlers": {
        // set up handler function which will invoke the dispatching of printText async action,
        // handler accepts only the arrow function syntax, a number of actions can be specified,
        // $inputText is a ref to input component within model scope
        "handleClick": "() => { printText_async($inputText.getValue()) }"
    },
    "reducerRoot": "rootState" // all specified actions results will be reduced to this state node field
    ...
}
"render": {
    ...
    "type": "Button",
    "props": {
        "onClick": "$handleClick" // a reference to handler
    }
    ...
    "type": "Input",
    "props": {
        "ref": "inputText" // ref of input element see handleClick handler above
    }
    ...
}
```


* ___Component file___ 

```JavaScript
...
handleClick() {
    const {dispatch} = this.props;
    const {inputText} = this.refs;
    dispatch(printText(inputText.getValue()));
}
...
render(){
    ...
    return (
        <Button onClick={this.handleClick}>...</Button>
        <Input ref="inputText" />
    )
    ...
}
...

```

* ___Actions file___ ```has to be edited after saving```

```JavaScript
const PRINT_TEXT = 'PRINT_TEXT';

export const printText = createAction(PRINT_TEXT, inputText => {
    return Promise.resolve()
        .then(() => {
            return {};
    });
});

export default handleActions({
    [PRINT_TEXT]: {
        start(state, action) {
            ...
            return state;
        },
        next(state, action) {
            ...
            return state;
        },
        throw(state, action) {
            ...
            return state;
        }
    }
}
```

* ___Actions index file___ ```no editing is needed```

```JavaScript
export { printText } from './TestGroup/TestComponentActions.js';
```

* ___Reducers combination file___ ```no editing is needed```

```JavaScript
import testComponentReducer from '../actions/TestGroup/TestComponentActions.js';
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    rootState: testComponentReducer
});
export default rootReducer;
```

----
## Existing action - none of action creators will be generated

* ___Meta___ 

```json5
"component": {
    ...
    "handlers": {
        // set up handler function which will invoke the dispatching of printText action,
        // handler accepts only the arrow function syntax,
        // $inputText is a ref to input component within model scope
        "handleClick": "() => printText($inputText.getValue())"
    }
    ...
}
"render": {
    ...
    "type": "Button",
    "props": {
        "onClick": "$handleClick" // a reference to handler
    }
    ...
    "type": "Input",
    "props": {
        "ref": "inputText" // ref of input element see handleClick handler above
    }
    ...
}
```

* ___Component file___ 

```JavaScript
...
handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const {dispatch} = this.props;
    const {inputText} = this.refs;
    dispatch(printText(inputText.getValue()));
}
...
render(){
    ...
    return (
        <Button onClick={this.handleClick}>...</Button>
        <Input ref="inputText" />
    )
    ...
}
...

```

---
## Specify state to props mapping using the destructuring assignment syntax

* ___Meta___
  
```json5
"component": {
    ...
    // accepts only destructuring assignment syntax, 
    // possible to specify variables labels { field1: anotherName } and arrays content destructuring [{id, name}],
    // if some of fields of state does not exist they will be added to initial state in corresponding file.
    "stateToProps": "{ rootState: { domain1: { field1, field2 }, newDomain: { newField } } }"
    ...
}
...
```

* ___Component file___

```JavaScript
...
function mapStateToProps(state) {
    const { rootState: { domain1: { field1, field2, newField }, newDomain: { newField2 } } } = state;
    return {
        field1,
        field2,
        newField
    };
}
...
```

* ___Initial state file___

```JavaScript
export default {
    rootState: {
        domain1: {
            field1: 'Some existing value',
            field2: 'Another existing value',
            newField: null
        },
        newDomain: {
            newField2: null
        }
    }
};
```

----
## Assign state props values to component model props 

* ___Meta___
  
```json5
"component": {
    ...
    // accepts only destructuring assignment syntax, 
    // possible to specify variables labels and arrays content destructuring [{id, name}],
    // if some of the fields of state do not exist they will be added to the initial state in the corresponding file.
    "stateToProps": "{ rootState: { domain1: { panelHeader, field2 }, newDomain: { newField } } }"
    ...
},
"render": {
    "type": "Panel",
    "props":{
        "header": "$panelHeader" // a reference to one of state fields designated in stateToProps
    }
}
```

* ___Component file___

```JavaScript
...
render() {
    const { panelHeader, field2, newField } = this.props;
    return (<Panel header={panelHeader} >...</Panel>);
}
...
```

----
## Extract component model props as variables

* ___Meta___
  
```json5
...
"render": {
    "type": "Panel",
    "props":{
        "header": "Panel Header",
        // change style obejct to the reference variable
--      "style": {
--          "width": "100%",
--          "border": "1px solid #000000"
--      }
        // if this variable is not specified in stateToProps fields, it will be created as local variable
++      "style": "$panelStyle"
    }
}
```

* ___Component file___

```JavaScript
...
render() {
    ...
    const panelStyle = {
        width: '100%',
        border: '1px solid #000000'
    };
    return (<Panel header="Panel Header" style={panelStyle} >...</Panel>);
}
...
```

-----
## Extract component (or child) as a variable

* ___Meta___
  
```json5
...
"render": {
    "type": "Panel",
    "var": "panelVar" // this component will be assigned to local variable which will be included into JSX tree
}
```

* ___Component file___

```JavaScript
...
render() {
    ...
    const panelVar = (<Panel>...</Panel>);
    return panelVar;
}
...
```

-----
## Extract component (or child) in loop statement

* ___Meta___
  
```json5
...
"render": {
    "type": "Panel",
    "var": "panelVar_map" // this component will be pushed into a local array
}
```

* ___Component file___

```JavaScript
...
render() {
    ...
    let panelVar_list = [1];
    let panelVar = panelVar_list.map( (item, index) => {
        return (<Panel key={index} >...</Panel>);
    });
    return panelVar;
}
...
```

-----
## Extract component (or child) in loop statement traverse through one of the state props
* if propFromState is not specified in stateToProps expression new empty variable will be created.

* ___Meta___
  
```json5
...
"component": {
    ...
    "stateToProps": "{ rootState: { propFromState } }"
    ...
},
"render": {
    "type": "Panel",
    "var": "panelVar_map$propFromState" // this component will be pushed into array which is created by traversing stateToProps array field
}
```

* ___Component file___

```JavaScript
...
render() {
    ...
    let panelVar;
    if(propFromState && propFromState.length > 0){
        panelVar = propFromState.map( (item, index) => {
            return (<Panel key={index} >...</Panel>);
        })
    } else {
        panelVar = (<Panel>...</Panel>);
    }
    return panelVar;
}
...
```

-----
## Extract component (or child) in if statement

* ___Meta___
  
```json5
...
"render": {
    "type": "Panel",
    "var": "panelVar_if" // this component will be assigned to a local variable in scaffold of if expression statement
}
```

* ___Component file___

```JavaScript
...
render() {
    ...
    let panelVar = null;
    let panelVar_check = true;
    if(panelVar_check === true){
        panelVar = (<Panel key={index} >...</Panel>);
    }
    return panelVar;
}
...
```

-----
## Extract component (or child) in if statement with one of the state props
* if propFromState is not specified in stateToProps expression new empty variable will be created.

* ___Meta___
  
```json5
...
"render": {
    "type": "Panel",
    "var": "panelVar_if$propFromState"
}
```

* ___Component file___

```JavaScript
...
render() {
    ...
    let panelVar = null;
    if(propFromState === true){
        panelVar = (<Panel>...</Panel>);
    } else {
        panelVar = (<Panel>...</Panel>);
    }
    return panelVar;
}
...
```
