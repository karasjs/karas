let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

let o = karas.render(
  <svg width="360" height="360">
    <img src="../image.png" style={{transform:'translate(100px, 100px)'}} onClick={()=>cb(count++)}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
