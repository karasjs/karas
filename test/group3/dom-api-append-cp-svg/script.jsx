let root = karas.render(
  <svg width="360" height="360">
    <span>1</span>
  </svg>,
  '#test'
);
let input = document.querySelector('input');
class Component extends karas.Component {
  componentDidMount() {
    input.value += 'componentDidMount';
  }
  render() {
    return <div>2</div>
  }
}
let div = <Component/>;
root.appendChild(div, function() {
  input.value += document.querySelector('svg').innerHTML;
});
