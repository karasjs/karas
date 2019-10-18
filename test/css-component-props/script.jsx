let css = selenite.parse(`
#a{
  color:#F00;
}
`);
let css2 = selenite.parse(`
#a{
  color:#00F;
  font-size:10px;
  font-weight:700;
}
div{
  font-size:30px;
}
`);

class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div id="a" css={css2}>123</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component css={css}/>
  </canvas>,
  '#test'
);
