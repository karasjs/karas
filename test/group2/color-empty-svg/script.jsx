let o = karas.render(
  <svg width="360" height="360">
    <div style={{color:''}}>1</div>
    <div style={{color:null}}>2</div>
    <div style={{color:undefined}}>3</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
