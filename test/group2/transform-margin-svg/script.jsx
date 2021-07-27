let o = karas.render(
  <svg width="360" height="360">
    <div style={{marginLeft:100,width:100,height:100,background:'#F00',scaleX:-1}}/>
    <div style={{marginLeft:100,width:100,height:100,background:'#00F'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
