let o = karas.render(
  <webgl width="360" height="360">
    {
      karas.parse(
        [
          {
            "tagName": "$rect",
            "props": {
              "style": {
                "p": "absolute",
                "w": 250,
                "h": 250,
                "f": [
                  "rgba(0,0,0,1)"
                ],
                "sw": 0,
                "l": 0,
                "t": 0
              },
            },
          },
          {
            "tagName": "div",
            "props": {
              "style": {
                "p": "absolute",
                "w": 99,
                "h": 99,
                "l": 49.5,
                "t": 129.5,
                background: '#F00',
                opacity: 0.5,
              }
            }
          },
          {
            "tagName": "$rect",
            "props": {
              "style": {
                "p": "absolute",
                "v": "visible",
                "w": 196.22,
                "h": 111.25,
                "f": "rgb(238,224,0,1)",
                "l": 0,
                "t": 70,
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
