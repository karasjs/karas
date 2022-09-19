karas.render(
  <svg width="360" height="360">
    <div style={{
      position:'relative',
      width: 100,
      height: 100,
      background: '#00F',
    }}>
      <span style={{display:'none'}}>123</span>
      <$rect mask="1" style={{
        position:'absolute',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        fill: '#F99',
      }}/>
    </div>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
input.value = document.querySelector('svg').innerHTML;
