let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:110,width:50,background:'#CCC'}}>
      <span style={{background:['conicGradient(#F00,#00F)']}}>22222<strong style={{fontSize:50,padding:3}}>33</strong>2</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
