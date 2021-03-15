let o = karas.render(
  <svg width="360" height="360">
    <span style={{display:'inlineBlock',width:50}}>
      <span style={{display:'inlineBlock'}}>hello</span>
      <span style={{display:'inlineBlock'}}>world</span>
    </span>
    <div style={{width:50}}>
      <span>hello</span>
      <span>world</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
