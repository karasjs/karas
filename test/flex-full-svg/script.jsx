let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',padding:10,background:'#00F'}}>
      <div style={{padding:10,background:'#F00',flex:'1 1 auto',width:100,height:100}}>
        <span style={{display:'inlineBlock',padding:10,background:'#0F0'}} ref="inner">123</span>
      </div>
      <div style={{flex:'1 1 auto',background:'#999'}}>in</div>
    </div>
    <div>next</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
