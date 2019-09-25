let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:0,height:0,borderTop:'50px solid #000',borderRight:'50px solid #F00',borderBottom:'50px solid #999',borderLeft:'50px solid #00F'}}/>
    <div style={{width:10,height:10,borderTop:'50px solid #000',borderRight:'50px solid #F00',borderBottom:'50px solid #999',borderLeft:'50px solid #00F'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
