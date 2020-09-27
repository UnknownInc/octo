import React from 'react';
import { observer } from 'mobx-react-lite';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import BuildIcon from '@material-ui/icons/Build';
import GridOnIcon from '@material-ui/icons/GridOn';
import GridOffIcon from '@material-ui/icons/GridOff';
import ListIcon from '@material-ui/icons/List';
import AddIcon from '@material-ui/icons/Add';
import AppsIcon from '@material-ui/icons/Apps';

import { TextField, InputAdornment, Switch, IconButton, Divider } from '@material-ui/core';
import { useStores } from './stores/useStores';

import MUIpage from './stores/nodes/MaterialUI/htmlUtils';
const RightPanel = observer((props)=>{
  const {preferences, doc} = useStores();
  console.log(doc.outputs.length);
  const srcdoc=MUIpage(doc.outputs);
  return (
    <div className='centeredcol'>
      <iframe srcDoc={srcdoc} width='100%' height='100%' style={{border:'none'}}/>
      {/*<Divider orientation='horizontal'/> 
      <iframe srcdoc={`
      <html>
      <head>
      </head>
      <body style='color:red;'>
      <p>Hello world!</p>
      </body>
      </html>
      `} width='100%' height='100%' style={{border:'none'}}/>*/}
      <div style={{}}>{doc.outputs.length}</div>
    </div>
  );
});

export default RightPanel;