## Panel Groups


`PanelGroup`s can be controlled by a parent component. The `activeKe`y prop dictates which panel is open.

`PanelGroup`s can also be uncontrolled where they manage their own state. The `defaultActiveKey` prop dictates which panel is open when initially.

---
### Accordions

`<Accordion />` aliases `<PanelGroup accordion />`.

---

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
   <td style="padding:5px"><span>`accordion`</span><span> </span></td>
   <td style="padding:5px"><div>boolean</div></td>
   <td style="padding:5px"><div>false</div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`activeKey`</span><span> </span></td>
   <td style="padding:5px"><div>any</div></td>
   <td style="padding:5px"><div></div></td>
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
   <td style="padding:5px"><span>`children`</span><span> </span></td>
   <td style="padding:5px"><div>node</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`className`</span><span> </span></td>
   <td style="padding:5px"><div>string</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`defaultActiveKey`</span><span> </span></td>
   <td style="padding:5px"><div>any</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
  <tr>
   <td style="padding:5px"><span>`onSelect`</span><span> </span></td>
   <td style="padding:5px"><div>function</div></td>
   <td style="padding:5px"><div></div></td>
   <td style="padding:5px"><div></div></td>
  </tr>
 </tbody>
</table>



---


<a href="http://react-bootstrap.github.io/components.html#panels" target="_blank">More about Panel and Panel Group</a>