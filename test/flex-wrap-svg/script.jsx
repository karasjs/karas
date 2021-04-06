let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',flexWrap:'wrap',margin:5,width:70,background:'#CCC'}}>
      <span style={{width:30,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
    <div style={{display:'flex',flexWrap:'wrap',margin:5,width:70,background:'#CCC',justifyContent:'center'}}>
      <span style={{width:30,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
    <div style={{display:'flex',flexWrap:'wrap',margin:5,width:70,height:70,background:'#CCC'}}>
      <span style={{width:30,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
    <div style={{display:'flex',flexWrap:'wrap',margin:5,width:70,height:70,background:'#CCC',alignContent:'center'}}>
      <span style={{width:30,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
    <div style={{display:'flex',flexWrap:'wrap',margin:5,width:70,height:70,background:'#CCC',alignContent:'flex-end'}}>
      <span style={{width:30,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
    <div style={{position:'absolute',left:120,top:0,display:'flex',flexWrap:'wrap',width:70,height:70,background:'#CCC',alignContent:'space-between'}}>
      <span style={{width:30,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
    <div style={{position:'absolute',left:120,top:75,display:'flex',flexWrap:'wrap',width:70,height:70,background:'#CCC',alignContent:'space-around'}}>
      <span style={{width:30,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
    <div style={{position:'absolute',left:120,top:150,display:'flex',flexWrap:'wrap',width:70,height:70,background:'#CCC'}}>
      <span style={{width:30,height:40,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
    <div style={{position:'absolute',left:120,top:225,display:'flex',flexWrap:'wrap',width:70,height:70,background:'#CCC',alignContent:'center'}}>
      <span style={{width:30,height:40,background:'#F00'}}>2</span>
      <span style={{width:30,background:'#0F0'}}>3</span>
      <span style={{width:30,background:'#00F'}}>4</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
