karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:'50%',top:'50%',padding:2,background:'#CCC'}}>
        <span style={{display:'inlineBlock'}}>
          <strong>abc</strong>
        </span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('input');
input.value = document.querySelector('svg').innerHTML;
