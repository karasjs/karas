let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:10,height:10,background:'#F00',translateX:'20vw'}}/>
    <div style={{width:10,height:10,background:'#F00',transform:'translateY(10vw)'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
