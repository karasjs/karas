let controller = new karas.animate.Controller();

let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    karas.parse({
      tagName: 'div',
      props: {
        style: {
          width: 100,
          height: 100,
          background: '#F00',
        },
      },
      animate: [
        {
          value: [
            {},
            {
              translateX: 100,
            },
          ],
          options: {
            duration: 100,
            fill: 'forwards',
          }
        }
      ],
    }, {
      controller,
    })
  ],
}, '#test', {
  controller,
});
controller.on('finish', function() {
  input.value = o.children[0].getComputedStyle().translateX;
});
