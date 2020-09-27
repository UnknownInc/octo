import React from 'react';
import Node from '../Node';
import NumberField from '../Fields/NumberField';
import ArrayField from '../Fields/ArrayField';

import { useTheme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import { Box, Popover, Paper, TextField, Divider, Button, List, ListItem, ListItemSecondaryAction } from '@material-ui/core';
import NodeField from '../NodeField';

const Display=(props)=>{
  const buttonRef=React.useRef(null);
  const [open,setOpen] = React.useState(false);
  const [editingValue,setEditingValue] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const {theme, node} = props;

  const handleListItemClick = (_e, index) => {
    if (selectedIndex===index){
      setEditingValue('')
      setSelectedIndex(-1);
    } else {
      setEditingValue(node.inputFields[0].value[index]);
      setSelectedIndex(index);
    }
  };
  return <div className='centeredcol' style={{position:'relative'}}>
    <div>{node.outputs[0]}</div>
    <Tooltip title="Edit Defaults" aria-label="edit number">
        <IconButton ref={buttonRef} size='small' style={{position:'absolute', right:theme.spacing(1), bottom:theme.spacing(1)}}
          onClick={()=>{
            setOpen(true);
          }}
        >
          <EditIcon/>
        </IconButton>
      </Tooltip>
      <Popover anchorEl={buttonRef.current} open={open} 
        onClose={()=>setOpen(false)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}>
        <Paper elevation={3} style={{padding:theme.spacing(1)}}>
          <div className='centeredrow'>
            <TextField label='Value' value={editingValue} onChange={(e)=>{
              setEditingValue(e.target.value);
            }}/>
            <Button onClick={()=>{
              if (selectedIndex===-1) {
                node.inputFields[0].value.push(editingValue);
              } else {
                node.inputFields[0].value[selectedIndex]=editingValue;
              }
            }}>{selectedIndex===-1?'Add':'Update'}</Button>
          </div>
          <Box my={1}><Divider orientation='horizontal'/></Box>
          <List dense>
            {node.inputFields[0].value.map((v,i)=>{
              return <ListItem key={i} button
                selected={selectedIndex === i}
                onClick={(event) => handleListItemClick(event, i)}
                >
                {v}
                  <ListItemSecondaryAction>
                    <IconButton size='small' edge="end" aria-label="delete"
                      onClick={()=>{
                        node.inputFields[0].value.splice(i,1);
                        if (selectedIndex===i) {
                          setSelectedIndex(-1);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
            })}
          </List>
        </Paper>
      </Popover>
  </div>
}

const Sample1dNode=(function(){
  const type="Sample1d";
  const ctor = function(props){
    const {id, x,y,inputs=[[1],0]} = props;
    return new Node({
      id, x, y, type,
      inputFields:[
        ArrayField({name:"array", value:inputs[0] }),
        NumberField({name:"step", value:(inputs[1]||0) }),
      ],
      outputFields:[
        NumberField({name:"out", value:inputs[0][(inputs[1]||0)] }),
      ],
      computeFn:function(inputs){
        let idx=Math.trunc(inputs[1] % (inputs[0].length));
        return [
          inputs[0][idx]
        ]
      },
      Display: Display,
    });
  };
  ctor.type=type;
  return ctor;
})()

export default Sample1dNode;