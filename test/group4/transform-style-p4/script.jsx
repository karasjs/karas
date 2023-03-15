karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 100,
      top: 40,
      width: 300,
      height: 300,
      perspective: 500,
      perspectiveOrigin: 'center -300',
      transformStyle: 'preserve3d',
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 50,
        height: 300,
        background: 'linear-gradient(40deg,#F30,#F93)',
        rotateY: -30,
        transformStyle: 'preserve3d',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 50,
          height: 300,
          background: 'linear-gradient(40deg,#39F,#9CF)',
          rotateY: -90,
          transformOrigin: 'right center',
        }}/>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 50,
          height: 50,
          background: 'linear-gradient(90deg,#3F9,#9FC)',
          rotateX: -90,
          transformOrigin: 'center top',
        }}/>
      </div>
    </div>
  </webgl>,
  '#test'
);
