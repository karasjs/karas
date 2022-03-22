let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,width:30,lineClamp:3}}>222222<span>3333</span></div>
    <div style={{margin:10,width:30,lineClamp:3}}>2222222<span>3333</span></div>
    <div style={{margin:10,width:30,lineClamp:3}}>222<p>3333333333</p>22222222</div>
    <div style={{display:'inlineBlock',margin:10,width:30,lineClamp:1}}>44444444</div>
    <div style={{position:'absolute',left:100,top:10,display:'flex',width:100,lineClamp:2}}>
      <span style={{flex:'1 0 auto'}}>22222</span>333333333333</div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom) + document.querySelector('svg').innerHTML;
