let o = karas.render(
  <canvas width="360" height="360">
    <$rect ref="t" style={{width:100,height:100}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    translateX: 0,
  },
  {
    translateX: 100,
  }
], {
  duration: 200,
  endDelay: 200,
  fill: 'forwards',
  iterations: 2,
});
let input = document.querySelector('input');
let isEnd, count = 0;
animation.on('frame', () => {
  if(isEnd) {
    count++;
  }
});
animation.on('begin', () => {
  input.value += '/begin';
});
animation.on('end', () => {
  isEnd = true;
  input.value += '/end';
});
animation.on(karas.Event.FINISH, () => {
  if(isEnd) {
    isEnd = false;
  }
  input.value += '/' + (count > 2) + '/fin';
});
