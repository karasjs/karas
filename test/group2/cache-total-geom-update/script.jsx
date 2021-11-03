let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    {
      karas.parse(
        {
          "tagName": "div",
          "props": {
            cacheAsBitmap: 1,
            "style": {
              "position": "absolute",
              "top": "5%",
              "width": "200",
              "height": "200",
              "transformOrigin": "center bottom"
            }
          },
          "children": [
            {
              "tagName": "$circle",
              "props": {
                "style": {
                  "position": "absolute",
                  "left": "5%",
                  "top": "5%",
                  "width": "90%",
                  "height": "90%",
                  "strokeWidth": 0,
                  "fill": "#f55718"
                }
              }
            },
            {
              "tagName": "$polygon",
              "props": {
                "ref": "p",
                "points": [
                  [0.4673, 0.76],
                  [0.4673, 0.64],
                  [0.3266, 0.64],
                  [0.3266, 0.5666],
                  [0.4673, 0.5666],
                  [0.4673, 0.5],
                  [0.3266, 0.5],
                  [0.3266, 0.4266],
                  [0.4266, 0.4266],
                  [0.3333, 0.3133],
                  [0.38, 0.2726],
                  [0.5, 0.42],
                  [0.62, 0.2726],
                  [0.6667, 0.3133],
                  [0.5734, 0.4266],
                  [0.6734, 0.4266],
                  [0.6734, 0.5],
                  [0.5327, 0.5],
                  [0.5327, 0.5666],
                  [0.6734, 0.5666],
                  [0.6734, 0.64],
                  [0.5327, 0.64],
                  [0.5327, 0.76]
                ],
                "style": {
                  "position": "absolute",
                  "left": "5%",
                  "top": "5%",
                  "width": "90%",
                  "height": "90%",
                  "strokeWidth": 0,
                  "fill": "#fff"
                }
              },
            }
          ]
        }
      )
    }
  </canvas>,
  '#test'
);
o.ref.p.updateStyle({
  visibility: 'visible',
  translateX: 10,
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
