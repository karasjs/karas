let input = document.querySelector('input');
class Component extends karas.Component {
  componentWillUnmount() {
    input.value += 'componentWillUnmount';
  }
  render() {
    return <div>2</div>;
  }
}
let root = karas.render(
  <svg width="360" height="360">
    <div>
      <div>3</div>
      <Component ref="cp"/>
      <span>4</span>
    </div>
  </svg>,
  '#test'
);
root.ref.cp.remove(function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
