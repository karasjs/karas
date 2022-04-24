let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,width:100,height:100,background:'#F00',}}/>
    <div style={{margin:10,background:'#0FF',
      fontSize:32,writingMode:'verticalLr'}}>
      {'a'}
    </div>
    <div style={{margin:10,background:'#00f'}}>
      <span style={{background:'#f00'}}>aaa</span>
      <strong style={{background:'#0ff',writingMode:'vertical-lr'}}>bbb</strong>
    </div>
    <div style={{margin:10,background:'#00f'}}>
      <span style={{height:20,writingMode:'vertical-lr',background:'#f00'}}>aaa</span>
      <strong style={{background:'#0ff'}}>bbb</strong>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
