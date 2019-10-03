function render(color, size) {
  let o = karas.render(
    <svg width="360" height="360">
      <$circle style={{width:size,height:size,strokeWidth:0,fill:color}}/>
    </svg>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
}

render('#F00', 10);
render('#00F', 100);

