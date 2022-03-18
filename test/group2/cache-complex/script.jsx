let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{background:'#F00',width:40}} ref="div">
      <span ref="span" style={{display:'inlineBlock',padding:2,background:'#00F',translateX:-10,translateY:10}}>123</span>
    </div>
  </canvas>,
  '#test'
);
