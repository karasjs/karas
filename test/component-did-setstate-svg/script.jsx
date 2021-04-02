let input = document.querySelector('#base64');

class Component extends karas.Component {
  componentDidMount() {
    this.setState({
      text: `bc`,
    });
  }
  componentDidUpdate() {
    input.value += document.querySelector('svg').innerHTML;
    this.setState({
      text: `def`,
    });
  }

  render() {
    return <span>{this.state.text || 'a'}</span>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);
