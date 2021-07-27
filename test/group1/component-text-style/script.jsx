class Component extends karas.Component {
  render() {
    return 'text';
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component style={{color:'#F00'}}/>
    <div style={{color:'#00F'}}>
      <Component/>
    </div>
  </canvas>,
  '#test'
);
