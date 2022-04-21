let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:20,background:'rgba(0,0,0,0.3)',width:50}}>
      <span style={{background:'rgba(255,0,0,0.3)'}}>2<strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,0,255,0.3)'}}/><strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,255,0,0.3)'}}/>2</span>
    </div>
    <div style={{margin:20,background:'rgba(0,0,0,0.3)',width:50}}>
      <span style={{background:'rgba(255,0,0,0.3)'}}>2<strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,0,255,0.3)'}}/><strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,255,0,0.3)'}}/></span>
    </div>
    <div style={{margin:20,background:'rgba(0,0,0,0.3)',width:50}}>
      <span style={{background:'rgba(255,0,0,0.3)'}}><strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,0,255,0.3)'}}/><strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,255,0,0.3)'}}/>2</span>
    </div>
    <div style={{margin:20,width:100}}>
      <span style={{paddingLeft:10,background:'#000'}}/>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
