let n = 0;

class Component extends karas.Component {
  constructor(...data) {
    super(...data);
    this.state = {
      text: 123,
    };
  }
  click() {
    this.setState({
      text: 1,
    });
    this.setState({
      text: 2,
    });
    this.setState({
      text: 3,
    });
  }
  render() {
    return <div onClick={this.click.bind(this)}>{this.state.text}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);

o.on(karas.Event.REFRESH, function() {
  n++;
  document.querySelector('input').value = n;
});
