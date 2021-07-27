var input = document.querySelector('#base64');
try {
  let o = karas.parse({
    tagName: 'svg',
    props: {},
    children: [
      karas.parse({
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
          libraryId: 'b',
        }],
      })
    ],
  }, '#test');
  input.value = JSON.stringify(o.virtualDom);
} catch(e) {
  input.value = e.toString();
}
