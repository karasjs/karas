let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse({
        tagName: 'div',
        props: {
          style: {
            fontSize: 60,
            fontFamily: 'alipay',
          }
        },
        children: ['123'],
        fonts: [{
          fontFamily: 'alipay',
          url: 'AlipayNumber-Regular.ttf',
          data: {},
        }]
      })
    }
  </svg>,
  '#test'
);
let input = document.querySelector('input');
o.once('refresh', function() {
  input.value = document.querySelector('svg').innerHTML;
});
