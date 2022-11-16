let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:50,height:50,boxSizing:'borderBox',
      padding:5,border:'5px solid #000',background:'#F00'}}/>
    <div style={{display:'flex',marginTop:10,width:200}}>
      <div style={{flex:'1 0 auto',background:'#F00'}}>
        <div style={{width:10,height:10,padding:10,boxSizing:'borderBox'}}/>
      </div>
      <div style={{flex:'1 0 auto',background:'#00F'}}>
        <div style={{width:10,height:10,padding:10}}/>
      </div>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
