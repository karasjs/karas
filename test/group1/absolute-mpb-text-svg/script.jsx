let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      position: 'relative',
      margin: 150,
    }}>
        <span style={{
          position: 'absolute',
          left: 20,
          background: '#F00',
        }}>2222222222222</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
