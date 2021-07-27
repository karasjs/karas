let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

let o = karas.render(
  <canvas width="360" height="360">
    <div style={{position:'absolute',left:100,top:100,width:100,height:100,background:'#F00'}} onClick={()=>{cb(count++)}}>1</div>
  </canvas>,
  '#test'
);
o.scale(0.1, 0.1);
