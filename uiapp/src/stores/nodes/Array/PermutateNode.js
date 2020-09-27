import React from 'react';
import Node from '../Node';
import NumberField from '../Fields/NumberField';
import NodeField from '../NodeField';
import ArrayField from '../Fields/ArrayField';

function permutate(permutation) {
  var length = permutation.length,
      result = [permutation.slice()],
      c = new Array(length).fill(0),
      i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

const PermutateNode=(function(){
  const type="Permutate";
  const ctor = function(props){
    const {id, x,y,inputs=[[1,2,3],0]} = props;
    //TODO: validate inputs
    return new Node({
      id, x, y, type,
      inputFields:[
        ArrayField({name:"array", value:inputs[0]}),
        NumberField({name:"step", value:inputs[1]}),
      ],
      outputFields:[
        ArrayField({name:"out", value:inputs[0]}),
      ],
      computeFn:function(inputs){
        const allpermutations=permutate(inputs[0]);
        let idx=Math.trunc(inputs[1]) % (allpermutations.length);
        return [
          allpermutations[idx]
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

export default PermutateNode;