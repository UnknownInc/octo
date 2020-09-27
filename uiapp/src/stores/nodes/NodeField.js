import { observable, action } from 'mobx'
let suffix=1;
export default class NodeField {
  @observable value;

  constructor({value, name=`Field${suffix++}`, type='NodeField'}){
    this.value = value;
    this.name = name;
    this.type = type;
  }

  toJSON(){
    return {
      value: this.value,
      name: this.name,
      type: this.type,
    }
  }
  
  @action
  updateFromJSON(o){
    this.value=o.value;
    this.name=o.name;
    this.type=o.type;
  }
}