import React from 'react';
import Node from './Node';
import NodeField from './NodeField';

const DebugNode=(function(){
  const type="Debug";
  const ctor = function(props){
    const {id, x,y,inputs=[]} = props;
    return new Node({
      id, x, y, type,
      inputFields:[
        new NodeField({name:"any", value:inputs[0]}),
      ],
      outputFields:[
        new NodeField({name:"out", value:inputs[0]}),
      ],
      computeFn:function(inputs){
        return [inputs[0]];
      },
      Display: function(props){
        const {theme, node} = props;
        return <div className={'centeredcol'}>
          <span>{JSON.stringify(node.outputs[0])}</span>
        </div>
      },
    });
  };
  ctor.type=type;
  return ctor;
})();

export default DebugNode;