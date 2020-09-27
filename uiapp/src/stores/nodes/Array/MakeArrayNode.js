import React from 'react';
import Node from '../Node';
import NumberField from '../Fields/NumberField';
import NodeField from '../NodeField';
import ArrayField from '../Fields/ArrayField';


const MakeArrayNode=(function(){
  const type="MakeArray";
  const ctor = function(props){
    const {id, x,y,inputs=[1]} = props;
    //TODO: validate inputs
    return new Node ({
      id, x, y, type,
      inputFields:[
        new NodeField({name:'A', value:inputs[0]}),
        new NodeField({name:'B', value:inputs[1]}),
        new NodeField({name:'C', value:inputs[2]}),
        new NodeField({name:'D', value:inputs[3]}),
        new NodeField({name:'E', value:inputs[4]}),
        new NodeField({name:'F', value:inputs[5]}),
      ],
      outputFields:[
        new NodeField({name:"out", value:[...inputs]}),
      ],
      computeFn:function(inputs) {
        let result=[];
        for(let i=0;i<inputs.length;i++){
          if (inputs[i]!==null && inputs[i]!==undefined) {
            result.push(inputs[i]);
          }
        }
        console.log(result);
        return [
          result
        ]
      },
      Display: function(props){
        const {theme, node} = props;
        return <div style={{flexGrow:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
        }}>
          <div>{node.outputs[0].join(',')}</div>
        </div>
      },
    });
  };
  ctor.type=type;
  return ctor;
})()

export default MakeArrayNode;