import React from 'react';
import Node from '../Node';
import FloatField from '../Fields/FloatField';
import { IconButton } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import NumberField from '../Fields/NumberField';

const TimerNode=(function(){
  const type="Timer";
  const ctor = function(props){
    const {id, x,y,inputs=[1000, 0],} = props;
    const interval=Number.parseFloat(inputs[0])
    const n=new Node({
      id,x,y,type,
      inputFields:[
        NumberField({name:"interval", value:interval}),
        NumberField({name:"count", value:inputs[1]||0}),
      ],
      outputFields:[
        FloatField({name:"out", value:0}),
      ],
      computeFn:function(inputs){ return [inputs[2]||this.outputFields[0].value]},
      Display: function(props){
        const {theme, node} = props;
        return renderOutputs(node.outputs)
      },
    });
    let counter=0;
    n.inputs.push(counter);
    let timer;
    const startTimer=()=>{
      timer=setInterval(()=>{
        n.inputs[2]=counter++;
      }, interval);
    }
    const stopTimer=()=>{
      clearInterval(timer);
      timer=null;
      counter=0;
      n.inputs[2]=counter;
    }
    const renderOutputs=(outputs)=>{
      return <div style={{flexGrow:1, display:'flex', flexDirection:'column', justifyContent:'space-around', alignItems:'center'}}>
        <div>
          <IconButton onClick={()=>{
            timer?stopTimer():startTimer();
          }}>
            {timer?<StopIcon/>:<PlayArrowIcon/>}
          </IconButton>
        </div>
        <div>{outputs[0]}</div>
        <div></div>
      </div>;
    }
    return n;
  };
  ctor.type=type;
  return ctor;
})();

export default TimerNode;