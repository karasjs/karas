class Component extends karas.Component {
  render() {
    return <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 20,
      height: 20,
      background: '#00F',
      zIndex: 2,
    }}/>;
  }
}

let root = karas.render(
  <canvas width="360" height="360">
    <div style={{position:'absolute',width:50,height:50,background:'#F00',zIndex:1}}/>
  </canvas>,
  '#test'
);

root.appendChild(
  <Component style={{
    position: 'absolute',
    left: 10,
    top: 10,
    width: 20,
    height: 20,
    background: '#00F',
    zIndex: 2,
  }}/>,
  function() {
    let canvas = document.querySelector('canvas');
    let input = document.querySelector('#base64');
    input.value = canvas.toDataURL();
  }
);
