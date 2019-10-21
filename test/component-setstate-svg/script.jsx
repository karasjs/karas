function r() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
}

class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
    this.state = {
      text: 123,
    };
  }
  render() {
    return <div onClick={() => {this.setState({text:456}, r)}}>{this.state.text}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
