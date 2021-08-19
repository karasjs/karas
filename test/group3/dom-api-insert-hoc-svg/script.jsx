class Component extends karas.Component {
  render() {
    return <div style={{background:'#F00'}}>
      <span>2</span>
    </div>;
  }
}
class Component2 extends karas.Component {
  render() {
    return <Component/>;
  }
}
let root = karas.render(
  <svg width="360" height="360">
    <div>1</div>
  </svg>,
  '#test'
);
let cp = <Component2/>;
root.children[0].insertBefore(cp, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
