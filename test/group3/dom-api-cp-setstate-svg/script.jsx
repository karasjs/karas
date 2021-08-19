class Component extends karas.Component {
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
let root = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);
root.children[0].setState({
  a: 1,
}, function() {
  let div = <div>4</div>;
  root.children[0].appendChild(div, function() {
    let input = document.querySelector('input');
    input.value += document.querySelector('svg').innerHTML;
  });
});
