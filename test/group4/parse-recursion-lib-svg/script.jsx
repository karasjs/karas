let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    karas.parse({
      library: [{
        id: 'b',
        tagName: 'span',
        props: {
          style: {
            color: '#00F',
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
        }, 456],
      }],
      tagName: 'div',
      props: {},
      children: [{
        libraryId: 'a',
      }],
    })
  ],
}, '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
