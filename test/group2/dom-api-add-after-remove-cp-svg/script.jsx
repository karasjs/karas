class Component extends karas.Component {
  render() {
    return <div>{this.props.t || 0}</div>;
  }
}
let root = karas.render(
  <svg width="360" height="360">
    <Component/>
    <Component t={1}/>
  </svg>,
  '#test'
);
root.children[1].remove();
root.appendChild(<Component t={2}/>, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
