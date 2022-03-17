let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse(
        {
          "tagName": "div",
          "props": {
            "style": {
            }
          },
          "children": [
            {
              "tagName": "div",
              "props": {
                "style": {
                  "display": "flex",
                  "flexDirection": "column",
                  "justifyContent": "flexStart"
                }
              },
              "children": [
                {
                  "tagName": "div",
                  "props": {
                    "style": {
                      "display": "flex",
                      "flexDirection": "row",
                      "justifyContent": "center",
                      "alignItems": "flexStart",
                      "fontSize": 60
                    }
                  },
                  "children": [
                    {
                      "tagName": "div",
                      "props": {
                        "style": {
                          "display": "flex",
                          "flexDirection": "column",
                          "justifyContent": "flexStart",
                          "alignItems": "flexStart",
                          "flexGrow": 1
                        }
                      },
                      "children": [
                        {
                          "tagName": "div",
                          "children": [
                            "AAAAAAAAAAAAAAAAAAAA"
                          ],
                          "props": {
                            "style": {
                              "lineClamp": 2
                            }
                          }
                        },
                        {
                          "tagName": "div",
                          "children": [
                            "BBBBBBBBBBBBBBBBBBBB"
                          ],
                          "props": {
                            "style": {
                              "marginTop": 24,
                              "lineClamp": 2
                            }
                          }
                        }
                      ]
                    },
                    {
                      "tagName": "img",
                      "props": {
                        "src": "../../logo.png",
                        "style": {
                          "width": 200,
                          "height": 200,
                          "marginLeft": 40
                        }
                      }
                    }
                  ]
                },
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
