import React, {memo} from 'react';
import Node from '../Node';
import FloatField from '../Fields/FloatField';
import NumberField from '../Fields/NumberField';
import { useTheme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { Popover, Paper, TextField } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList, areEqual } from 'react-window';
import memoize from 'memoize-one';

import { useStores } from '../../useStores';

// If list items are expensive to render,
// Consider using React.memo or shouldComponentUpdate to avoid unnecessary re-renders.
// https://reactjs.org/docs/react-api.html#reactmemo
// https://reactjs.org/docs/react-api.html#reactpurecomponent
const Row = memo(({ data, index, style }) => {
 
  // Data passed to List as "itemData" is available as props.data
  const { items, theme } = data;
  const item = items[index];
 
  return (
    // <div
    //   onClick={() => toggleItemActive(index)}
    //   style={style}
    // >
    //   {item.label} is {item.isActive ? 'active' : 'inactive'}
    // </div>
    // <div style={style}>
    //   {item}
    // </div>
    <ListItem button style={style} key={index}>
      {/* <ListItemText primary={`${index}: ${node.outputs[0][index].toFixed(1)}...`} /> */}
      <span>{`${item.toFixed(3)}...`}</span>
    </ListItem>
  );
}, areEqual);
 
// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.
const createItemData = memoize((items, theme) => ({
  items,
  theme,
}));

const Display = (props)=>{
  const {preferences} = useStores();
  const buttonRef=React.useRef(null);
  const [open,setOpen] = React.useState(false);
  const {theme, node} = props;
  const o=node.outputs[0];

  // Bundle additional data to list items using the "itemData" prop.
  // It will be accessible to item renderers as props.data.
  // Memoize this data to avoid bypassing shouldComponentUpdate().
  const itemData = createItemData(o, theme);
  return <div style={{flexGrow:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', position:'relative'}}>
    {/* <span>{`[${o[0]}...${o[o.length-1]}]`}</span> 
      <span>{o.join(',')}</span>*/}
      <div style={{}}>
        <FixedSizeList height={preferences.nodeWidth-theme.spacing(1)} width={preferences.nodeWidth-theme.spacing(1)} itemSize={36} itemCount={node.outputs[0].length}
          itemData={itemData}
        >
          {Row}
        </FixedSizeList>
      </div>
      <Tooltip title="Edit Number" aria-label="edit number">
        <IconButton ref={buttonRef} size='small' style={{position:'absolute', right:theme.spacing(1), bottom:theme.spacing(1)}}
          onClick={()=>{
            setOpen(true);
          }}
        >
          <EditIcon/>
        </IconButton>
      </Tooltip>
      <Popover anchorEl={buttonRef.current} open={open} 
        onClose={()=>setOpen(false)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}>
        <Paper elevation={3} style={{padding:theme.spacing(1)}}>
          <TextField label='Start' value={node.inputFields[0].value} onChange={(e)=>{
            let n=Number.parseFloat(e.target.value);
            if (!Number.isNaN(n)){
              node.inputFields[0].value=n;
            }
          }} type='number'/>
          <TextField label='End' value={node.inputFields[1].value} onChange={(e)=>{
            let n=Number.parseFloat(e.target.value);
            if (!Number.isNaN(n)){
              node.inputFields[1].value=n;
            }
          }} type='number'/>
          <TextField label='Count' value={node.inputFields[2].value} onChange={(e)=>{
            let n=Number.parseFloat(e.target.value);
            if (!Number.isNaN(n)){
              node.inputFields[2].value=n;
            }
          }} type='number'/>
        </Paper>
      </Popover>
  </div>
}

const RangeNode=(function(){
  const type="Range";
  const ctor = function(props){
    const {id, x,y,inputs=[0,10,10]} = props;
    return new Node({
      id,x,y,type:type,
      inputFields:[
        NumberField({name:'start', value:inputs[0]}),
        NumberField({name:'end', value:inputs[1]}),
        NumberField({name:'count', value:inputs[2]}),
      ],
      outputFields:[
        FloatField({name:"out", value:[0,1,2,3,4,5,6,7,8,9]}),
      ],
      computeFn:function(inputs){ 
        const result=[];
        let start = inputs[0];
        let end =inputs[1];
        let count=inputs[2]<1?1:inputs[2];

        let inc=(end-start)/(count);
        for(let i=0;i<count;i++){
          result[i]=start+i*inc;
        }
        return [result];
      },
      Display: Display,
    });
  };
  ctor.type=type;
  return ctor;
})()

export default RangeNode;