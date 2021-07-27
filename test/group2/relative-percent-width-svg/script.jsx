let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'relative',left:'50%',width:'10%',height:100,background:'#F00'}}>
      <p style={{position:'relative',left:'50%',top:10,width:100,height:100,background:'#00F'}}/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
