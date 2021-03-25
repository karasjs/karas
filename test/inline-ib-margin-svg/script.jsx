let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{margin:10,background:'rgba(0,0,0,0.3)',width:50}}>
      <span ref="span" style={{background:'rgba(255,0,0,0.3)'}}>2<strong ref="strong" style={{display:'inline',margin:5,fontSize:30,background:'rgba(0,0,255,0.3)'}}>3</strong>22</span>
    </div>
    <div ref="div" style={{margin:10,background:'rgba(0,0,0,0.3)',width:50}}>
      <span ref="span" style={{background:'rgba(255,0,0,0.3)'}}>2<strong ref="strong" style={{display:'inlineBlock',margin:5,fontSize:30,background:'rgba(0,0,255,0.3)'}}>3</strong>22</span>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
