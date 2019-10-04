function render(color) {
  let o = karas.render(
    <svg width="360" height="360">
      <$circle style={{width:100,height:100,strokeWidth:0,fill:color}}/>
    </svg>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
}

render('radial-gradient(#F00,#00F)');
render('radial-gradient(rgba(0,0,0),rgb(255,255,0))');
render('radial-gradient(#0F0,rgb(0,0,0))');

