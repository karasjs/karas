let root = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#f00'}}>
      <span style={{display:'inlineBlock',width:50,height:50,background:'#00f'}}/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
let res = root.getTargetAtPoint(10, 10);
input.value = JSON.stringify({
  tagName: res.target.tagName,
  path: res.path,
  zPath: res.zPath,
});
