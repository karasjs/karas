let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,width:40,lineClamp:2}}><span style={{paddingRight:10}}>222222222</span></div>
    <div style={{margin:10,width:40,lineClamp:3}}><span style={{padding:10}}>222222222222</span></div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom) + document.querySelector('svg').innerHTML;
