let css = selenite.parse(`
.a+.b{
  color:#F00;
}
.a+.c{
  background:#00F;
}
`);

karas.render(
  <canvas width="360" height="360" css={css}>
    <div class="a">123</div>
    <div class="b">123</div>
    <div class="c">123</div>
  </canvas>,
  '#test'
);
