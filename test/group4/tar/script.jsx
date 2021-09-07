let o = karas.render(
  <canvas width="360" height="360">
    <$polygon
      points={[
        [0.1, 0.2],
        [1, 0],
        [1, 1]
      ]}
      style={{position:'absolute',left:20,top:20,width:100,height:100,strokeWidth:0,fill:'#f00'}}
    />
    <$polygon
      ref="t"
      points={[
        [0, 0],
        [0.8, 0.1],
        [0.3, 0.5]
      ]}
      style={{position:'absolute',left:20,top:20,width:100,height:100,strokeWidth:0,fill:'rgba(0,0,255,0.5)',transformOrigin:'0 0'}}
    />
  </canvas>,
  '#test'
);
let t = o.ref.t;
let res = karas.math.tar.transform([0, 0, 80, 10, 30, 50], [10, 20, 100, 0, 100, 100]);
t.updateStyle({
  transform: `matrix3d(${res.join(',')})`,
}, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
