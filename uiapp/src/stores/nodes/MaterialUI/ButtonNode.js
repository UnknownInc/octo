import React from 'react';
import Node from '../Node';
import FloatField from '../Fields/FloatField';
import { useTheme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { Popover, Paper, TextField, Button } from '@material-ui/core';
import NodeField from '../NodeField';

const Display = (props)=>{
  const buttonRef=React.useRef(null);
  const [open,setOpen] = React.useState(false);
  const {theme, node} = props;
  const o=node.outputs[0];
  return <div style={{flexGrow:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', position:'relative'}}>
      <Button size={o.size} color={o.color} variant={o.variant}>{o.text}</Button>
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
            node.inputFields[0].value= e.target.value;
          }}/>
        </Paper>
      </Popover>
  </div>
}

const ButtonNode=(function(){
  const type="Button";
  const ctor = function(props){
    const {id, x,y,inputs=['Button','medium']} = props;
    return new Node({
      id,x,y,type:type,
      headerStyle:{backgroundColor:'#079FFF', color: '#fff'},
      inputFields:[
        new NodeField({name:'text', value:inputs[0]}),
        new NodeField({name:'size', value:inputs[1]}),
        new NodeField({name:'color', value:'primary'}),
        new NodeField({name:'variant', value:'outlined'}),
        
      ],
      outputFields:[
        new NodeField({name:"out", value:{
          name:'Button', text:inputs[0], size:inputs[1], color:inputs[2], variant:inputs[3],
          jsx:`<Button color={'${inputs[2]}'}>${inputs[0]}</Button>`
        }}),
      ],
      computeFn:function(inputs){ 
        return [{
          name:'Button', text:inputs[0], size:inputs[1], color: inputs[2], variant: inputs[3],
          jsx:`<Button size={'${inputs[1]}'} color={'${inputs[2]}'}>${inputs[0]}</Button>`
        }];
      },
      Display: Display,
    });
  };
  ctor.type=type;
  return ctor;
})()

export default ButtonNode;