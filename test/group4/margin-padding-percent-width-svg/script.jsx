let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:'1%',padding:'1%',width:100,height:100,background:'#F00'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
