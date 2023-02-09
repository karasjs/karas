let o = karas.parse({
  tagName: 'canvas',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'div',
      props: {},
      animate: {
        value: [
          {
            translateX: 0,
          },
          {
            translateX: 100,
            vars: {
              id: 'aaa',
              member: ['translateX']
            }
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
}, '#test', {
  vars: {
    aaa: function() {
      return 200;
    },
  },
});
let t = o.children[0];
t.animationList[0].on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = t.getComputedStyle().translateX;
});
