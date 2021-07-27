let o = karas.parse({
  tagName: 'canvas',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'span',
      props: {},
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
          duration: 200,
          fill: 'both',
        },
      },
      children: [123]
    }
  ],
}, '#test');
let input = document.querySelector('input');
let n = 0;
o.on('refresh', function() {
  n++;
  o.animateController.pause();
});
setTimeout(function() {
  input.value = n;
}, 500);
