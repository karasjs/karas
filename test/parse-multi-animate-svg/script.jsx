let o = karas.render(
  <svg width={360} height={360}>
    {
      karas.parse({
        tagName: 'div',
        props: {
          style: {
            position: 'relative',
            width: 360,
            height: 360,
          },
        },
        children: [
          {
            tagName: '$rect',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                top: 0,
                width: 100,
                height: 100,
                fill: '#F00'
              }
            },
            animate: [
              {
                value: [
                  {
                    translateX: 0,
                  },
                  {
                    translateX: 100,
                  }
                ],
                options: {
                  duration: 100,
                  fill: 'forwards'
                }
              }
            ]
          },
          {
            tagName: '$circle',
            props: {
              ref: 't',
              style: {
                position: 'absolute',
                left: 120,
                top: 120,
                width: 100,
                height: 100,
                fill: '#00F'
              }
            },
            animate: [
              {
                value: [
                  {
                    translateY: 0,
                  },
                  {
                    translateY: 100,
                  }
                ],
                options: {
                  duration: 100,
                  fill: 'forwards'
                }
              }
            ]
          },
        ],
      })
    }
  </svg>,
  '#test'
);
o.ref.t.animationList[0].on('finish', function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
