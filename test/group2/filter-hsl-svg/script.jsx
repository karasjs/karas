let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:50,height:50,background:'#F93',filter:'hue-rotate(30)'}}/>
    <div style={{width:50,height:50,background:'#F93',filter:'saturate(50%)'}}/>
    <div style={{width:50,height:50,background:'#F93',filter:'brightness(50%)'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
