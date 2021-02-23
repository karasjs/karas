let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',width:360}}>
      <span style={{flex:1}}>1234567890</span>
      <span style={{width:300,height:50,background:'#00F'}}/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('input');
input.value = JSON.stringify(o.virtualDom);
