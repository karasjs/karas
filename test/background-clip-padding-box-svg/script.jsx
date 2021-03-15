let o = karas.render(
  <svg width="360" height="360">
    <span style={{display:'inlineBlock',backgroundColor:'#F00',padding:10,border:'10px solid rgba(0,0,0,0.1)',backgroundClip:'padding-box'}}>123</span>
    <span style={{display:'inlineBlock',backgroundColor:'#F00',padding:10,border:'10px solid rgba(0,0,0,0.1)',borderRadius:15,backgroundClip:'padding-box'}}>123</span>
    <span style={{display:'inlineBlock',backgroundColor:'#F00',padding:10,border:'10px solid rgba(0,0,0,0.1)',borderRadius:25,backgroundClip:'padding-box'}}>123</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
