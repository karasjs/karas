let o = karas.render(
  <svg width="360" height="360">
    <div ref="a" style={{margin:10,width:50,height:50,background:'#F00'}}/>
    <div ref="b" style={{margin:10,width:50,height:50,background:'#F00',scale:0}}/>
    <div ref="c" style={{margin:10,width:50,height:50,background:'#F00'}}/>
    <div ref="d" style={{margin:10,width:50,height:50,background:'#F00',translate:10,rotateZ:45}}/>
    <div ref="e" style={{margin:10,width:50,height:50,background:'#F00',scale:0.6,rotateZ:45}}/>
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
});
o.ref.d.updateStyle({
  rotateZ: 90,
});
o.ref.e.updateStyle({
  scale: 0.5,
  translate: 10,
  rotateZ: 90,
}, function() {
  input.value = document.querySelector('svg').innerHTML;
});
