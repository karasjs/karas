let o = karas.render(
  <svg width="360" height="360">
    <div style={{lineHeight:5}}>a<span>b</span></div>
    <span style={{lineHeight:5,background:'#F00'}}>a<strong>b</strong></span>
    <div style={{lineHeight:'20px'}}>a<span>b</span></div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
