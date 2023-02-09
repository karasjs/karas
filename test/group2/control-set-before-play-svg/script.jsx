let root = karas.parse({
  tagName: 'canvas',
  props: {
    width: 360,
    height: 360,
  },
  children: [{
    tagName: 'div',
    props: {
      ref: 'div',
      style: {
        width: 100,
        height: 100,
        background: '#F00'
      }
    },
    animate: [{
      value: [{}, { translateX: 100 }],
      options: {
        duration: 1000,
        fill: 'forwards',
      }
    }]
  }]
}, '#test', {
  autoPlay: false,
});
root.animateController.playbackRate = 1000;
root.animateController.play();

let count = 0;
root.on('refresh', function() {
  if(count++ < 2) {
    let input = document.querySelector('input');
    input.value = root.ref.div.getComputedStyle('translateX').translateX;
  }
})
