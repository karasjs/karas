const root = karas.render(
  <canvas width={360} height={360}>
    {
      karas.parse({
        tagName: 'div',
        props: {
          style: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            background: '#F00'
          }
        },
        animate: [{
          value: [
            {
              translateX: 0,
            },
            {
              translateX: 100,
            }
          ],
          options: {
            duration: 100,
            fill: 'both',
          }
        }]
      })
    }
  </canvas>,
  '#test'
);
setTimeout(function() {
  root.appendChild(karas.parse({
    tagName: 'div',
    props: {
      style: {
        position: 'absolute',
        left: 0,
        top: 100,
        width: 100,
        height: 100,
        background: '#00F'
      }
    },
    animate: [{
      value: [
        {
          translateX: 0,
        },
        {
          translateX: 100,
        }
      ],
      options: {
        duration: 100,
        fill: 'both',
      }
    }]
  }));
}, 200);

let count = 0;
root.children[0].animationList[0].on(karas.Event.FINISH, () => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('input');
  input.value = ++count;
});
