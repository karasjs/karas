let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{
      width: 100,
      height: 100,
      background: '#F00',
      translateX: 100,
      rotate: 1,
    }}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.ref.div.getBoundingClientRect());
