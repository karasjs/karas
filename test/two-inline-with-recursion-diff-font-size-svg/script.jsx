let o = karas.render(
  <svg width="360" height="360">
    <span style={{width:100}}>
      <span style={{fontSize:40}}>hello</span>
      <span>hello</span>
    </span>
    <span style={{width:100}}>
      <span style={{fontSize:40}}>world</span>
      <span style={{fontSize:60}}>world</span>
    </span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
