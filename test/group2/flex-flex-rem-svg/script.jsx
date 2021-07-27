let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse(
        {
          "tagName": "div",
          "props": {
            "style": {
              "background": "rgba(255,255,255,1)",
              "display": "flex",
              "flexDirection": "row",
            },
          },
          "children": [
            {
              "tagName": "p",
              "props": {
                "style": {
                  "display": "flex",
                  "flexDirection": "column",
                },
              },
              "children": [
                {
                  "tagName": "div",
                  "children": [
                    {
                      "tagName": "span",
                      "props": {
                        "style": {
                          "fontSize": 32,
                        },
                      },
                      "children": [
                        "本周收益"
                      ]
                    },
                    {
                      "tagName": "img",
                      "props": {
                        "style": {
                          "width": "3rem",
                          "height": 25
                        },
                        "src": "https://mdn.alipayobjects.com/yuyan_hca3c9/afts/img/fbzYQImrg_YAAAAAAAAAAAAAFqh2AQBr",
                      }
                    }
                  ]
                }
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
