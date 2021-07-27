let o = karas.render(
  <svg width="360" height="360">
    <$sector begin={[30, 120]} end={[100, 290]} closure={[true, false]} edge={[true, true]} multi={true} style={{margin:2,width:50,height:50}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
