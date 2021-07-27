let o = karas.render(
  <svg width="360" height="360">
    <span>hello</span>
    <span style={{display:'inlineBlock',width:30}}>world</span>
    <span style={{display:'inlineBlock'}}>!</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);

