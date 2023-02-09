let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse({
        tagName: 'div',
        props: {
          style: {
            fontFamily: '#0',
          }
        },
        children: ['a', {
          tagName: 'img',
          props: {
            ref: 'img',
            src: '#0'
          }
        }]
      }, {
        fonts: [
          {
            fontFamily: 'haha',
            url: 'xx',
          }
        ],
        imgs: [
          '../../logo.png'
        ]
      })
    }
  </svg>,
  '#test'
);
let input = document.querySelector('input');
o.once('refresh', function() {
  input.value = o.ref.img.props.src;
});
