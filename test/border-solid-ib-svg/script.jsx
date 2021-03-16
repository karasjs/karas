let o = karas.render(
  <svg width="360" height="360">
    <span style={{display:'inlineBlock',border:'10px solid #F00'}}>1</span>
    <span style={{display:'inlineBlock',borderTop:'10px solid #00F'}}>1</span>
    <span style={{display:'inlineBlock',borderRight:'10px solid #00F'}}>1</span>
    <span style={{display:'inlineBlock',borderBottom:'10px solid #00F'}}>1</span>
    <span style={{display:'inlineBlock',borderLeft:'10px solid #00F'}}>1</span>
    <span style={{display:'inlineBlock',borderLeft:'10px solid #F00',borderBottom:'10px solid #00F'}}>1</span>
    <span style={{display:'inlineBlock',borderRight:'10px solid #F00',borderBottom:'10px solid #0F0'}}>1</span>
    <span style={{display:'inlineBlock',borderLeft:'10px solid #00F',borderTop:'10px solid #0F0'}}>1</span>
    <span style={{display:'inlineBlock',borderRight:'10px solid #F00',borderTop:'10px solid #00F'}}>1</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
