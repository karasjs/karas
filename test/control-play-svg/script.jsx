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
      animate: [{
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
      }, {
        value: [
          {
            background: '#00F',
          },
          {
            background: '#F00',
          }
        ],
        options: {
          duration: 200,
          fill: 'both',
        },
      }],
      children: [123]
    }
  ],
}, '#test', {
  autoPlay: false,
});
let input = document.querySelector('input');
let n = 0;
o.animateController.play(function() {
  n++;
});
setTimeout(function() {
  input.value = n;
}, 500);
