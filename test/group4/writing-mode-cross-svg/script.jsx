let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,width:100,height:100,background:'#F00',}}/>
    <div style={{margin:10,background:'#0FF',
      fontSize:32,writingMode:'verticalLr'}}>
      {'a'}
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
