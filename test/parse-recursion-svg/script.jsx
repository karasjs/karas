let o = karas.parse({
  tagName: 'svg',
  props: {},
  children: [
    karas.parse({
      tagName: 'div',
      props: {},
      children: [123],
    })
  ],
}, '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
