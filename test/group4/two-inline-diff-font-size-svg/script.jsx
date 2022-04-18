let o = karas.render(
  <svg width="360" height="360">
    <span>hello</span>
    <span style={{fontSize:36}}>world</span>
    <div style={{width:110,background:'#F00'}}>
      <strong style={{fontSize:40}}>hello</strong>
      <span>helloooooooooooooooo</span>
    </div>
    <div style={{width:110,background:'#0FF'}}>
      <strong>hello</strong>
      <span style={{fontSize:40}}>hello</span>
    </div>
    <div style={{border:'1px solid #000'}}>
      <span style={{fontSize:40,lineHeight:2,background:'#F00'}}>A</span>
      <span style={{fontSize:20,lineHeight:4,background:'#0FF'}}>B</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
