let n = 0;
function cb() {
  let input = document.querySelector('#base64');
  input.value = n++;
}

let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:20,top:20,width:100,height:100,perspective:100}}>
        <span style={{width:100,height:100,display:'block',
          background:'linearGradient(#F00,#00F)',transform:'rotateY(45)'}}
              onClick={cb}
              ref="span"/>
    </div>
  </webgl>,
  '#test'
);
