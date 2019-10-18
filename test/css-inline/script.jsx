let css = selenite.parse(`
#a{
  color:#F00;
}
`);

karas.render(
  <canvas width="360" height="360" css={css}>
    <div id="a" style={{color:'#00F'}}>123</div>
  </canvas>,
  '#test'
);
