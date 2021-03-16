let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <span style={{marginRight:10,paddingRight:10,background:'#FFC',borderRight:'1px solid #CCC',backgroundClip:'paddingBox'}}>1</span>
      <span>2</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
