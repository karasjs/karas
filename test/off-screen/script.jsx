karas.render(
  <canvas width="360" height="360" offScreen={true}>
    {
      [1].map(() => <div>hello</div>)
    }
  </canvas>,
  '#test'
);
