class Component extends karas.Component {
  constructor(...data) {
    super(...data);
    this.state = {
      text: '123',
    };
  }
  click() {
    this.setState({
      text: this.ref.test.tagName,
    }, function() {
      let canvas = document.querySelector('canvas');
      let input = document.querySelector('#base64');
      input.value = canvas.toDataURL();
    });
  }
  render() {
    return <div ref="test" onClick={()=>this.click()}>{this.state.text}</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);
