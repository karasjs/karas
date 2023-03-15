karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 20,
      top: 20,
      width: 100,
      height: 100,
      perspective: 500,
      transformStyle: 'preserve3d',
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        background: 'rgba(255,0,0,0.5)',
        rotateY: 45,
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          background: 'rgba(0,0,255,0.5)',
          rotateX: 45,
          transformStyle: 'preserve3d'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            background: 'rgba(0,255,0,0.5)',
            rotateY: 30,
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 100,
              height: 100,
              background: 'rgba(255,255,0,0.5)',
              rotateY: 45,
            }}/>
          </div>
        </div>
      </div>
    </div>
  </webgl>,
  '#test'
);
