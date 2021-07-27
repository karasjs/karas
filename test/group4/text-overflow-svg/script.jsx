let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:30,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>123456</div>
    <div style={{width:30,whiteSpace:'nowrap',overflow:'hidden'}}>123456</div>
    <div style={{width:30,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
      <span>123456</span>
    </div>
    <span style={{width:30,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>123456</span>
    <span style={{display:'inlineBlock',width:30,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>123456</span>
    <div style={{width:30,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
      <span>1</span><span>234</span>
    </div>
    <div style={{width:30,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
      <span>12</span><span>34</span>
    </div>
    <div style={{width:30,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
      <span>1</span><span>2</span><span>34</span>
    </div>
    <div style={{width:30}}>
      <div style={{display:'inlineBlock',background:'#F00',overflow:'hidden',textOverflow:'ellipsis', whiteSpace:'nowrap'}}>123456</div>
    </div>
    <div style={{display:'inlineBlock',width:30,background:'#F00',overflow:'hidden',textOverflow:'ellipsis', whiteSpace:'nowrap'}}>123456</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom) + document.querySelector('svg').innerHTML;
