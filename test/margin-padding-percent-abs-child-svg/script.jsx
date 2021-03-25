let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,margin:'1%',padding:'1%',background:'#F00'}}>
      <span style={{display:'inlineBlock',width:100,height:80,background:'#00F'}}/>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
