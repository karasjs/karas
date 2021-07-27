let json = {
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
  tagName: 'div',
  props: {},
  children: [{
    libraryId: 'a',
  }],
};

let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    json,
    json,
  ],
}, '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
