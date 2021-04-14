let count = 0;
let input = document.querySelector('#base64');
function cb(v) {
  input.value = v;
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#F00',overflow:'hidden'}} onClick={()=>cb(count++)}/>
    <$rect mask={1} style={{position:'absolute',left:50,top:50,width:30,height:30,fill:'#FFF'}}/>
    <div style={{width:100,height:100,background:'#00F',overflow:'hidden'}} onClick={()=>cb(count++)}/>
    <$rect clip={1} style={{position:'absolute',left:50,top:150,width:30,height:30,fill:'#FFF'}}/>
  </svg>,
  '#test'
);
