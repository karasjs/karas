let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:'50%',height:'50%',background:'#000',zIndex:999}}/>
    <div style={{position:'absolute',left:30,top:30,width:'50%',height:'50%',background:'#f00',zIndex:3}}/>
    <div style={{position:'relative',left:10,top:10,width:'50%',height:'50%',background:'#0f0',zIndex:1}}/>
    <div style={{position:'absolute',left:20,top:20,width:'50%',height:'50%',background:'#00f',zIndex:2}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
