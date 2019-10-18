let css = selenite.parse(`
#a{
  color:#F00;
}
`);

class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div id="a" css={css}>123</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
