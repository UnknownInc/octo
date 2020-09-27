import NumberNode from "./Input/NumberNode"
import RandomNode from "./Input/RandomNode"
import Sample1dNode from "./Input/Sample1dNode"
import TimerNode from "./Input/TimerNode"
import AddNode from "./Math/AddNode"
import MultiplyNode from "./Math/MutiplyNode"
import DivideNode from "./Math/DivideNode"
import ColorNode from "./CSS/ColorNode"
import CartesianSampleNode from "./Array/CartesianSampleNode"
import PermutateNode from "./Array/PermutateNode"
import ArrayNode from "./Array/ArrayNode"
import RangeNode from "./Input/RangeNode"
import ButtonNode from "./MaterialUI/ButtonNode"
import DebugNode from "./DebugNode"
import MakeArrayNode from "./Array/MakeArrayNode"
import SampleArrayNode from "./Array/SampleArrayNode"

export default {
  DebugNode,
  NumberNode,
  RangeNode,
  RandomNode,
  Sample1dNode,
  TimerNode,

  SampleArrayNode,
  MakeArrayNode,
  ArrayNode,
  CartesianSampleNode,
  PermutateNode,

  AddNode,
  MultiplyNode,
  DivideNode,

  ColorNode,

  ButtonNode,
}

export const NodeList = [
  {title:DebugNode.type, group:'Debug', create:(options)=>{return DebugNode(options)}},
  
  {title:NumberNode.type, group:'Input', create:(options)=>{return NumberNode(options)}},
  {title:RangeNode.type, group:'Input', create:(options)=>{return RangeNode(options)}},
  {title:RandomNode.type, group:'Input', create:(options)=>{return RandomNode(options)}},
  {title:Sample1dNode.type, group:'Input', create:(options)=>{return Sample1dNode(options)}},
  {title:TimerNode.type, group:'Input', create:(options)=>{return TimerNode(options)}},

  {title:AddNode.type, group:'Math', create:(options)=>{return AddNode(options)}},
  {title:MultiplyNode.type, group:'Math', create:(options)=>{return MultiplyNode(options)}},
  {title:DivideNode.type, group:'Math', create:(options)=>{return DivideNode(options)}},
 
  {title:SampleArrayNode.type, group:'Array', create:(options)=>{return SampleArrayNode(options)}},
  {title:MakeArrayNode.type, group:'Array', create:(options)=>{return MakeArrayNode(options)}},
  {title:ArrayNode.type, group:'Array', create:(options)=>{return ArrayNode(options)}},
  {title:CartesianSampleNode.type, group:'Array', create:(options)=>{return CartesianSampleNode(options)}},
  {title:PermutateNode.type, group:'Array', create:(options)=>{return PermutateNode(options)}},

  {title:ColorNode.type, group:'CSS', create:(options)=>{return ColorNode(options)}},
  {title:ButtonNode.type, group:'UI', create:(options)=>{return ButtonNode(options)}},


];