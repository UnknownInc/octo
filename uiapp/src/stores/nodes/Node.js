import React from 'react';
import { observable, action, computed } from 'mobx'
import { v4 as uuidv4} from 'uuid';
import Logger from '../../Log';


const log = new Logger('Node');


export default class Node {

  get id () {
    return this._id;
  };

  @observable x;

  @observable y;

  @observable isDisplayOn=true;

  @observable inputs=[];
  @observable outputConnections={};
  @computed get outputs () {
    // log.info(`updating ${this.id}`);
    let inputs=[];
    let results=[];
    for(let i=0;i<this.inputs.length;i++){
      let iv=this.inputs[i];
      if (iv!==null){
        inputs.push(iv)
      } else if(this.inputFields[i]){
        inputs.push(this.inputFields[i].value);
      }
    }
    if (this._computeFn) {
      results = this._computeFn(inputs);
    }
    for(let i=0;i<results.length;i++){
      const cns=this.outputConnections[i+''];
      if (cns) {
        for(let c=0;c<cns.length;c++) {
          setImmediate(()=>{
            cns[c].node.updateInput(cns[c].idx, results[i]);
          });
        }
      }
    }
    return results;
  }

  @action updateInput(idx, value){
    this.inputs[idx]=value;
  }

  get type() {
    return this._type;
  };

  get inputFields() {
    return this._inputFields;
  }

  get outputFields() {
    return this._outputFields;
  }

  constructor({id=uuidv4(), type='', x=0, y=0, inputFields=[], outputFields=[], 
    computeFn, Display, isDisplayOn=true,
    headerStyle={},
  }){
    log.info('ctor');
    this.x=x;
    this.y=y;

    this._id=id;
    this._type=type;
    this._inputFields=inputFields;
    this._outputFields=outputFields;
    this.headerStyle = Object.assign({}, {
      color:'#000',
      background:'#b4b4b4'
    }, headerStyle);
    this.isDisplayOn=isDisplayOn;
    //this._outputs=observable([]);

    for(let i=0;i<this._outputFields.length;i++) {
      this.outputConnections[i+'']=[];
    }

    for(let i=0;i<this._inputFields.length;i++){
      this.inputs.push(null);
    } 


    if (computeFn) {
      this._computeFn = computeFn.bind(this);
    } else {
      this._computeFn = (_inputs)=>{
        let results=[];
        for(let i=0;i<this._outputFields.length;i++){
          results.push(this._outputFields[i].value);
        }
        return results;
      }
    }

    if (Display) {
      this.Display = Display;
    } else {
      this.Display = ()=>{
        return <div style={{display:'flex', flexGrow:1, backgroundColor:'white'}}></div>
      }
    }

  }

  @action
  connectTo(outputIdx, node, inputIdx){
    if (outputIdx>=0 && outputIdx<this.outputFields.length) {
      let cns = this.outputConnections[outputIdx+''];
      let m=cns.filter(c=>(c.node.id===node.id && c.idx===inputIdx));
      if (m.length>0) return false; //noting to do; already connected
      
      log.info(`connecting ${this.id}[${outputIdx}] to ${node.id}[${inputIdx}]`);
      this.outputConnections[outputIdx+''].push({node:node, idx:inputIdx}) 
      node.inputs[inputIdx] = this.outputs[outputIdx];
    }
  }

  @action
  removeOutputConnection(outputIdx, node, inputIdx){
    if (outputIdx>=0 && outputIdx<this.outputFields.length) {
      let cns = this.outputConnections[outputIdx+''];
      let m=cns.filter(c=>(c.node.id===node.id && c.idx===inputIdx));
      if (m.length==0) return false; //noting to do; already disconnected

      log.info(`disconnecting ${this.id}[${outputIdx}] to ${node.id}[${inputIdx}]`);
      this.outputConnections[outputIdx+''].remove(m[0]);
      node.inputs[inputIdx] = node.inputFields[inputIdx].value;
    }
  }

  @action
  setDisplayOn(displayOn){
    this.isDisplayOn=displayOn;
  }

  @action
  moveto(x,y){
    this.x=x;
    this.y=y;
  }

  toJSON(){
    let result={
      id: this.id.toString(),
      x: this.x, y: this.y,
      type: this.type,
      inputs:this.inputFields.map(i=>i.value),
      isDisplayOn: this.isDisplayOn,
    }
    return result;
  }

  static createFromJSON(o){

  }
}
