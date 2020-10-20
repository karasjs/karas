let o = karas.render(
  <svg width="360" height="360">
    <$line style={{width:100,height:100}} controlA={[0.7, 0]} start="0.5" end="0.8"/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
