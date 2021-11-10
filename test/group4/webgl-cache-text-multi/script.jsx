let o = karas.render(
  <webgl width="360" height="360">
    <div cacheAsBitmap={0}>
      <span style={{background:'#F00'}}>aaa</span>
      <span style={{background:'#0F0'}}>bbb</span>
      <p style={{background:'#00F'}}>ccc</p>
    </div>
  </webgl>,
  '#test'
);
