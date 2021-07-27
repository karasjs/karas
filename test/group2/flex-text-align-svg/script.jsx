let o = karas.render(
  <svg width="360" height="360">
    <div style={{
      display:'flex',
      width: 100,
      height: 100,
      background: '#F00',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>aaaaaaaaaabbbbb</div>
    <div style={{
      display:'flex',
      width: 100,
      height: 100,
      background: '#0F0',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    }}>aaaaaaaaaabbbbb</div>
    <div style={{
      display:'flex',
      flexDirection: 'column',
      width: 100,
      height: 100,
      background: '#00F',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>aaaaaaaaaabbbbb</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
