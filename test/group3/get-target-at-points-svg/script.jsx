let root = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#f00'}}>
      <span style={{display:'inlineBlock',width:50,height:50,background:'#0f0'}}/>
      <span style={{display:'inlineBlock',width:50,height:50,background:'#00f',pointerEvents:'none'}}/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
let res = root.getTargetAtPoint(10, 10);
let res2 = root.getTargetAtPoint(60, 10);
input.value = JSON.stringify([{
  tagName: res.target.tagName,
  path: res.path,
  zPath: res.zPath,
}, {
  tagName: res2.target.tagName,
  path: res2.path,
  zPath: res2.zPath,
}]);
