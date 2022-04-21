let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#F00',
      fontSize:32,writingMode:'verticalLr'}}>
      <span style={{background:'#0ff'}}>aaaaaaa</span>
    </div>
    <div style={{margin:5,width:100,height:100,background:'#F00',
      fontSize:32,writingMode:'verticalLr'}}>
      <span style={{padding:5,background:'#0ff'}}>aaaaaaa</span>
    </div>
    <div style={{margin:10,height:50,background:'#CCC',overflow:'hidden',
      whiteSpace:'nowrap',textOverflow:'ellipsis',writingMode:'vertical-lr'}}>
      <span>222222222</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
