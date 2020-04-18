let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse({
        tagName: 'div',
        props: {
          ref: 'a',
          width: 360,
          height: 360,
        },
        children: [123],
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
      })
    }
  </svg>,
  '#test'
);
let input = document.querySelector('input');
let a = o.ref.a;
a.animationList[0].on('finish', function() {
  input.value = 1 + '/' + a.computedStyle.color;
});
