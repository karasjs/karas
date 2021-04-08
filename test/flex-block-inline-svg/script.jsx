let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <div style={{flex:1,background:'#F00'}}>
        <div>div</div>
        <span>span</span>
        <span style={{fontSize:30}}>span</span>
        <div>div</div>
        <span>span</span>
        <span>span</span>
      </div>
    </div>
    <div style={{display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,background:'#00F'}}>
        <div>div</div>
        <span>span</span>
        <span style={{fontSize:30}}>span</span>
        <div>div</div>
        <span>span</span>
        <span>span</span>
      </div>
    </div>
    <div style={{display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,background:'#0F0'}}>
        <div>
          <div>div</div>
          <span>span</span>
          <span style={{fontSize:30}}>span</span>
          <div>div</div>
          <span>span</span>
          <span>span</span>
        </div>
      </div>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
