let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div cacheAsBitmap={1} ref="div" style={{width:100,height:100,background:'#F00'}}>aaaaaa</div>
    <$rect mask={1} style={{position:'absolute',left:20,top:0,width:100,height:100,fill:'#FFF'}}/>
  </canvas>,
  '#test'
);

o.ref.div.updateStyle({
  filter: 'blur(1)'
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
