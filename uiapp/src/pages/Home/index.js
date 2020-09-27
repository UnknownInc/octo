import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import Box from '@material-ui/core/Box';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useStores } from '../../stores/useStores';
import GraphNode from '../../components/GraphNode';
import SVGComponent from '../../components/SVGComponent';
import Spline from '../../components/Spline';
import Connection from '../../stores/Connection';

import SaveIcon from '@material-ui/icons/Save';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';


import {NodeList} from '../../stores/nodes'; 

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));

const canvasStyle=(p)=>({
  position:'absolute',top:0,left:0,
  width:p.canvasWidth,height:p.canvasHeight,
  boxSizing: 'border-box',
  overflow:'scroll',
  backgroundSize: `${p.gridWidth}px ${p.gridWidth}px`,
  backgroundImage:p.showGrid?`
    linear-gradient(to right, ${p.gridColor} 1px, transparent 1px),
    linear-gradient(to bottom, ${p.gridColor} 1px, transparent 1px)
  `:'',
  transformOrigin:'top left',
  transform:`scale(${p.canvasScale})`,
});

const actions = [
  { icon: <SaveIcon />, name: 'Save' },
];

function CanvasSpeedDials({onActionClick}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = (a) => {
    if (a && a.name && onActionClick){
      onActionClick(a.name)
    }
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial example"
      className={classes.speedDial}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      hidden={false}
      open={open}
      direction={'up'}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={()=>{handleClose(action)}}
        />
      ))}
    </SpeedDial>
  );
}

