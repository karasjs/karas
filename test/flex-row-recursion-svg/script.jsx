let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',margin:5,padding:5,background:'#F00'}}>
      <p>1</p>
      <p style={{background:'#CCC'}}>22</p>
      <p style={{display:'flex',margin:5,padding:5,background:'#0F0'}}>
        <span>3</span>
        <span style={{background:'#00F',flex:1}}>44</span>
        <span style={{display:'flex',margin:5,padding:5,background:'#FF0'}}>
          <span style={{width:20}}>5</span>
          <span style={{margin:5,padding:5,background:'#0FF'}}>66</span>
        </span>
      </p>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
