import React from 'react';
import Node from '../Node';
import FloatField from '../Fields/FloatField';
import { useTheme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { Popover, Paper, TextField } from '@material-ui/core';
import NodeField from '../NodeField';

const Display = (props)=>{
  const buttonRef=React.useRef(null);
  const [open,setOpen] = React.useState(false);
  const {theme, node} = props;
  return <div className='centeredcol' style={{position:'relative'}}>
    <span>{node.outputs[0]}</span>
      <Tooltip title="Edit Number" aria-label="edit number">
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
          <TextField label='Value' value={node.inputFields[0].value} onChange={(e)=>{
            let n=Number.parseFloat(e.target.value);
            if (!Number.isNaN(n)){
              node.inputFields[0].value=n;
            }
          }} type='number'/>
        </Paper>
      </Popover>
  </div>
}

const NumberNode=(function(){
  const type="Number";
  const ctor = function(props){
    const {id, x,y,inputs=[1]} = props;
    const value=Number.parseFloat(inputs[0]+'');
    return new Node({
      id,x,y,type:type,
      headerColor:'#00E6C3',
      inputFields:[
        new NodeField({name:'A', value})
      ],
      outputFields:[
        FloatField({name:"out", value}),
      ],
      computeFn:function(inputs){ return [(Number.isNaN(inputs[0])?Number.parseFloat(inputs[0]):inputs[0])]},
      Display: Display,
    });
  };
  ctor.type=type;
  return ctor;
})()

export default NumberNode;