const NodeCanvas= observer(() => {
  const {doc, preferences} = useStores();
  const [pos, setPos] = React.useState({x:0, y:0});
  const [endPos, setEndPos] = React.useState({x:0, y:0});
  let [dragging, setDragging] = React.useState(null);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const menuAnchorEl = React.useRef(null);
  const canvasEl = React.useRef(null);

  React.useEffect(()=>{
    const handleMouseMove = (e)=>{
      if (openMenu) return;
      window.canvasmousepos = {x:e.pageX, y:e.pageY};
    }
    document.addEventListener('mousemove', handleMouseMove);


    const handleKeyPress = (e)=>{
      if (e.code==='Space' && e.target===document.body){
        const {x, y} = window.canvasmousepos;
        let cr=canvasEl.current.getClientRects();
        let dp = {x:cr[0].x,y:cr[0].y};
        let pos={
          x:(x-dp.x)/preferences.canvasScale,
          y:(y-dp.y)/preferences.canvasScale
        };
        console.log(pos);
        setPos(pos);
        setOpenMenu(true);
        e.preventDefault();
        return;
      }

      if(e.target===document.body && e.ctrlKey) {
        const scale=preferences.canvasScale;
        switch (e.code){
          case 'Digit0':
            preferences.canvasScale=1;
            return;
          case 'Equal':
            preferences.canvasScale+= scale<1.9?0.1:0;
            return;
          case 'Minus':
            preferences.canvasScale-= scale>0.1?0.1:0;
            return;
          case 'KeyS':{
            saveDoc()
            return;
          }
          case 'KeyL':{
            let ds=null;
            ds=window.localStorage.getItem(doc.name+'currentsnapshot');
            
            if (ds===null){
              ds=window.localStorage.getItem('currentsnapshot');
            }
            let djs=JSON.parse(ds);
            console.log(djs);
            doc.fromJSON(djs);
            return;
          }
        }
      }
      console.log(e);
    }
    document.body.addEventListener('keypress', handleKeyPress);

    return ()=>{
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('keypress', handleKeyPress);
    }
  }, [canvasEl,preferences,setOpenMenu, openMenu, doc])
  

  const saveDoc=()=>{
    let djs=doc.toJSON();
    console.log(djs);
    window.localStorage.setItem(doc.name+'currentsnapshot', JSON.stringify(djs));
  }

  const handleConnectorClick = (e, {selected, data})=>{
    if (e.altKey){
      const sn=doc.nodes.filter(n=>n.id==data.fromId)[0];
      const en=doc.nodes.filter(n=>n.id==data.toId)[0];
      sn.removeOutputConnection(data.fromIdx,en, data.toIdx);
      doc.connections.remove(data);
    }
  }

  let newconnector = null;
  const onCreateConnector = (node, i)=>{
    console.log(`creating connector`);
    dragging={node, outputIdx:i};
    setDragging({node, outputIdx:i});
  }

  const onUpdateConnectorPos = (e)=>{
    let cr=canvasEl.current.getClientRects()[0];
    let dp = {x:cr.x,y:cr.y};
    let pos={
      x:(e.pageX-dp.x)/preferences.canvasScale,
      y:(e.pageY-dp.y)/preferences.canvasScale
    };
    setEndPos(pos);
  }

  const onEndConnector = (e)=>{
    console.log('end create connector');
    let cr=canvasEl.current.getClientRects()[0];
    let dp = {x:cr.x,y:cr.y};
    let pos={
      x:(e.pageX-dp.x)/preferences.canvasScale,
      y:(e.pageY-dp.y)/preferences.canvasScale
    };
    setEndPos(pos);
    const match=getInputFromPos(pos);
    if (match) {
      console.log(match);
      const prevConnection=doc.connections.filter(c=>(c.toId===match.node.id&&c.toIdx===match.inputIdx))[0];
      if (prevConnection){
        const pn=doc.nodes.filter(n=>n.id===prevConnection.fromId)[0];
        pn.removeOutputConnection(prevConnection.fromIdx,match.node,prevConnection.toIdx);
        doc.connections.remove(prevConnection);
      }
      doc.connections.push(new Connection({
        fromId:dragging.node.id, fromIdx: dragging.outputIdx,
        toId: match.node.id, toIdx: match.inputIdx
      }))
      //match.node.connectInput(match.inputIdx, dragging.node, dragging.outputIdx);
    }
    setDragging(null);
  }

  const getOutputPos=(n,i)=>({
    x:n.x+preferences.nodeWidth, 
    y:n.y+preferences.nodeHeaderHeight+
      preferences.nodeFieldHeight*i+
      preferences.nodeFieldHeight/2
    })
  
  const getInputFromPos=({x,y})=>{
    for(let i=0;i<doc.nodes.length;i++){
      const n=doc.nodes[i];
      if (
        x>=n.x && x<=(n.x+preferences.nodeWidth) &&
        y>=n.y && y<=(n.y+preferences.nodeFieldHeight*n.inputFields.length+preferences.nodeHeaderHeight)
      ) {
        if (y>n.y+preferences.nodeHeaderHeight){
          let inputIdx=Math.trunc((y-n.y-preferences.nodeHeaderHeight) / preferences.nodeFieldHeight);
          return {node:n, inputIdx}
        }
      }
    }
  }

  if (dragging!==null) {
    let node = dragging.node;
    let connectorStart = getOutputPos(node, dragging.outputIdx);
    let connectorEnd = {x:endPos.x, y:endPos.y};
        
    newconnector = <Spline 
                      start={connectorStart}
                      end={connectorEnd}
                    />
  }

  return <>
  <div style={{overflow:'scroll',boxSizing: 'border-box',flexGrow:1,position:'relative'}}>
    <Box ref={canvasEl} id='ncanvas' style={canvasStyle(preferences)}>
      <div ref={menuAnchorEl} style={{position:'absolute',top:pos.y,left:pos.x, width:4, height:4, backgroundColor:'transparent'}}></div>

      {/* connectors */}
      <SVGComponent>
        {doc.connections.map(cn=>{
          const sn=doc.nodes.filter(n=>n.id==cn.fromId)[0];
          const en=doc.nodes.filter(n=>n.id==cn.toId)[0];
          const nw=preferences.nodeWidth;
          const nhh=preferences.nodeHeaderHeight;
          const nfh=preferences.nodeFieldHeight;
          return <Spline key={cn.id} onClick={handleConnectorClick} data={cn}
            start={{x:sn.x+nw, y:sn.y+nhh+(cn.fromIdx*nfh+nfh/2)}} 
            end={{x:en.x, y:en.y+nhh+(cn.toIdx*nfh+nfh/2)}}
          />
        })}
        {newconnector}
      </SVGComponent>

      {doc.nodes.map(n=><GraphNode key={n.id} node={n}
        isSelected={selectedNodes.indexOf(n)!==-1}
        onCreateConnector={onCreateConnector}
        onUpdateConnectorPos={onUpdateConnectorPos}
        onEndConnector={onEndConnector}
        onClick={(e)=>{
          console.log(e);
          if (e && e.altKey){
            setSelectedNodes([...selectedNodes.splice(n)]);
            const cnsToRemove= doc.connections.filter(c=>c.toId===n.id);
            if (cnsToRemove.length>0){
              cnsToRemove.forEach(c=>{
                let sn=doc.nodes.filter(s=>s.id===c.fromId);
                sn[0].removeOutputConnection(c.fromIdx, n, c.toIdx);
                doc.connections.remove(c);
              })
            }
            doc.nodes.remove(n);
            return;
          }
          if (e && e.ctrlKey){
            if (selectedNodes.indexOf(n)===-1){
              setSelectedNodes([...selectedNodes,n]);
            } else {
              setSelectedNodes(selectedNodes.splice(n,1));
            }
            return;
          }

          if (selectedNodes.indexOf(n)!==-1){
            setSelectedNodes([...selectedNodes.splice(n,1)]);
          } else {
            setSelectedNodes([n]);
          }
          
        }}
      />)}

      <Popper open={openMenu} anchorEl={menuAnchorEl.current} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Autocomplete
                id="combo-box-addnode"
                options={NodeList}
                groupBy={(option) => option.group||'Misc'}
                getOptionLabel={(option) => option.title}
                onClose={()=>{
                  setOpenMenu(false);
                }}
                onChange={(_e, value)=>{
                  doc.nodes.push(value.create(pos));
                  setOpenMenu(false);
                }}
                style={{ width: 300 }}
                autoComplete
                openOnFocus
                selectOnFocus
                renderInput={(params) => <TextField {...params} label="Add Node" variant="outlined" autoFocus={openMenu} />}
              />
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  </div>
  <CanvasSpeedDials onActionClick={a=>{
    switch(a) {
      case 'Save':
        saveDoc(); 
      return;
    }
  }}/>
  </>
});


const HomePage = ()=>{
  return <NodeCanvas/>
};

export default HomePage;