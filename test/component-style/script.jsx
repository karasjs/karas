class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div>123</div>;
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
