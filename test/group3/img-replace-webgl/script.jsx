let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360"></webgl>,
  '#test'
);

let img = <img src="../../image.png"/>;
o.appendChild(img, function() {
  setTimeout(function() {
    o.removeChild(img, function() {
      setTimeout(function() {
        o.appendChild(<img src="../../logo.png"/>, function() {
          setTimeout(function() {
            let canvas = document.querySelector('canvas');
            let input = document.querySelector('#base64');
            input.value = canvas.toDataURL();
          }, 50);
        });
      }, 50);
    });
  }, 50);
});
