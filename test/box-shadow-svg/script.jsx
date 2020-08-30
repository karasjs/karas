let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:20,width:50,height:50,
      boxShadow:'0 5 10 rgba(255,0,0,1),0 5 10 #00F inset'}}/>
    <div style={{margin:20,width:50,height:50,
      boxShadow:'0 5 10 2 rgba(255,0,0,1),0 5 10 2 #00F inset'}}/>
    <div style={{margin:20,width:50,height:50,
      boxShadow:'0 0 0 5 rgba(255,0,0,1),0 0 0 5 #00F inset'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
