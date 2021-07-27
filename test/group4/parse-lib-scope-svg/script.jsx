let o = karas.parse({
  library: [{
    id: 'a',
    tagName: 'span',
    props: {
      style: {
        color: '#F00',
      },
    },
    children: [123],
  }],
  tagName: 'svg',
  props: {},
  children: [
    karas.parse({
      library: [{
        id: 'a',
        tagName: 'span',
        props: {
          style: {
            color: '#00F',
          },
        },
        children: [456],
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
