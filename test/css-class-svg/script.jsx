let css = selenite.parse(`
.a{
  color:#F00;
}
.b{
  color:#00F;
}
.c{
  color:#F00;
}
.d{
  color:#00F;
}
.c.d{
  color:#0F0;
}
`);

let o = karas.render(
  <svg width="360" height="360" css={css}>
    <div class="a">123</div>
    <div class="a b">123</div>
    <div class="b a">123</div>
    <div class="c d">123</div>
  </svg>,
  '#test'
);

document.querySelector('input').value = JSON.stringify(o.virtualDom);
