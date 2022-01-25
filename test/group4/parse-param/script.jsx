let o = karas.parse({
  tagName: 'canvas',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'div',
      props: {
        style: {
          width: 100,
          height: 100,
          background: '#F00',
        }
      },
      animate: {
        value: [
          {},
          {
            translateX: 100,
          }
        ],
        options: {
          duration: 200,
        },
      },
    },
  ],
}, '#test', {
  fill: 'forwards',
});
let t = o.children[0];
t.animationList[0].on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = t.getComputedStyle().translateX;
});
