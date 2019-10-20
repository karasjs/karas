let n = 0;

class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
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
    this.setState({
      text: 4,
    });
    this.setState({
      text: 5,
    });
  }
  render() {
    return <div onClick={this.click.bind(this)}>{this.state.text}</div>;
  }
}

karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);

document.body.addEventListener('DOMSubtreeModified', function() {
  n++;
  document.querySelector('input').value = n;
});
