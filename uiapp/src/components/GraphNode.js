import React from 'react';
import { observer } from 'mobx-react-lite';
import Draggable from 'react-draggable';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOutlined from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlined from '@material-ui/icons/VisibilityOffOutlined';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Paper } from '@material-ui/core';
import { useStores } from '../stores/useStores';
import {pSBC} from '../util/colors';

const useStyles = makeStyles((_theme) => ({
  node:({preferences, isSelected})=>({
    position:'absolute',
    top:0,left:0,
    width:preferences.nodeWidth, 
    minHeight:preferences.nodeHeaderHeight,
    backgroundColor:(isSelected?'#ccc':'#eeeeee'),
    overflow:'hidden'
  }),
  handle:{ 
    display:'flex', 
    flexDirection:'row-reverse', justifyContent:'space-between', alignItems:'center',
    padding:4
  },
  output:{
    display:'flex',
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'center'
  },
  input:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  fieldName:({preferences})=>({
    maxWidth:preferences.nodeWidth-preferences.nodeWidth/10,
    textOverflow: 'ellipsis',
    overflow:'hidden',
    cursor:'e-resize'
  }),
  display:({preferences})=>({
    minWidth:preferences.nodeWidth, 
    maxWidth:(1*preferences.nodeWidth),
    height:preferences.nodeWidth, 
    boxSizing:'border-box',
    backgroundColor:'white',
    // border:'1px solid #999',
    // position:'absolute',
    display:'flex',
    overflow:'scroll'
  }),
  arrowUp: {
    width: 0, 
    height: 0, 
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid black'
  },
  
  arrowDown : {
    width: 0,
    height: 0, 
    borderLeft: '20px solid transparent',
    borderRight: '20px solid transparent',
    
    borderTop: '20px solid #f00'
  },
  
  arrowRight: {
    width: 0,
    height: 0, 
    borderTop: '0.5em solid transparent',
    borderBottom: '0.5em solid transparent',
    
    borderLeft: '0.5em solid #999',
    cursor:'e-resize'
  },
  
  arrowLeft: {
    width: 0,
    height: 0, 
    borderTop: '0.5em solid transparent',
    borderBottom: '0.5em solid transparent', 
    
    borderRight: '0.5em solid blue',
    cursor:'w-resize'
  }
}));

const EventListenerMode = {capture: true};

function preventGlobalMouseEvents () {
  document.body.style['pointer-events'] = 'none';
}

function restoreGlobalMouseEvents () {
  document.body.style['pointer-events'] = 'auto';
}

const noop=function(){};
const GraphNode = observer(({node, isSelected, onClick=noop, onCreateConnector, onUpdateConnectorPos, onEndConnector})=>{
  const {preferences} = useStores()
  const [isDragging, setIsDragging] = React.useState(false);
  const theme = useTheme();
  const classes = useStyles({node, preferences,isSelected, isDragging});

  const handleStart=()=>{
    // return false to cancel dragging
    setIsDragging(true);
  }

  const handleDrag=(_e, d)=>{
    node.moveto(d.x,d.y);
  }

  const handleStop=(e, d)=>{
    handleDrag(e,d);
    setIsDragging(false);
    if (isSelected) { onClick()};
  }

  const nodeHeight=preferences.nodeHeaderHeight+
    preferences.nodeFieldHeight*Math.max(node.inputFields.length, node.outputFields.length) +
    (node.isDisplayOn?preferences.nodeWidth:0);

  const mousemoveListener = (e)=>{
    e.stopPropagation ();
    // do whatever is needed while the user is moving the cursor around
    if (onUpdateConnectorPos){
      onUpdateConnectorPos(e);
    }
  }
  
  const mouseupListener = (e) => {
    restoreGlobalMouseEvents ();
    document.removeEventListener ('mouseup',   mouseupListener,   EventListenerMode);
    document.removeEventListener ('mousemove', mousemoveListener, EventListenerMode);
    e.stopPropagation();
    if (onEndConnector) {
      onEndConnector(e);
    }
  }
  
  const captureMouseEvents = (e) => {
    preventGlobalMouseEvents ();
    document.addEventListener ('mouseup',   mouseupListener,   EventListenerMode);
    document.addEventListener ('mousemove', mousemoveListener, EventListenerMode);
    e.preventDefault ();
    e.stopPropagation ();
  }

  const Display=node.Display;
  const headerStyle=Object.assign({},node.headerStyle,{
    cursor:(isDragging?'grabbing':'grab'), 
  })

  const maxFieldCount = Math.max(node.inputFields.length, node.outputFields.length);

  const getOutputField = (i)=>{
    if (i>=node.outputFields.length) return <div></div>;
    let f=node.outputFields[i];
    return (
    <div key={f.name} style={{top:i*preferences.nodeFieldHeight+preferences.nodeHeaderHeight, height: preferences.nodeFieldHeight}} className={classes.output} 
      onMouseDown={(e)=>{
        if (!onCreateConnector) return;
        onCreateConnector(node,i,e.nativeEvent);
        captureMouseEvents(e.nativeEvent)
      }}>
      <div className={classes.arrowRight}></div>
      <span className={classes.fieldName}>{f.name}&nbsp;</span>
    </div>
    )
  }

  const getInputField = (i)=>{
    if (i>=node.inputFields.length) return <div></div>
    let f=node.inputFields[i];
    return (
      <div key={f.name} style={{top:i*preferences.nodeFieldHeight+preferences.nodeHeaderHeight, height: preferences.nodeFieldHeight}} className={classes.input} 
        onMouseDown={(_e)=>{
          
        }}>
      <div className={classes.arrowRight}></div>
      <span className={classes.fieldName}>{f.name}&nbsp;</span>
    </div>
    )
  }

  let fields=[];
  for(let i=0;i<maxFieldCount;i++){
    fields.push(<div key={i} style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:"100%"}}>
      {getInputField(i)}
      {getOutputField(i)}
    </div>);
  }

  return ( <Draggable
    handle=".gn-handle"

    defaultPosition={{x: 0, y: 0}}
    position={{x:node.x, y:node.y}}
    grid={[preferences.snapWidth, preferences.snapWidth]}
    scale={preferences.scale}

    onStart={handleStart}
    onDrag={handleDrag}
    onStop={handleStop}
  >
    <Paper className={classes.node} style={{height:nodeHeight, zIndex:isSelected?2:1}} elevation={isSelected?6:3} 
      onClick={onClick}>
      <div className={`gn-handle ${classes.handle}`} style={headerStyle}>
        <div style={{}}>
          <IconButton size='small' onClick={()=>{node.setDisplayOn(!node.isDisplayOn);}}>
            {node.isDisplayOn?<ExpandLessIcon/>:<ExpandMoreIcon/>}
          </IconButton>
        </div>
        <div style={{width:preferences.nodeWidth-34, overflow:'hidden', textOverflow:'ellipsis'}}>{node.name||node.type}</div>
      </div>

      {fields}
      <div style={{display:(node.isDisplayOn?'flex':'hidden')}} className={classes.display}>
        <Display node={node} theme={theme}/>
      </div>
      {/* added to force dom updates output change */}
      <div style={{position:'absolute', color:'transparent'}}>{node.outputs.length}</div>
    </Paper>
  </Draggable> );
})
export default GraphNode;