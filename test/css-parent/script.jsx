let css = selenite.parse(`
.a .b{
  color:#F00;
}
`);

karas.render(
  <canvas width="360" height="360" css={css}>
    <div class="a">
      <div class="b">123</div>
    </div>
    <div class="a">
      <div>
        <div class="b">123</div>
      </div>
    </div>
  </canvas>,
  '#test'
);
