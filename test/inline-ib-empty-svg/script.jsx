let o = karas.render(
  <svg width="360" height="360">
    <span style={{ display: 'inlineBlock' }}/>
    <div style={{ width: 50, height: 50, background: '#F00' }}/>
    <span/>
    <div style={{ width: 50, height: 50, background: '#0F0' }}/>
    <span style={{ paddingLeft: 10, background: '#ccc' }}/>
    <div style={{ width: 50, height: 50, background: '#00F' }}/>
    <div style={{ padding:20, background: '#F00' }}>
      <span/>
    </div>
    <div style={{ padding:20, background: '#00F' }}>
      <span style={{paddingLeft:1, background: '#ccc'}}/>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
