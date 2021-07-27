let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <span style={{flex:1}}>1</span>
      <span style={{width:320,height:20,background:'#F00'}}/>
    </div>
    <div style={{display:'flex'}}>
      <span style={{flex:1}}>123456</span>
      <span style={{width:320,height:20,background:'#00F'}}/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
