let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    {
      tagName: 'span',
      props: {
        style: {
          'var-color': {
            id: 'red',
          },
        },
      },
      children: [123],
    },
    karas.parse({
      tagName: 'div',
      props: {
        style: {
          'var-color': {
            id: 'red',
          },
        },
      },
      children: [456],
    })
  ],
}, '#test', {
  vars: {
    red: '#F00',
  }
});
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
