let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:100,top:100,width:90,height:80,background:'#F00',filter:'blur(5)'}}>123</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
