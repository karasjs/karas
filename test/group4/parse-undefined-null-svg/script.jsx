let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'span',
      props: {
        style: {
          color: '#F00',
          background: '#000',
          vars: [{
            id: 'color',
            member: ['color']
          }, {
            id: 'background',
            member: ['background']
          }]
        }
      },
      children: [123]
    }
  ],
}, '#test', {
  vars: {
    color: undefined,
    background: null,
  },
});
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
