let controller = new karas.animate.Controller();

let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse({
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
            fill: 'forwards',
          },
        },
        children: [456]
      }, {
        controller,
        autoPlay: false,
      })
    }
    {
      karas.parse({
        tagName: 'span',
        props: {},
        animate: {
          value: [
            {
              color: '#00F',
            },
            {
              color: '#F00',
            }
          ],
          options: {
            duration: 200,
            fill: 'forwards',
          },
        },
        children: [456]
      }, {
        controller,
      })
    }
  </svg>,
  '#test'
);
let input = document.querySelector('input');
controller.list[0].on('finish', function() {
  input.value = o.children[0].computedStyle.color + '/' + o.children[1].computedStyle.color;
});
