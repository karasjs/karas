let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'inline',width:100,height:100,background:'#F00'}}>a</div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
o.children[0].updateStyle({
  display: 'block',
}, function() {
  input.value = document.querySelector('svg').innerHTML;
});
