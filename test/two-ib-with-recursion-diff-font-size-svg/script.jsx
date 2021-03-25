let o = karas.render(
  <svg width="360" height="360">
    <span style={{display:'inlineBlock',width:100}}>
      <span style={{display:'inlineBlock',fontSize:40}}>hello</span>
      <span style={{display:'inlineBlock'}}>hello</span>
    </span>
    <span style={{display:'inlineBlock',width:100}}>
      <span style={{display:'inlineBlock',fontSize:40}}>world</span>
      <span style={{display:'inlineBlock',fontSize:60}}>world</span>
    </span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
