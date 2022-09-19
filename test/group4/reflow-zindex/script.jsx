let root = karas.render(
  <canvas width="360" height="360">
    <div style={{position:'absolute',width:100,height:20,background:'#F00',zIndex:8}}/>
  </canvas>,
  '#test'
);

root.children[0].updateStyle({zIndex:5});
let e = <$ellipse style={{position:'absolute',top:5,width:100,height:20,background:'#00F'}}/>;
root.appendChild(e, function() {
  e.updateStyle({zIndex:10}, function() {
    let canvas = document.querySelector('canvas');
    let input = document.querySelector('#base64');
    input.value = canvas.toDataURL();
  });
});
