class Component extends karas.Component {
  render() {
    if(this.state.a) {
      return <div>2</div>;
    }
    return 'h';
  }
}

let root = karas.render(
  <svg width="360" height="360"><Component/></svg>,
  '#test'
);

root.children[0].setState({ a: 1 }, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
