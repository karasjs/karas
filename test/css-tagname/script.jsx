let css = selenite.parse(`
div{
  color:#F00;
}
`);

karas.render(
  <canvas width="360" height="360" css={css}>
    <div id="a">123</div>
  </canvas>,
  '#test'
);
