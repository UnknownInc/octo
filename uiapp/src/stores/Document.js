import { observable, action, computed, autorun } from 'mobx'
import { v4 as uuidv4, v4} from 'uuid';
import Logger from '../Log';
import Node from './nodes/Node';
import NumberNode from './nodes/Input/NumberNode';
import AddNode from './nodes/Math/AddNode';
import Connection from './Connection';
import TimerNode from './nodes/Input/TimerNode';
import Sample1dNode from './nodes/Input/Sample1dNode';
import RandomNode from './nodes/Input/RandomNode';

import {NodeList} from './nodes';
import MakeArrayNode from './nodes/Array/MakeArrayNode';

const log = new Logger('Document');


export default class Document {
  @computed get id () {
    return this._id;
  }
  @observable name;
  @observable variationsCount=10;
  @observable nodes = [];
  @observable connections = [];
  @computed get experimentNode() {
    const matches = this.nodes.filter(n=>n.type==='ExperimentNode');
    return matches[0];
  }
  @computed get outputs(){
    return this.nodes.filter(n=>n.type==='Button');
  }

  constructor({id=uuidv4(), nodes=[], connections=[], name='New', variationsCount=10}) {
    this._id = id;
    this.name = name;
    this.variationsCount = variationsCount;
    this.nodes = [...nodes];
    this.connections = [...connections];

    if (process.env.NODE_ENV==='development' && this.nodes.length===0){
      this.nodes.push(TimerNode({id:'t1', x:10, y:10}));
      this.nodes.push(NumberNode({id:'n1', x:10, y:200, inputs:[10]}));
      this.nodes.push(NumberNode({id:'n2', x:180, y:280, inputs:[20]}));
      this.nodes.push(AddNode({id:'add1', x:380, y:180, inputs:[0,0]}));
      this.nodes.push(Sample1dNode({id:'s1', x:300, y:200, inputs:[[1,2,3]]}));
      this.nodes.push(RandomNode({id:'r1', x:300, y:20}));
      this.nodes.push(MakeArrayNode({id:'mk1', x:80,y:300, inputs:[
        ['small','medium','large'],
        ['outlined', 'contained', 'text'],
        ['primary','secondary'],
        ['Checkout','Buy now', 'Purchase', 'Order']
      ]}))

      this.connections.push(new Connection({fromId:'t1', toId:'add1'}))
      this.connections.push(new Connection({fromId:'n1', toId:'add1', toIdx:1}));
    }
    this.init();
  }

  @action
  init(){
    this._ardisposer = autorun(()=>{
      for(let i=0;i<this.connections.length;i++){
        const cn=this.connections[i];
        const sn=this.nodes.filter(n=>n.id==cn.fromId)[0];
        const en=this.nodes.filter(n=>n.id==cn.toId)[0];
        sn.connectTo(cn.fromIdx, en, cn.toIdx)
      }
      console.log(`${this.connections.length} connections made`);
    })
  }

  toJSON(){
    let result = {
      id:this.id.toString(),
      name: this.name,
      variationsCount: this.variationsCount,
      nodes:[],
      connections:[],
    }
    this.nodes.forEach(n=>result.nodes.push(n.toJSON()));
    this.connections.forEach(c=>result.connections.push(c.toJSON()));
    return result;
  }

  @action
  fromJSON(o){
    this._ardisposer();
    this._id=o.id;
    this.name=o.name;
    this.variationsCount=(o.variationsCount||10);
    this.nodes.clear();
    this.connections.clear();

    o.nodes.forEach(n=>{
      let ntype=NodeList.filter(t=>t.title===n.type)[0];
      if (ntype) {
        this.nodes.push(ntype.create(n));
      }
    })

    o.connections.forEach(c=>this.connections.push(new Connection(c)));
    this.init();
  }
}