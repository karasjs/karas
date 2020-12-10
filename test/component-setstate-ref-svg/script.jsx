class Component extends karas.Component {
  componentDidMount() {
    this.setState({
      a: 1,
    }, () => {
      setTimeout(() => {
        let input = document.querySelector('#base64');
        input.value = this.ref.div.tagName;
      }, 20);
    });
  }
  render() {
    if(this.state.a === 1) {
      return <span ref="div">456</span>
    }
    return <div ref="div">123</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);
