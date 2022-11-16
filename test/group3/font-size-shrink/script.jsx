let o = karas.render(
  <canvas width={360} height={360}>
    <div style={{width:50,whiteSpace:'nowrap',overflow:'hidden',
      textOverflow:'ellipsis',fontSizeShrink:11}}>abcdefg</div>
    <div style={{width:50,whiteSpace:'nowrap',overflow:'hidden',
      textOverflow:'ellipsis',fontSizeShrink:10}}>abcdefg</div>
  </canvas>,
  '#test'
);
