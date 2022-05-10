let o = karas.render(
  <svg width="360" height="360">
    <div style={{textAlign:'left'}}>1</div>
    <div style={{textAlign:'center'}}>1</div>
    <div style={{textAlign:'right'}}>1</div>
    <div style={{textAlign:'center',width:100,height:100,background:'#F00',
      writingMode:'verticalLr'}}>1</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
