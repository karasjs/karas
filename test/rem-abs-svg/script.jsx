let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:'2rem',top:'10vw',width:'10rem',height:'20vw',background:'#F00'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
