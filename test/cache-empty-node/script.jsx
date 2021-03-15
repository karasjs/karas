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
        position: 'absolute',
        left: '50%',
        top: '50%',
        padding: 2,
        background: '#CCC',
      },
    },
    children: [
      {
        tagName: 'span',
        props: {
          style: {
            position: 'relative',
            display:'inlineBlock',
            padding: 2,
          }
        },
        children: [
          {
            tagName: 'span',
            props: {
              style: {
                display:'inlineBlock',
                padding: 2,
              }
            },
            children: [
              {
                tagName: 'span',
                children: ['abc']
              },
            ]
          },
        ]
      },
    ],
  }]
};

karas.parse(json, '#test');
