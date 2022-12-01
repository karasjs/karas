let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'div',
      areaDuration: 500,
      props: {
        style: {
          width:100,
          height:100,
          background:'#F00'
        }
      },
      animate: [
        {
          value: [
            {},
            {
              translateX: 100
            }
          ],
          options: {
            duration: 1000,
            iterations: Infinity
          }
        }
      ]
    }
  ]
}, '#test', {
  autoPlay: false,
})
o.animateController.gotoAndStop(600, function() {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
