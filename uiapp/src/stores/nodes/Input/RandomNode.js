import React from 'react';
import Node from '../Node';
import FloatField from '../Fields/FloatField';
import NumberField from '../Fields/NumberField';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { Popover, Paper, TextField } from '@material-ui/core';
import NodeField from '../NodeField';

const Display = (props)=>{
  const buttonRef=React.useRef(null);
  const [open,setOpen] = React.useState(false);
  const {theme, node} = props;
  return <div style={{flexGrow:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', position:'relative'}}>
    <span>{node.outputs[0].toFixed(4)}...</span>
      <Tooltip title="Edit Maxvalue" aria-label="edit max value">
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
          <TextField label='Max' value={node.inputFields[1].value} onChange={(e)=>{
            let n=Number.parseFloat(e.target.value);
            if (!Number.isNaN(n)){
              node.inputFields[1].value=n;
            }
          }} type='number'/>
        </Paper>
      </Popover>
  </div>
}

const RandomNode=(function(){
  const type="Random";
  const ctor = function(props){
    const {id, x,y, inputs=[1,1]} = props;
    return new Node({
      id, x, y, type,
      inputFields:[
        NumberField({name:'step', value:inputs[0]}),
        NumberField({name: 'max', value:inputs[1]})
      ],
      outputFields:[
        FloatField({name:"out", value:Math.random()}),
      ],
      computeFn:function(inputs){
        let v=(inputs?inputs[0]:1)+1;//plus 1 to avoid divide from zero
        let max=(inputs?inputs[1]:1);
        return [
          (Math.random()*max*v)/v
        ]
      },
      Display: Display,
    });
  };
  ctor.type=type;
  return ctor;
})()

export default RandomNode;