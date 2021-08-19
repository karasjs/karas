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
    <Component2/>
    <div>1</div>
  </svg>,
  '#test'
);
root.children[0].remove(function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
