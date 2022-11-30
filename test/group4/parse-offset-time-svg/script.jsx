let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse({
        tagName: 'div',
        children: [
          {
            libraryId: 1,
            init: {
              style: {
                left: 0,
                top: 0,
              }
            }
          },
          {
            libraryId: 1,
            areaStart: 100,
            init: {
              style: {
                left: 20,
                top: 20,
              }
            }
          },
          {
            libraryId: 2,
            areaStart: 200,
            init: {
              style: {
                left: 40,
                top: 40,
              }
            }
          }
        ],
        library: [
          {
            id: 0,
            tagName: 'p',
            props: {
              style: {
                position: 'absolute',
                width: 20,
                height: 20,
                background: '#F00'
              }
            }
          },
          {
            id: 1,
            tagName: 'div',
            props: {
              style: {
                position: 'absolute',
              }
            },
            children: [
              {
                libraryId: 0,
                init: {
                  style: {
                    left: 0,
                    top: 0,
                  }
                },
                animate: [
                  {
                    value: [
                      {},
                      {
                        translateX: 100,
                      }
                    ],
                    options: {
                      duration: 1000,
                      fill: 'both',
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            tagName: 'div',
            props: {
              style: {
                position: 'absolute',
              }
            },
            children: [
              {
                libraryId: 1,
                areaStart: 300,
                init: {
                  style: {
                    left: 0,
                    top: 0,
                  }
                },
                animate: [
                  {
                    value: [
                      {},
                      {
                        translateY: 100,
                      }
                    ],
                    options: {
                      duration: 1000,
                      fill: 'both',
                    }
                  }
                ]
              }
            ]
          }
        ]
      })
    }
  </svg>,
  '#test'
);
o.animateController.gotoAndStop(600, function() {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
