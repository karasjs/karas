let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,width:50,background:'#CCC',whiteSpace:'nowrap'}}>
      <span style={{background:'#F00'}}>22222<strong style={{fontSize:40,padding:3,background:'rgba(0,0,255,0.3)'}}>33</strong>2</span>
    </div>
    <div style={{margin:10,width:50,background:'#CCC',whiteSpace:'nowrap'}}>
      <span style={{background:'#F00'}}>22222<strong style={{fontSize:40,padding:3,background:'rgba(0,0,255,0.3)',whiteSpace:'normal'}}>33</strong>2</span>
    </div>
    <div style={{margin:10,width:50,background:'#CCC',whiteSpace:'nowrap'}}>
      <span style={{background:'#F00'}}>22222<strong style={{display:'inlineBlock',fontSize:40,padding:3,background:'rgba(0,0,255,0.3)'}}>33</strong>2</span>
    </div>
    <div style={{margin:10,width:50,background:'#CCC',whiteSpace:'nowrap'}}>
      <span style={{background:'#F00'}}>22222<strong style={{display:'inlineBlock',fontSize:40,padding:3,background:'rgba(0,0,255,0.3)',whiteSpace:'normal'}}>33</strong>2</span>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
