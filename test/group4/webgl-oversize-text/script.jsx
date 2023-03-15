karas.refresh.Page.CONFIG = {
    SIZE:   [8, 16, 32],
    NUMBER: [8,  8,  8],
};

let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:10,top:10,width:200}}>aaaaaaaaaaaaaaaaaaaaaa</div>
  </webgl>,
  '#test'
);
