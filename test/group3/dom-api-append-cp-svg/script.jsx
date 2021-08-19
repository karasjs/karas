let root = karas.render(
  <svg width="360" height="360">
    <div>1</div>
  </svg>,
  '#test'
);
let input = document.querySelector('input');
class Component extends karas.Component {
  componentDidMount() {
    input.value += 'componentDidMount';
  }
  render() {
    if(this.state.a) {
      return <div>
        <span>2</span>
        <span>3</span>
      </div>;
    }
    return <div>
      <span>2</span>
    </div>;
  }
}
let cp = <Component/>;
root.appendChild(cp, function() {
  input.value += ',' + document.querySelector('svg').innerHTML;
  root.children[1].setState({
    a: 1,
  }, function() {
    input.value += ',' + document.querySelector('svg').innerHTML;
  });
});
