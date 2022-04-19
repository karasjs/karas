let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,background:'#0ff',
      fontSize:32,writingMode:'verticalLr',}}>
      <img src="../../image.png" style={{width:50,height:50}}/>a
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
