let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse(
        {
          "tagName": "div",
          "props": {
            "style": {
              "display": "flex",
              "position": "relative",
              "flexDirection": "column",
              "alignItems": "stretch"
            }
          },
          "children": [
            {
              "tagName": "div",
              "props": {
                "style": {
                  "display": "flex",
                  "position": "relative",
                  "marginTop": 27,
                  "flexDirection": "row",
                  "alignItems": "flexStart"
                }
              },
              "children": [
                {
                  "tagName": "div",
                  "props": {
                    "style": {
                      "display": "flex",
                      "position": "relative",
                      "flexDirection": "column",
                      "alignItems": "flexStart",
                      "flexGrow": 1,
                      "fontSize": 24
                    }
                  },
                  "children": [
                    "aaaaaaaaaaaaaaaaaaaa",
                    "bbbbbbbbbbbbbbbbbbbb"
                  ]
                },
                {
                  "tagName": "$rect",
                  "props": {
                    "style": {
                      "width": 224,
                      "height": 168,
                      "marginLeft": 20
                    }
                  }
                }
              ]
            },
            {
              "tagName": "div",
              "props": {
                "style": {
                  "display": "flex",
                  "position": "relative",
                  "marginTop": 24,
                  "fontSize": 24,
                  "flexDirection": "row",
                  "alignItems": "flexStart",
                  "alignSelf": "flexEnd"
                }
              },
              "children": [
                "123",
                "456"
              ]
            }
          ]
        }
      )
    }
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
