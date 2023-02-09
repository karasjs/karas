let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    karas.parse({
      tagName: 'div',
      props: {},
      children: [123],
      animate: {
        value: [
          {
            color: '#F00',
          },
          {
            color: '#00F',
          }
        ],
        options: {
          duration: 30,
          fill: 'both',
        }
      }
    })
  ],
}, '#test');
var input = document.querySelector('#base64');
setTimeout(function() {
  input.value = JSON.stringify(o.virtualDom);
}, 250);
