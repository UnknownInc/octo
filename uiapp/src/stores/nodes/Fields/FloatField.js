import { observable, action, computed } from 'mobx'
import NodeField from '../NodeField';
let suffix=1;
const FloatField = ({value=1.0, name=`Float${suffix++}`})=>{
  return new NodeField({
    value:parseFloat(''+value),
    name:name,
    type:'Float'
  });
}

export default FloatField;