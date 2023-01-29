let o = karas.render(
  <webgl width="360" height="360">
    {
      karas.parse(
        [
          {
            "tagName": "$rect",
            "props": {
              "style": {
                "position": "absolute",
                "width": 250,
                "height": 250,
                "fill": [
                  "rgba(0,0,0,1)"
                ],
                "strokeWidth": 0,
                "left": 0,
                "top": 0
              },
            },
          },
          {
            "tagName": "div",
            "props": {
              "style": {
                "position": "absolute",
                "width": 99,
                "height": 99,
                "left": 49.5,
                "top": 129.5,
                background: '#F00',
                opacity: 0.5,
              }
            }
          },
          {
            "tagName": "$rect",
            "props": {
              "style": {
                "position": "absolute",
                "visibility": "visible",
                "width": 196.22,
                "height": 111.25,
                "fill": "rgb(238,224,0,1)",
                "left": 0,
                "top": 70,
                opacity: 0.3,
              },
              "mask": true,
            }
          }
        ]
      )
    }
  </webgl>,
  '#test'
);
