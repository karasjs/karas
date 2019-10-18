let css = selenite.parse(`
*{
  color:#F00;
}
`);

class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return '123';
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component css={css}/>
  </canvas>,
  '#test'
);
