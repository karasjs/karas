let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',display:'none'}} ref="div">
      <span ref="b">
        <$rect ref="$rect"/>
      </span>
    </div>
  </svg>,
  '#test'
);

let input = document.querySelector('input');
input.value = o.ref.b.getComputedStyle('display').display + o.ref.$rect.getComputedStyle('display').display;
