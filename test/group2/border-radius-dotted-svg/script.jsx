let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:300,height:300,
      border:'10px dotted rgba(0,0,0,0.5)',
      borderBottomColor: 'rgba(255,0,0,0.5)',
      borderLeftColor: 'rgba(0,255,0,0.5)',
      borderRightColor: 'rgba(0,0,255,0.5)',
      borderRadius:'50/100',
      backgroundClip:'paddingBox'
    }}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
