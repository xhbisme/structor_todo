## LoadingButton

#### Button loading state

When activating an asynchronous action from a button it is a good UX pattern to give the user feedback as to the loading state, this can easily be done by updating 
your `<Button />`’s props from a state change like below.

    const LoadingButton = React.createClass({
      getInitialState() {
        return {
          isLoading: false
        };
      },

      render() {
        let isLoading = this.state.isLoading;
        return (
          <Button
            bsStyle='primary'
            disabled={isLoading}
            onClick={!isLoading ? this.handleClick : null}>
            {isLoading ? 'Loading...' : 'Loading state'}
          </Button>
        );
      },

      handleClick() {
        this.setState({isLoading: true});
    
        // This probably where you would have an `ajax` call
        setTimeout(() => {
    
          // Completed of async action, set loading state back
          this.setState({isLoading: false});
        }, 2000);
      }
    });

    React.render(<LoadingButton />, mountNode);

----

### Props

<table border = "1" style="width: 100%"}>
 <thead style = "background-color: GhostWhite">
 <tr>
  <th style="padding:5px">Name</th>
  <th style="padding:5px">Type</th>
  <th style="padding:5px">Default</th>
  <th style="padding:5px">Description</th>
 </tr>
 </thead>
 <tbody>
  <tr>
   <td style="padding:5px"><span>`active`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px">false</td>
   <td style="padding:5px"><div>Set a buttons active state</div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`block`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px">false</td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`bsSize`</span><span> </span></td>
   <td style="padding:5px"><div>one of: `xsmall` or `xs`, `small` or `sm`,`medium` or `md`, `large` or `lg`</div></td>
   <td style="padding:5px"></td>
   <td style="padding:5px"><div><p>Size variants</p></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`bsStyle`</span><span> </span></td>
   <td style="padding:5px"><div>one of: `default`, `primary`, `success`, `info`, `warning`, `danger`, `link`</div></td>
   <td style="padding:5px"><div>default</div></td>
   <td style="padding:5px"><div><p>Style variants</p></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`componentClass`</span><span> </span></td>
   <td style="padding:5px"><div>elementType</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div><p>You can use a custom element for this component</p></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`disabled`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px"><div>false</div></td>
   <td style="padding:5px"><div><p>Makes buttons look unclickable by fading them back 50%.</p></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`href`</span><span> </span></td>
   <td style="padding:5px"><div>string</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`navDropdown`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px"><div>false</div></td>
   <td style="padding:5px"><div><p>Changes button style to "classic" navigation link</p></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`navItem`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px"><div>false</div></td>
   <td style="padding:5px"><div><p>Changes button style to navigation Item</p></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`target`</span><span> </span></td>
   <td style="padding:5px"><div>string</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div><p>Navigation target</p></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`type`</span><span> </span></td>
   <td style="padding:5px"><div>one of: `button`, `reset`, `submit`</div></td>
   <td style="padding:5px"><div>button</div></td>
   <td style="padding:5px"><div><p>Defines HTML button type Attribute</p></div></td>
  </tr>
 </tbody>
</table>

---

<a href="http://react-bootstrap.github.io/components.html#buttons" target="_blank">More about React Bootstrap Buttons</a>
