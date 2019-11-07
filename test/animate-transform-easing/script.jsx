let o = karas.render(
  <canvas width="360" height="360">
    <$rect
      ref="t"
      style={{width:50,height:50,strokeWidth:0,fill:'#F00'}}/>
  </canvas>,
  '#test'
);
let t = o.ref.t;
let animation = t.animate([
  {
    transform: 'translateX(0)',
  },
  {
    transform: 'translateX(300px)',
  }
], {
  duration: 1000,
  fill: 'forwards',
});

let o2 = karas.render(
  <canvas width="360" height="360">
    <$rect
      ref="t"
      style={{width:50,height:50,strokeWidth:0,fill:'#F00'}}/>
  </canvas>,
  '#test2'
);
let t2 = o2.ref.t;
let animation2 = t2.animate([
  {
    transform: 'translateX(0)',
    easing: 'ease',
  },
  {
    transform: 'translateX(300px)',
  }
], {
  duration: 1000,
  fill: 'forwards',
});

let input = document.querySelector('input');
let n = 0;
animation2.on(karas.Event.KARAS_ANIMATION_FRAME, () => {
  if(n++ === 1) {
    let a = parseFloat(t.computedStyle.transform.split(',')[4]);
    let b = parseFloat(t2.computedStyle.transform.split(',')[4]); console.log(a, b);
    input.value = a > b;
  }
});
animation2.on(karas.Event.KARAS_ANIMATION_FINISH, () => {
  let a = t.computedStyle.transform.split(',')[4];
  let b = t2.computedStyle.transform.split(',')[4]; console.log(a, b);
  input.value += '/' + (a === b);
});
