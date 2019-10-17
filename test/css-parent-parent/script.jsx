let css = selenite.parse(`
.a .b{
  color:#F00;
}
.a .c{
  color:#00F;
}
`);

karas.render(
  <canvas width="360" height="360" css={css}>
    <div class="b">
      <div class="c">123</div>
    </div>
    <div class="a">
      <div class="c">
        <div class="b">123</div>
      </div>
    </div>
    <div class="a">
      <div class="b">
        <div class="c">123</div>
      </div>
    </div>
  </canvas>,
  '#test'
);
