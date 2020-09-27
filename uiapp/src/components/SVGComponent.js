import React, { Component } from 'react';

export default function SVGComponent(props) {
  const {scale=1, height=1080, width=1920, onSelect, ...otherProps} = props;
  const [selection, setSelection] = React.useState({});

  return <svg style={{position:'absolute', top:0,left:0, width:width/scale,height:height/scale}} {...otherProps}

    onMouseDown={e=>{
      if (!selection.dragging) {
        var rect = e.currentTarget.getBoundingClientRect(),
        offsetX = e.clientX - rect.left,
        offsetY = e.clientY - rect.top;
        setSelection({dragging:true, sx:offsetX, sy:offsetY, ex:offsetX, ey: offsetY});
      }
    }}
    onMouseMove={e=>{
      if (selection.dragging) {
        var rect = e.currentTarget.getBoundingClientRect(),
        offsetX = e.clientX - rect.left,
        offsetY = e.clientY - rect.top;
        let {sx, sy} = selection;
        setSelection({dragging:true, sx, sy, ex:offsetX, ey:offsetY});
      }
    }}
    onMouseUp={e=>{
      if (selection.dragging) {
        var rect = e.currentTarget.getBoundingClientRect(),
        offsetX = e.clientX - rect.left,
        offsetY = e.clientY - rect.top;
        let {sx, sy} = selection;
        setSelection({dragging:false, sx, sy, ex:offsetX, ey:offsetY});
        if (onSelect) {
          onSelect({
            x:(selection.sx<selection.ex?selection.sx:selection.ex)/scale,
            y:(selection.sy<selection.ey?selection.sy:selection.ey)/scale,
            width:Math.abs(selection.ex-selection.sx)/scale,
            height:Math.abs(selection.ey-selection.sy)/scale
          });
        }
      }
    }}
  >
    {props.children}
    {selection.dragging?<rect className={'box-selection'}
      x={(selection.sx<selection.ex?selection.sx:selection.ex)/scale} y={(selection.sy<selection.ey?selection.sy:selection.ey)/scale}
      width={Math.abs(selection.ex-selection.sx)/scale} height={Math.abs(selection.ey-selection.sy)/scale} />: null}
  </svg>;
}