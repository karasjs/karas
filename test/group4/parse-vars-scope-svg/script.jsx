let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    {
      tagName: 'span',
      props: {
        style: {
          vars: {
            id: 'red',
            member: 'color'
          }
        },
      },
      children: [123],
    },
    karas.parse({
      tagName: 'div',
      props: {
        style: {
          vars: {
            id: 'red',
            member: 'color'
          }
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
