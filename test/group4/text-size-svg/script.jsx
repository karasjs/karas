let o = karas.render(
  <svg width="360" height="360">
    <div ref="div1" style={{textAlign:'center'}}>a</div>
    <div ref="div2" style={{display:'inlineBlock',width:200,textAlign:'center'}}>a</div>
    <div ref="div3" style={{textAlign:'center'}}><span>a</span></div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
let t1 = o.ref.div1.children[0];
let t2 = o.ref.div2.children[0];
let t3 = o.ref.div3.children[0];
input.value = t1.x + ',' + t1.width + ',' + t2.x + ',' + t2.width + ',' + t3.x + ',' + t3.width;
