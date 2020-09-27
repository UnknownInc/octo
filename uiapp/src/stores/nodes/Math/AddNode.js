import React from 'react';
import Node from '../Node';
import FloatField from '../Fields/FloatField';

const AddNode=(function(){
  const type="Add";
  const ctor = function(props){
      const {id, x,y,inputs=[0,0]} = props;

      return new Node({
        id, x, y, type,
        inputFields:[
          FloatField({name:"A", value:inputs[0]}),
          FloatField({name:"B", value:inputs[1]}),
        ],
        outputFields:[
          FloatField({name:"out", value:(inputs[0]+inputs[1])}),
        ],
        computeFn:function(inputs){
          return [
            inputs[0]+inputs[1]
          ]
        },
        Display: function(props){
          const {theme, node} = props;
          return <div style={{flexGrow:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <span>A + B</span>
            <span>{node.outputs[0]}</span>
          </div>
        },
      });
    };
    ctor.type=type;
    return ctor;
})();

export default AddNode;