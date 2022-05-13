let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#00F'}}>
      <span style={{background:'#F00',width:100}}>a</span>
    </div>
    <div style={{display:'flex',flexDirection:'column',height:100,alignItems:'center',justifyContent:'center',background:'#0FF'}}>
      <span style={{background:'#F00',width:100}}>a</span>
    </div>
    {
      karas.parse(
        {
          "tagName": "div",
          "props": {
            "style": {
              border:'1px solid #000'
            }
          },
          "children": [
            {
              "tagName": "div",
              "props": {
                "style": {
                  "display": "flex",
                  "flexDirection": "column"
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
                      "alignSelf": "flexStart",
                      background:'#F00'
                    }
                  },
                  "children": [
                    {
                      "tagName": "img",
                      "props": {
                        "src": "../../logo.png",
                        "style": {
                          "width": 64,
                          "height": 64,
                        }
                      }
                    },
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
