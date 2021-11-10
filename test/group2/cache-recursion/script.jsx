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
      cacheAsBitmap: 1,
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
            background: '#F00',
          }
        },
        children: [
          'a',
          {
            tagName: 'span',
            props: {
              style: {
                position: 'relative',
                display:'inlineBlock',
                padding: 2,
                background: '#0F0',
              }
            },
            children: [
              'b',
              {
                tagName: 'span',
                props: {
                  style: {
                    position: 'relative',
                    display:'inlineBlock',
                    padding: 2,
                    background: '#00F',
                  }
                },
                children: ['c']
              }
            ],
          }
        ],
      },
    ],
  }]
};

karas.parse(json, '#test');
