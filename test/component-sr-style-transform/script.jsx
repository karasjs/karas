class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div style={{translateY: 100}}>123</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <div style={{translateX: 100}}>
      <Component/>
    </div>
  </canvas>,
  '#test'
);
