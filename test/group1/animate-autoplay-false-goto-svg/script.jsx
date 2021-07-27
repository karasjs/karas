let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'div',
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
            duration: 6000,
            direction: 'alternate',
            iterations: Infinity
          }
        }
      ]
    }
  ]
}, '#test', {
  autoPlay: false,
})
o.animateController.gotoAndStop(3000, function() {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
