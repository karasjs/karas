let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <span style={{flex:'1 1 1rem',height:20,background:'#F00'}}/>
      <strong style={{flex:'1 1 2rem',height:20,background:'#00F'}}/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
