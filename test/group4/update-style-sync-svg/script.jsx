let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [123],
});
o.updateStyle({
  color: '#00F'
});
o.appendTo('#test');
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
