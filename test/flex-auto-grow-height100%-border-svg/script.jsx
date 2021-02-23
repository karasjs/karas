let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',height:'100%'}}>
      <span style={{background:'#F00',borderRight:'10px solid #0F0',backgroundClip:'padding-box'}}>1</span>
      <span style={{flex:1,background:'#00F'}}>2</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
