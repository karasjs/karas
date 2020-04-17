let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    karas.parse({
      library: [{
        id: 'a',
        tagName: 'span',
        props: {
          style: {
            color: '#F00',
          },
        },
        children: [123],
        'var-children.0': {
          id: 'c',
        },
      }],
      tagName: 'div',
      props: {},
      children: [{
        libraryId: 'a',
      }],
    }, {
      vars: {
        c: 456,
      },
    })
  ],
}, '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
