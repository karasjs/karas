let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',flexDirection:'column',margin:5,padding:5,background:'#F00'}}>
      <p>0</p>
      <p style={{background:'#CCC'}}>11</p>
      <p style={{flex:1}}>22</p>
      <p style={{display:'flex',flexDirection:'column',margin:5,padding:5,background:'#0F0'}}>
        <span>3</span>
        <span style={{background:'#00F',flex:1}}>44</span>
        <span style={{display:'flex',flexDirection:'column',margin:5,padding:5,background:'#FF0'}}>
          <span style={{height:30,background:'#999'}}>5</span>
          <span style={{margin:5,padding:5,background:'#0FF'}}>66</span>
        </span>
        <p style={{margin:5,padding:5,background:'#F0F',flex:1}}>
          <span style={{display:'block'}}>77</span>
          <span style={{display:'block'}}>8</span>
        </p>
      </p>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
