let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',alignItems:'center',height:40,background:'#00F'}}>1<span style={{fontSize:60}}>2</span>3</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
