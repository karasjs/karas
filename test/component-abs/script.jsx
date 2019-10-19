class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div>
      <span style={{position:'absolute',left:0,top:0}}>2</span>
    </div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <div style={{width:100,height:100}}>1</div>
    <Component/>
  </canvas>,
  '#test'
);
