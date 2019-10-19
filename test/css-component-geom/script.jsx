let css = selenite.parse(`
#a{
  width:100%;
  height:100%;
  fill:#F00;
  stroke-width:0;
}
`);

class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <$rect id="a" css={css} />;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component style={{width:20,height:20}}/>
  </canvas>,
  '#test'
);
