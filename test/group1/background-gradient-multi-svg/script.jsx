let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:['linearGradient(rgba(255,0,0,0), rgba(255,0,0,1))', 'linearGradient(rgba(0,0,0,1), rgba(0,0,0,1)', '#F00']}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
