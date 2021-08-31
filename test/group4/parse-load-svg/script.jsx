karas.loadAndParse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'Component',
    }
  ],
  components: [{
    tagName: 'Component',
    url: './cp.js'
  }]
}, '#test', {
  callback(res) {
    var input = document.querySelector('#base64');
    input.value = document.querySelector('svg').innerHTML;
  }
});
