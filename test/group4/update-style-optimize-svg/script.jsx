let o = karas.render(
  <svg width="360" height="360">
    <div ref="a" style={{width:100,height:100,background:'#F00'}}/>
    <div ref="b" style={{width:100,height:100,background:'#F00',scale:0}}/>
    <div ref="c" style={{width:100,height:100,background:'#F00'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.a.updateStyle({
  scale: 0.5,
});
o.ref.b.updateStyle({
  scale: 0.5,
});
o.ref.c.updateStyle({
  scale: 0.5,
  translate: 10,
}, function() {
  input.value = document.querySelector('svg').innerHTML;
});
