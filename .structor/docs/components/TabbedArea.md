## TabbedArea  (Togglable tabs)

Add quick, dynamic tab functionality to transition through panes of local content.


---

## Props

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
   <td style="padding:5px"><span>`activeKey`</span><span> </span></td>
   <td style="padding:5px"><div>any</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`animation`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px"><div>true</div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`bsStyle`</span><span> </span></td>
   <td style="padding:5px"><div>one of: `tabs`, `pills`</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div>Navigation style for tabs <br> If not specified, it will be treated as `tabs` when vertically positioned and `pills` when horizontally positioned.</div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`defaultActiveKey`</span><span> </span></td>
   <td style="padding:5px"><div>any</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  
  <tr>
   <td style="padding:5px"><span>`id`</span><span> </span></td>
   <td style="padding:5px"><div>string | number</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`onSelect`</span><span> </span></td>
   <td style="padding:5px"><div>function</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`paneWidth`</span><span> </span></td>
   <td style="padding:5px"><div>number | object</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div>Number of grid columns for the panes if horizontally positioned <br>This accepts either a single width or a mapping of size to width. 
   If not specified, it will be treated as `styleMaps.GRID_COLUMNS` minus `tabWidth`.</div></td>
  </tr>
  
  <tr>
   <td style="padding:5px"><span>`position`</span><span> </span></td>
   <td style="padding:5px"><div>one of: `top`, `left`, `right`</div></td>
   <td style="padding:5px"><div>top</div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`tabWidth`</span><span> </span></td>
   <td style="padding:5px"><div>number | object</div></td>
   <td style="padding:5px"><div>2</div></td>
   <td style="padding:5px"><div>Number of grid columns for the tabs if horizontally positioned <br>This accepts either a single width or a mapping of size to width.</div></td>
  </tr>
 </tbody>
</table>

---

### Tab Props

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
   <td style="padding:5px"><span>`animation`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px"><div>true</div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`disabled`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`title`</span><span> </span></td>
   <td style="padding:5px"><div>node</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
 </tbody>
</table>

---

<a href="http://react-bootstrap.github.io/components.html#tabs" target="_blank">More about Tabs</a>