let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,transform:'translate(100px, 100px)'}}>
      <img src="../../image.png" onClick={()=>cb(count++)}/>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
