import React from 'react';
import Node from '../Node';
import NodeField from '../NodeField';
import FloatField from '../Fields/FloatField';

const ColorNode=(function(){
  const type="Color";
  const ctor = function(props){
      const {id, x,y,inputs=[255,255,255,1]} = props;

      return new Node({
        id, x, y, type,
        inputFields:[
          FloatField({name:"R", value:inputs[0]}),
          FloatField({name:"G", value:inputs[1]}),
          FloatField({name:"B", value:inputs[2]}),
          FloatField({name:"A", value:inputs[3]}),
        ],
        outputFields:[
          new NodeField({name:"out", value:(`rgba(${inputs[0]},${inputs[1]},${inputs[2]},${inputs[3]})`)}),
        ],
        computeFn:function(inputs){
          return [`rgba(${inputs[0]},${inputs[1]},${inputs[2]},${inputs[3]})`]
        },
        Display: function(props){
          const {theme, node} = props;
          return <div style={{flexGrow:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
            backgroundColor:node.outputs[0]
            }}>
            <span>{node.outputs[0]}</span>
          </div>
        },
      });
    };
    ctor.type=type;
    return ctor;
})();

export default ColorNode;