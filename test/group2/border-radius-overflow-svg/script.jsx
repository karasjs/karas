let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,borderRadius:20,background:'#F00',overflow:'hidden'}}>
      <div style={{width:50,height:50,background:'#00F'}}/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
