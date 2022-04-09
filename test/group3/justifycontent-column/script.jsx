karas.render(
  <canvas width="360" height="360">
    <div style={{display:'flex',flexDirection:'column',height:70,background:'#EEE',justifyContent:'flexEnd'}}>
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
    <div style={{display:'flex',flexDirection:'column',height:70,background:'#CCC',justifyContent:'center'}}>
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
    <div style={{display:'flex',flexDirection:'column',height:70,background:'#EEE',justifyContent:'spaceBetween'}}>
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
    <div style={{display:'flex',flexDirection:'column',height:70,background:'#CCC',justifyContent:'spaceAround'}}>
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
    <div style={{display:'flex',flexDirection:'column',height:70,background:'#EEE',justifyContent:'spaceEvenly'}}>
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  </canvas>,
  '#test'
);
