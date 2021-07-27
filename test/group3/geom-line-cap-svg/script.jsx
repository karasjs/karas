let o = karas.render(
  <svg width="360" height="360">
    <$line style={{width:100,height:100,strokeWidth:10,strokeLinecap:'round'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
