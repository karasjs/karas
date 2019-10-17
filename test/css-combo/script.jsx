let css = selenite.parse(`
#a{
  color:#F00;
}
.a{
  color:#0F0;
}
div{
  color:#00F;
}
`);

karas.render(
  <canvas width="360" height="360" css={css}>
    <div id="a">123</div>
    <div class="a">123</div>
    <div class="b">123</div>
    <div id="a" class="a">123</div>
    <div id="a" class="a b">123</div>
  </canvas>,
  '#test'
);
