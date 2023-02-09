let json = {
  library: [{
    id: 'a',
    tagName: 'span',
    props: {
      style: {
        color: '#999',
        vars: {
          id: 'red',
          member: ['color']
        }
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
    karas.parse(json),
  ],
}, '#test', {
  vars: {
    red: '#F00',
  },
});
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
