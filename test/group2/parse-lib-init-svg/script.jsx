let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    karas.parse({
      library: [{
        id: 'a',
        tagName: 'span',
        props: {
          style: {
            color: '#F00',
            fontWeight: 700,
          },
        },
        children: [123],
      }],
      tagName: 'div',
      children: [{
        libraryId: 'a',
        init: {
          style: {
            color: '#00F',
            fontSize: 30,
          },
        },
      }],
    })
  ],
}, '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
