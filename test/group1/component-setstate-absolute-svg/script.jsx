class Component extends karas.Component {
  constructor(...data) {
    super(...data);
    this.state = {
      left: 0,
    };
  }
  render() {
    return <div style={{
      position: 'absolute',
      left: this.state.left,
      top: 0,
      width: 100,
      height: 100,
      background: '#F00',
    }}/>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="c"/>
  </svg>,
  '#test'
);

o.ref.c.setState({
  left: 100,
}, function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
