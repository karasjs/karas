let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'div',
      children: [{
        libraryId: '1'
      }, {
        libraryId: 'a'
      }, {
        libraryId: 'xyz'
      }],
      animate: {
        value: [
          {
            translateX: 0,
          },
          {
            translateX: 100,
          }
        ],
        options: {
          duration: 200,
          fill: 'both',
        },
      },
      library: [{
        id: '1',
        tagName: 'span',
        children: [123]
      }, {
        id: 'a',
        tagName: 'span',
        children: [456]
      }, {
        id: 'xyz',
        tagName: 'img',
        props: { src: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" }
      }],
      "var-library.1": {
        id: 'aaa'
      },
      "var-library.a": {
        id: 'bbb'
      },
      "var-library.xyz.props.src": {
        id: 'ccc'
      }
    }
  ],
}, '#test', {
  vars: {
    aaa: {
      tagName: 'span',
      children: ["200"]
    },
    bbb: { tagName: 'span', children: ["abc"] },
    ccc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
  },
});
let t = o.children[0];
t.animationList[0].on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
