let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',padding:10,background:'#00F'}}>
      <div style={{padding:10,background:'#F00',flex:'1 1 auto'}}>
        <$rect style={{width:10,height:10}}/>
      </div>
      <div style={{flex:'1 1 0',background:'#999'}}>in</div>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
