let o = karas.render(
  <svg width="360" height="360">
    <div style={{lineHeight:5}}>a<span>b</span></div>
    <span style={{lineHeight:5}}>a<strong>b</strong></span>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
