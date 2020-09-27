import NodeField from '../NodeField';
let suffix=1;
const ArrayField = ({value=[], name=`Array${suffix++}`})=>{
  return new NodeField({
    value:[...value],
    name:name,
    type:'Array'
  });
}

export default ArrayField;