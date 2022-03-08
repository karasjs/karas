let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',flexDirection:'column',background:'#F00'}}>
      {
        karas.parse(
          {
            tagName: "span",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                background: "#0f0",
                fontSize: 40,
                marginRight: 150
              },
            },
            children: [
              "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            ],
          }
        )
      }
    </div>
    <div>B</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
