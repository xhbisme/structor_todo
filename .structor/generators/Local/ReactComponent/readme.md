## Generator creates a scaffold for React component class.

##### Files:
* Component: `src/client/containers/{groupName}/{componentName}.jsx`

___*to change output file path edit ./structor/generators/redux-dumb-component/generator.json___

### Examples

Examples show how to set up a component's model with meta info before the source code generation. In meta section of each example you can see how to specify meta variables to obtain resulted JavaScript code which follows meta section.


----
## Declare simple props passed to component

* ___Meta___ 

```json5
...
"render": {
    "type": "Panel",
    "props": {
        "bsStyle": "$panelStyle" // this.props.panelStyle
    },
    "children": [
        {
            "type": "p",
            "children": [
                {
                    "type": "span",
                    "text": "$paragraphText" // this.props.paragraphText
                }
            ]
        }
    ]
}
```

* ___Component file___ 

```JavaScript
...
    render() {
        const {panelStyle, paragraphText} = this.props;
        return (<Panel bsStyle={ panelStyle }>
                    <p>
                        <span>{ paragraphText }</span>
                    </p>
                </Panel>
            );
    }
...
TestPanel.defaultProps = {
    panelStyle: 'undefined',
    paragraphText: 'Empty Panel'
};
TestPanel.propTypes = {
    panelStyle: PropTypes.string,
    paragraphText: PropTypes.string
};
...

```

----
## Declare shaped props passed to component

* ___Meta___ 

```json5
...
"render": {
    "type": "Panel",
    "props": {
        "bsStyle": "$panelData.panelStyle" // this.props.panelData.panelStyle
    },
    "children": [
        {
            "type": "p",
            "children": [
                {
                    "type": "span",
                    "text": "$panelData.paragraphText" // this.props.panelData.paragraphText
                }
            ]
        }
    ]
}
```

* ___Component file___ 

```JavaScript
...
    render() {
        const {panelData} = this.props;
        return (<Panel bsStyle={ panelData.panelStyle }>
                    <p>
                        <span>{ panelData.paragraphText }</span>
                    </p>
                </Panel>
            );
    }
...
TestPanel.defaultProps = {
    panelData: {
        panelStyle: 'undefined',
        paragraphText: 'Empty Panel'
    }
};
TestPanel.propTypes = {
    panelData: PropTypes.shape({
        panelStyle: PropTypes.string,
        paragraphText: PropTypes.string
    })
};
...

```

----
## Declare handlers for functions passed as props to component

* ___Meta___ 

```json5
"component": {
    "handlers": {
        // set up handler function which will invoke the call of passed function,
        // handler accepts only the arrow function syntax, you may specify a number of calls,
        // $inputText is a ref to input component within model scope,
        // if 'e' char is specified then preventDefault function of event will be called in the body of handler.
        "handleOnClick": "(e) => { $onPanelButtonClick($inputText.getValue()) }"
    }
},
"render": {
    "type": "Panel",
    "children": [
        {
            "type": "Input",
            "props": {
                "ref": "inputText", // a ref in handleOnClick handler, see above
                 ...
            }
        },
        {
            "type": "Button",
            ...
            "props": {
                "bsStyle": "default",
                "onClick": "$handleOnClick" // a reference to handleOnClick 
            }
        }
    ]
}
```

* ___Component file___ 

```JavaScript
...
    constructor(props, content) {
        super(props, content);
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    handleOnClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const {onPanelButtonClick} = this.props;
        const {inputText} = this.refs;
        if (onPanelButtonClick) {
            onPanelButtonClick(inputText.getValue());
        }
    }
    ...
    render() {
        return (<Panel {...this.props}>
                    <Input
                           ref="inputText"
                           type="text"
                           hasFeedback={ true }
                           label="Label for input" />
                    <Button
                            bsStyle="default"
                            onClick={ this.handleOnClick }>
                        <span>Default</span>
                    </Button>
                </Panel>
            );
    }
...
TestPanel.propTypes = {
    onPanelButtonClick: PropTypes.func
};
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


