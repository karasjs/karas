let o = karas.render(
  <svg width="360" height="360">
    <$ellipse style={{width:100,height:50,fill:'radial-gradient(farthest-side,rgba(255,0 , 0, 1),#00F)'}}/>
    <$ellipse style={{width:100,height:50,fill:'radial-gradient(#F00,rgb(0, 0 ,255))'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
