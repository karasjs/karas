let input = document.querySelector('input');
class Component extends karas.Component {
  render() {
    return <div>2</div>;
  }
}
let root = karas.render(
  <svg width="360" height="360">
    <div>
      <Component ref="cp"/>
      <span>1</span>
    </div>
  </svg>,
  '#test'
);
root.children[0].removeChild(root.ref.cp, function() {
  let input = document.querySelector('input');
  input.value += document.querySelector('svg').innerHTML;
});
