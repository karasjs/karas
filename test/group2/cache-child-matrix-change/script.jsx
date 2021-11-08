let root = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div ref="div1" style={{width:100,height:100,background:'#F00'}}>
      <div ref="div2" cacheAsBitmap="1" style={{width:100,height:100,background:'#00F',rotate:45}}/>
    </div>
  </canvas>,
  '#test'
);

root.ref.div1.updateStyle({
  translateX: 100,
}, function() {
  let input = document.querySelector('#base64');
  input.value = root.ref.div2.matrixEvent.join(',');
});
