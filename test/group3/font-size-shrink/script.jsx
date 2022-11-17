let o = karas.render(
  <canvas width={360} height={360}>
    <div style={{width:40,background:'#F00',whiteSpace:'nowrap',overflow:'hidden',
      textOverflow:'ellipsis',fontSizeShrink:14}}>abcdefg</div>
    <div style={{width:40,background:'#F00',whiteSpace:'nowrap',overflow:'hidden',
      textOverflow:'ellipsis',fontSizeShrink:10}}>abcdefg</div>
    <div style={{width:40,background:'#F00',whiteSpace:'nowrap',
      fontSizeShrink:10}}>abcdefg</div>
  </canvas>,
  '#test'
);
