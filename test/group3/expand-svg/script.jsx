let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#F00',rotate:45,translateX:100}}/>
    <div style={{width:100,height:100,background:'#F00',rotate:45,translateX:100,transformOrigin:0}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
