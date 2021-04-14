let count = 0;
let input = document.querySelector('#base64');
function cb(v) {
  input.value = v;
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:50,height:50,background:'#F00',overflow:'hidden'}} onClick={()=>cb(count++)}>
      <div style={{width:100,height:100}}>aaa</div>
    </div>
  </svg>,
  '#test'
);
