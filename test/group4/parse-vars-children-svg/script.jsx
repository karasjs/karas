let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'span',
      props: {
        style: {
          display: 'inlineBlock'
        }
      },
      animate: {
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
        },
      },
      children: [123],
      vars: {
        id: 'aaa',
        member: ['children', 0]
      }
    },
    {
      libraryId: 0
    }
  ],
  library: [{
    id: 0,
    tagName: 'span',
    children: [1],
    vars: [{
      id: 'bbb',
      member: ['children', 0]
    }]
  }]
}, '#test', {
  vars: {
    aaa: 'a',
    bbb: 'b',
  },
});
let t = o.children[0];
t.animationList[0].on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
