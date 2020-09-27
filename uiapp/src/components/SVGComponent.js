import React, { Component } from 'react';

export default class SVGComponent extends Component {
  render() {
    return <svg style={{position:'absolute', top:0,left:0, width:1920,height:1080}} {...this.props} ref="svg">{this.props.children}</svg>;
  }
}