let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div ref="div"
         style={{
           position: 'absolute',
           right: '68%',
           bottom: '15%',
           padding: '41.67% 14.4%',
           width: 0,
           height: 0,
           background: 'rgba(0, 0, 0, 0.1)',
         }}>
      <p style={{
           position: 'absolute',
           left: 0,
           top: 0,
           width: '80%',
           height: '80%',
           background: 'rgba(255,0,0,0.1)'
         }}/>
      <strong style={{
                position: 'absolute',
                visibility: 'hidden',
              }}>1</strong>
    </div>
  </canvas>,
  '#test'
);

o.ref.div.updateStyle({
  translateX: 200
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
