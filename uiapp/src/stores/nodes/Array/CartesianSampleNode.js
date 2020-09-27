import React from 'react';
import Node from '../Node';
import NumberField from '../Fields/NumberField';
import NodeField from '../NodeField';
import ArrayField from '../Fields/ArrayField';

// Generate cartesian product of given iterables:
function* cartesian(head, ...tail) {
  let remainder = tail.length ? cartesian(...tail) : [[]];
  for (let r of remainder) for (let h of head) yield [h, ...r];
}

// Example:
// const first  = ['a', 'b', 'c', 'd'];
// const second = ['e'];
// const third  = ['f', 'g', 'h', 'i', 'j'];

// console.log(...cartesian(first, second, third));

const CartesianSampleNode=(function(){
  const type="CartesianSample";
  const ctor = function(props){
    const {id, x,y,inputs=[ [[1,2,3],[4,5,6],[7,8,9,10]], 0]} = props;
    //TODO: validate inputs
    return new Node ({
      id, x, y, type,
      inputFields:[
        ArrayField({name:"array", value:inputs[0]}),
        NumberField({name:"step", value:(inputs[1]||0)}),
      ],
      outputFields:[
        new NodeField({name:"out", value:inputs[0][0]}),
      ],
      computeFn:function(inputs) {
        let inputValue=[...inputs[0]];
        inputValue.forEach((iv,i)=>{
          if (Array.isArray(iv)===false){
            console.log('..making array at idx:'+i);
            inputValue[i]=[iv];
          }
        })
        //console.log(inputValue);
        const allsets=[...cartesian(...inputValue)];
        //console.log(allsets);
        let idx=Math.trunc(inputs[1]) % (allsets.length);
        return [
          allsets[idx]
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

export default CartesianSampleNode;