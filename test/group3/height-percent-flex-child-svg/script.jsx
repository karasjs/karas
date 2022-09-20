let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',height:200,border:'1px solid #000'}}>
      <p style={{flex:1,background:'#00F'}}>
        <span style={{display:'block',height:'90%',background:'#F00'}}/>
      </p>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = document.querySelector('svg').innerHTML;
