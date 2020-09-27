import NodeField from '../NodeField';
let suffix=1;
const NumberField = ({value=1.0, name=`Number${suffix++}`})=>{
  return new NodeField({
    value:Number.isNaN(value)?parseFloat(''+value):value,
    name:name,
    type:'Number'
  });
}

export default NumberField;