let o = karas.render(
  <webgl width="360" height="360">
    <div style={{position:'absolute',left:20,top:20,width:100,height:100,background:'#99c',transform:'perspective(500)rotateY(40)'}}>
      <p style={{width:100,height:100,background:'#F00',
        transform:'perspective(500)rotateY(40)'}}/>
    </div>
    <div style={{position:'absolute',left:220,top:20,width:100,height:100,perspective:500}}>
      <div style={{width:100,height:100,background:'#c99',perspective:500,
        transform:'rotateY(40)'}}>
        <div style={{width:100,height:100,background:'#00F',
          transform:'rotateY(40)'}}>
        </div>
      </div>
    </div>
  </webgl>,
  '#test'
);
