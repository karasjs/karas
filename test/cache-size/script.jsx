karas.refresh.Page.MAX = 256;

let json = {
  tagName: 'canvas',
  props: {
    cache: true,
    width: 360,
    height: 360,
  },
  children: [{
    tagName: 'div',
    props: {
      style: {
        margin: 2,
        padding: 2,
        width: 300,
        height: 300,
        background: '#F00',
      },
    },
    children: [
      'a',
    ],
  }]
};

karas.parse(json, '#test');
