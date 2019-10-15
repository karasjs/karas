let o = karas.render(
  <svg width="360" height="360">
      <div style={{height:10,background:'#F00'}}/>
  </svg>,
  '#test'
);
o.width = 100;
o.refresh();

let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
