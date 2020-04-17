let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    karas.parse({
      tagName: 'svg',
      props: {},
      children: [
        karas.parse({
          library: [{
            id: 'a',
            tagName: '$polygon',
            props: {
              style: {
                width: 100,
                height: 100,
              },
              points: [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1]
              ],
            },
          }],
          tagName: 'div',
          children: [{
            libraryId: 'a',
            init: {
              points: [
                [0, 0],
                [1, 0],
                [0, 1]
              ],
            },
          }, {
            libraryId: 'a',
          }, {
            libraryId: 'a',
            init: {
              points: [
                [0, 0],
                [1, 0],
                [0, 1]
              ],
              style: {
                stroke: '#F00',
              },
            },
          }],
        })
      ],
    })
  ],
}, '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
