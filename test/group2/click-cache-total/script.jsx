let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} ref="a" style={{
      position:'absolute',left:10,top:10,width:100,height:100,
      background:'#F00',
    }}>
        <span onClick={e => cb(count++)} style={{
          position:'absolute',left:10,top:10,width:50,height:50,
          background:'#00F',
        }}></span>
    </div>
    <div cacheAsBitmap={1} ref="b" style={{
      position:'absolute',left:10,top:120,width:100,height:100,
      background:'#F00',
    }}>
      <p cacheAsBitmap={1} ref="c" style={{
        position:'absolute',left:10,top:10,width:80,height:80,
        background:'#0F0',
      }}>
          <span onClick={e => cb(count++)} ref="d" style={{
            position:'absolute',left:10,top:10,width:50,height:50,
            background:'#00F',
          }}/>
      </p>
    </div>
  </canvas>,
  '#test'
);
o.ref.a.updateStyle({
  translateX:100
});
o.ref.b.updateStyle({
  translateX:100
});
o.ref.c.updateStyle({
  translateY:100
});
