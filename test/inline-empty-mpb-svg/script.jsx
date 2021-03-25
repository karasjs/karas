let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{margin:20,background:'rgba(0,0,0,0.3)',width:50}}>
      <span ref="span" style={{background:'rgba(255,0,0,0.3)'}}>2<strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,0,255,0.3)'}}/><strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,255,0,0.3)'}}/>2</span>
    </div>
    <div ref="div" style={{margin:20,background:'rgba(0,0,0,0.3)',width:50}}>
      <span ref="span" style={{background:'rgba(255,0,0,0.3)'}}>2<strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,0,255,0.3)'}}/><strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,255,0,0.3)'}}/></span>
    </div>
    <div ref="div" style={{margin:20,background:'rgba(0,0,0,0.3)',width:50}}>
      <span ref="span" style={{background:'rgba(255,0,0,0.3)'}}><strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,0,255,0.3)'}}/><strong ref="strong" style={{padding:5,fontSize:30,background:'rgba(0,255,0,0.3)'}}/>2</span>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
