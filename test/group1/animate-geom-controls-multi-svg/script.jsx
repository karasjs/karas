let o = karas.render(
  <svg width="360" height="360">
    <$polygon ref="t" multi={true} points={[
      [
        [0,0],
        [1,0],
        [1,1]
      ],
      [
        [1,1],
        [0,1],
        [0,0]
      ]
    ]} style={{width:100,height:100}}/>
  </svg>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    controls: [
      [
        [0.1,0.1,0.9,0.1],
        [0.9,0.5]
      ],
      [
        [0.9,0.9]
      ]
    ],
  },
  {
    controls: [
      [
        [0.2,0.2,0.8,0.2],
        [0.1,0.5,0.8,0.5],
        [0.55,0.45]
      ],
      [
        [],
        null,
        [0.1,0.1]
      ]
    ],
  }
], {
  duration: 200,
  fill: 'forwards',
});
let input = document.querySelector('input');
animation.on(karas.Event.FINISH, () => {
  input.value = JSON.stringify(o.virtualDom);
});
