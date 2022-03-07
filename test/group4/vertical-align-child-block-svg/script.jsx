let o = karas.render(
  <svg width="360" height="360">
    <span style={{display:'inlineBlock',width:20,height:50,border:'1px solid #F00'}}/>
    <span style={{display:'inlineBlock',width:20,height:50,border:'1px solid #00F'}}>a</span>
    <div>b</div>
    <span style={{display:'inlineBlock',width:20,height:50,border:'1px solid #F00'}}/>
    <span style={{display:'inlineBlock',width:20,height:50,border:'1px solid #00F'}}>c</span>
    <div>d</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
