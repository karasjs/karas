let o = karas.parse(
  {
    tagName: 'svg',
    props: {
      width: 360,
      height: 360,
    },
    children: [
      {
        "tagName":"$polygon",
        "props":{
          "mask":true,
          "points":[
            [
              0,
              0
            ],
            [
              1,
              1
            ],
            [
              0,
              1
            ]
          ],
          "style":{
            "position":"absolute",
            "left":0,
            "top":0,
            "width":100,
            "height":100,
            "strokeWidth":0,
            "fill":"#252525"
          }
        },
        "animate":[
          {
            "value":[
              {
                "points":[
                  [
                    0,
                    0
                  ],
                  [
                    1,
                    1
                  ],
                  [
                    0,
                    1
                  ]
                ],
                "offset":0
              },
              {
                "points":[
                  [
                    0,
                    0
                  ],
                  [
                    1,
                    0.3
                  ],
                  [
                    0,
                    1
                  ]
                ]
              }
            ],
            "options":{
              "duration": 200,
              "fill": "both"
            }
          }
        ]
      },
      {
        "tagName":"div",
        "props":{
          "style":{
            "position":"absolute",
            "left":5,
            "top":10,
            "width":100,
            "height":100,
            "background":"#F00"
          }
        },
        "children":[
          "123"
        ]
      }
    ]
  },
  '#test'
);
let input = document.querySelector('input');
input.value = 1;
window.onerror = function() {
  input.value = 2;
};
