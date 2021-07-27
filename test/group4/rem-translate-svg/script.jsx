let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:10,height:10,background:'#F00',translateX:'10rem'}}/>
    <div style={{width:10,height:10,background:'#F00',transform:'translateY(2rem)'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
