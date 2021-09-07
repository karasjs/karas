let o = karas.render(
  <svg width={360} height={360}>
    {
      karas.parse({
        tagName: 'div',
        props: {
          style: {
            position:'absolute'
          }
        },
        children: [{
          tagName: 'div',
          props: {
            style: {
              position:'absolute',
              width: 100,
              height: 100,
              "left": -45,
              "top": -39,
              "translateX": 94,
              "translateY": 234,
              background: '#F00',
            }
          },
          animate: [{
            value: [
              {},
              {
                left: 50,
                transformOrigin: '1 1',
              }
            ],
            options: {
              duration: 200,
              fill: 'forwards',
            }
          }]
        }]
      })
    }
  </svg>,
  '#test'
);
o.animateController.gotoAndStop(100, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
