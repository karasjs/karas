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
o.children[0].animationList[0].on(karas.Event.FINISH, () => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('input');
  input.value = canvas.toDataURL();
});
