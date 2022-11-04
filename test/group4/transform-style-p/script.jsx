karas.render(
  <webgl width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      perspective: 200,
      transformStyle: 'preserve3d',
      fontSize: 48,
      lineHeight: 2,
      textAlign: 'center',
    }}>
      {'F'}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        background: 'rgba(255,0,0,0.3)',
        transformStyle: 'preserve3d',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          background: 'rgba(255,255,0,0.3)',
          transformOrigin: 0,
          rotateY: 90,
        }}>L</div>
        <div style={{
          position: 'absolute',
          left: 100,
          top: 0,
          width: 100,
          height: 100,
          background: 'rgba(0,255,0,0.3)',
          transformOrigin: 0,
          rotateY: 90,
        }}>R</div>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          background: 'rgba(0,0,255,0.3)',
          transformOrigin: 0,
          rotateX: -90,
        }}>T</div>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 100,
          width: 100,
          height: 100,
          background: 'rgba(255,0,255,0.3)',
          transformOrigin: 0,
          rotateX: -90,
        }}>B</div>
      </div>
    </div>
  </webgl>,
  '#test'
);
