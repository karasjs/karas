class Component extends karas.Component {
  render() {
    return <div style={{background:'#F00'}}>
      <span>2</span>
    </div>;
  }
}
let root = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);
let div = <div>3</div>;
root.children[0].insertBefore(div, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
