let root = karas.render(
  <webgl width={360} height={360}></webgl>,
  '#test'
);

root.appendChild(karas.parse({
  tagName: 'div',
  props: {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
    }
  },
  children: [
    {
      tagName: 'div',
      props: {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 200,
          height: 200,
          background: '#F00'
        },
      },
    },
    {
      tagName: '$rect',
      props: {
        style: {
          position: 'absolute',
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#00F'
        },
        mask: true
      }
    }
  ],
}), function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
