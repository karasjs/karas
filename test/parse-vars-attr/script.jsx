let o = karas.parse({
  tagName: 'canvas',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: '$polygon',
      props: {
        style: {
          width: 100,
          height: 100,
        },
        points: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      },
      animate: {
        value: [
          {
            points: [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
            ],
          },
          {
            points: [
              [0, 0],
              [1, 0],
              [1, 1],
              [0.5, 1],
            ],
            "var-points.3.0": {
              id: 'x'
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
    x: 0.6,
  },
});
let t = o.children[0];
t.animationList[0].on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = t.computedStyle.points;
});
