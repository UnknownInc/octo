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

import { TextField, InputAdornment, Switch, IconButton } from '@material-ui/core';
import { useStores } from './stores/useStores';

const LeftPanel = observer((props)=>{
  const {preferences, doc} = useStores();
  return (
    <List component="nav" aria-label="options" dense>
      <ListSubheader>{`Experiment`}</ListSubheader>
      <ListItem>
        <TextField label='Name'
          value={doc.name}
          onChange={(e)=>(doc.name=e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BuildIcon />
              </InputAdornment>
            ),
          }}
        />
      </ListItem>
      <ListItem>
        <TextField label='Variations' 
          type="number"
          value={doc.variationsCount}
          onChange={(e)=>{doc.variationsCount=e.target.value;}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AppsIcon />
              </InputAdornment>
            ),
          }}
        />
      </ListItem>

      <ListSubheader>{`Parameters`}</ListSubheader>
      <ListItem button>
        <ListItemIcon><ListIcon/></ListItemIcon>
        <ListItemText primary="Add Parameter"/><AddIcon/>
      </ListItem>

      <ListSubheader>{`Preferences`}</ListSubheader>
      <ListItem>
        <ListItemIcon>
          {preferences.showGrid?<GridOnIcon/>:<GridOffIcon/>}
        </ListItemIcon>
        <ListItemText id='switch-list-label-grid' primary="Show Grid" />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={()=>{preferences.showGrid=!preferences.showGrid;}}
            checked={preferences.showGrid}
            inputProps={{ 'aria-labelledby': 'switch-list-label-grid' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText inset primary="Snap" />
      </ListItem>
    </List>
  );
});

export default LeftPanel;