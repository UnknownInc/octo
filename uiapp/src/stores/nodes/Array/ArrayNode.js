import React from 'react';
import Node from '../Node';
import NumberField from '../Fields/NumberField';
import ArrayField from '../Fields/ArrayField';
import NodeField from '../NodeField';

const Display=(props)=>{
  const {theme, node} = props;
  return (
    <div className='centeredcol'>
      <div>{`A[index,length]`}</div>
      <div>{node.outputs[0].join(',')}</div>
    </div>
  );
}
const ArrayNode=(function(){
  const type="Array";
  const ctor = function(props){
    const {id, x,y,inputs=[[1],0,1]} = props;
    return new Node({
      id, x, y, type,
      inputFields:[
        ArrayField({name:"Array", value:inputs[0]}),
        NumberField({name:"index", value:inputs[1]}),
        NumberField({name:"length", value:inputs[2]}),
      ],
      outputFields:[
        ArrayField({name:"out", value:inputs[0]}),
      ],
      computeFn:function(inputs){
        let array=inputs[0];
        let idx=inputs[1]%array.length;
        idx=idx>(array.length-1)?(array.length-1):idx;
        idx=idx<0?0:idx;
        let len=inputs[2];
        let eidx=idx+len;
        eidx=eidx>(array.length)?(array.length):eidx;
        eidx=eidx<0?0:eidx;

        return [
          array.slice(idx, eidx)
        ]
      },
      Display:Display,
    });
  };
  ctor.type=type;
  return ctor;
})()

export default ArrayNode;