karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div style={{
      margin:30,
      width: 100,
      height: 100,
      background: '#F00',
      perspective: 200,
    }}>
      <div style={{
        width: 100,
        height: 100,
        background: '#00F',
        rotateY: 45
      }}>
        <div style={{
          width: 100,
          height: 100,
          background: '#0F0',
          rotateY: 45
        }}/>
      </div>
    </div>
    <div style={{
      position: 'absolute',
      left: 150,
      top: 50,
      width: 100,
      height: 100,
      perspective: 500,
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        background: 'rgba(255,0,0,0.5)',
        rotateY: 45,
        perspective: 200,
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          background: 'rgba(0,0,255,0.5)',
          rotateX: -45,
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            background: 'rgba(0,255,0,0.5)',
            rotateY: 45,
          }}/>
        </div>
      </div>
    </div>
  </webgl>,
  '#test'
);
