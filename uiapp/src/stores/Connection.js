import { observable, action, computed } from 'mobx'
import { v4 as uuidv4, v4} from 'uuid';
import Logger from '../Log';

const log = new Logger('Connection');


export default class Connection {
  
  @observable fromId;
  @observable fromIdx;
  @observable toId;
  @observable toIdx;

  get id(){return this._id};
  constructor({id=uuidv4(), fromId, fromIdx=0, toId, toIdx=0}){
    this._id=id;
    this.fromId=fromId;
    this.fromIdx=fromIdx;
    this.toId=toId;
    this.toIdx=toIdx;
  }

  toJSON(){
    let result = {
      id:this.id,
      fromId:this.fromId,
      fromIdx:this.fromIdx,
      toId:this.toId,
      toIdx:this.toIdx,
    }
    return result;
  }

  @action
  updateFromJSON(o){
    this._id=o.id;
    this.fromId=o.fromId;
    this.fromIdx=o.fromIdx;
    this.toId=o.toId;
    this.toIdx=o.toIdx;
  }
}