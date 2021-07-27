let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      textAlign:'center',
    }}>
        <span ref="span1" style={{
          position:'relative',
          left:-100,
          paddingLeft: 10,
          background:'#F00',
        }}>123</span>
    </div>
    <div style={{
      textAlign:'center',
      width: 50,
    }}>
        <span ref="span2" style={{
          position:'relative',
          left:100,
          paddingLeft: 10,
          background:'#F00',
        }}>aaaaaa</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = o.ref.span1.children[0].sx + ',' + o.ref.span2.children[0].sx;
