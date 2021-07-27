let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,background:'#00F',transform:'translateX(10px)'}}>1</div>
    <div style={{width:100,background:'#F00',transform:'translateY(10px)'}}>2</div>
    <div style={{width:100,background:'#0F0',transform:'translate(10px,10px)'}}>3</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
