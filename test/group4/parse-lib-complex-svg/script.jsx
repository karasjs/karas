let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    {
      library: [{
        id: 'b',
        tagName: 'span',
        props: {
          style: {
            color: '#00F',
          },
        },
        init: {
          style: {
            fontSize: 30,
          },
        },
        children: [123],
      }, {
        id: 'a',
        tagName: 'span',
        props: {
          style: {
            color: '#F00',
          },
        },
        children: [{
          libraryId: 'b',
          init: {
            style: {
              fontWeight: 700,
            },
          },
        }, 456],
      }],
      tagName: 'div',
      props: {},
      children: [{
        libraryId: 'a',
        init: {
          style: {
            fontStyle: 'italic',
          },
        },
      }, {
        libraryId: 'a',
        init: {
          style: {
            color: '#0F0',
          },
        },
      }, {
        libraryId: 'b',
        init: {
          style: {
            color: '#0F0',
          },
        },
      }],
    }
  ],
}, '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
