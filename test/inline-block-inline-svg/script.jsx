let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'inlineBlock',margin:10,padding:10,background:'#F00'}}>
      <span style={{background:'#00F'}}>456</span>
    </div>
  </svg>,
  '#test'
);

var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
