let o = karas.parse(
  {
    tagName: 'svg',
    props: {
      width: 360,
      height: 360,
    },
    children: [{
      "animate": [
        {
          "v": [
            {
              "tx": 110
            },
            {
              "tx": 110
            }
          ],
          "o": {
            "dt": 200,
            "f": "forwards",
            "i": 1
          }
        },
        {
          "v": [
            {
              "ty": -48
            },
            {
              "ty": 110.16
            }
          ],
          "o": {
            "dt": 200,
            "f": "forwards",
            "i": 1
          }
        },
      ],
      "children": [],
      "props": {
        "src": "data:image/png;base64,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",
        "style": {
          "p": "absolute",
          "w": 220,
          "h": 220,
          "zi": -4,
          "l": -110,
          "t": -110
        }
      },
      "tagName": "img"
    }]
  },
  '#test'
);
o.children[0].animationList[0].on(karas.Event.FINISH, () => {
  let input = document.querySelector('input');
  input.value = JSON.stringify(o.virtualDom);
});
