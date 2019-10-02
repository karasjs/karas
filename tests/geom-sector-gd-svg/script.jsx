let o = karas.render(
  <svg width="360" height="360">
    <$sector style={{width:50,height:50}} begin="0" end="30"/>
    <$sector style={{width:50,height:50,stroke:'linear-gradient(#F00,#00F)'}} begin="0" end="200"/>
    <$sector style={{width:50,height:50,fill:'linear-gradient(#F00,#00F)'}} begin="100" end="200"/>
    <$sector style={{width:50,height:50,fill:'radial-gradient(#F00,#00F)'}} begin="200" end="300"/>
    <$sector style={{width:50,height:50}} begin="100" end="300" r="0.5"/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
