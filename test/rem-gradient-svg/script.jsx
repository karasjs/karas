let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'linearGradient(#F00 1rem, 20vw #00F)'}}/>
    <div style={{width:100,height:100,background:'radialGradient(#F00 1rem, 20vw #00F)'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
