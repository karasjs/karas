karas.render(
  <canvas width="720" height="720" style={{fontSize:150}}>
    {
      karas.parse(
        {
          "tagName": "div",
          "props": {
            "style": {
              "padding": "0.25rem 0.27rem 0.25rem 0.27rem",
              background: '#F00',
              "display": "flex",
            },
          },
          "children": [
            {
              "tagName": "p",
              "props": {
                "style": {
                  "display": "flex",
                  background: '#00F'
                },
              },
              "children": [
                {
                  "tagName": "span",
                  "props": {
                    "style": {
                      "fz": "0.32rem",
                      "flex": 1
                    },
                  },
                  "children": [
                    "aaaaaaaa"
                  ]
                },
                {
                  "tagName": "strong",
                  "props": {
                    "style": {
                      "padding": "0 0.06848rem 0 0.06848rem",
                      "fz": "0.228rem",
                    }
                  },
                  "children": [
                    "aaaaaa"
                  ]
                }
              ]
            }
          ]
        }
      )
    }
  </canvas>,
  '#test'
);
