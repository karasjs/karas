let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [{
    tagName: 'div',
    props: {},
    children: [
      {
        libraryId: 'a',
      }
    ],
    library: [
      {
        id: 'a',
        tagName: 'p',
        props: { style: { padding: 10, background: '#F00' } },
        children: [
          {
            tagName: 'span',
            children: [
              {
                libraryId: 'c',
              }
            ],
            library: [
              {
                id: 'c',
                tagName: 'strong',
                props: { style: { display:'inlineBlock', width: 100, height: 100, background: '#0F0' } },
                children: [
                ],
              }
            ]
          },
          {
            libraryId: 'b',
          }
        ],
        library: [
          {
            id: 'b',
            tagName: 'b',
            props: { style: { display:'inlineBlock',width: 100, height: 100, background: '#00F' } },
            children: [
            ],
          }
        ]
      }
    ]
  }],
}, '#test');
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
