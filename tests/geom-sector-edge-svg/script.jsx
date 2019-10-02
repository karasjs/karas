let o = karas.render(
  <svg width="360" height="360">
      <$sector style={{width:50,height:50}} begin="0" end="30" edge="true"/>
      <$sector style={{width:50,height:50}} begin="0" end="30"/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
