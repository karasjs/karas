let o = karas.render(
  <svg width="360" height="360">
    <$circle style={{width:50,height:50,stroke:'linear-gradient(#0F0, #00F)',fill:'radial-gradient(#F00, #000)'}}/>
    <$circle style={{width:50,height:50,stroke:'linear-gradient(#0F0, #00F)',fill:'radial-gradient(#F00, #000)'}} r="0.5"/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
