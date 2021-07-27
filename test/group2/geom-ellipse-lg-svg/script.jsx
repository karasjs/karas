let o = karas.render(
  <svg width="360" height="360">
    <$ellipse style={{width:50,height:50,stroke:'linear-gradient(to top, #F00, #00F)',fill:'linear-gradient(#F00, #00F)'}}/>
    <$ellipse style={{width:50,height:50,stroke:'linear-gradient(to top, #F00, #00F)',fill:'linear-gradient(#F00, #00F)'}} rx="0.5" ry="0.5"/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
