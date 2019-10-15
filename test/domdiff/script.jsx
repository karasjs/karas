function render(color, size) {
  karas.render(
    <canvas width="360" height="360">
      <$circle style={{width:size,height:size,strokeWidth:0,fill:color}}/>
    </canvas>,
    '#test'
  );
}

render('#F00', 10);
render('#00F', 100);
