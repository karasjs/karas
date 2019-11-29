let o = karas.render(
  <canvas width="360" height="360">
    <div style={{ textAlign: 'center' }}>1</div>
  </canvas>,
  '#test'
);
o.__refreshLevel = 1;
o.refresh();
