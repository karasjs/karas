class Component extends karas.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'please click component',
    };
  }
  // 同样需实现render()返回
  render() {
    return <div>{this.state.text}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="t"/>
  </svg>,
  '#test'
);

let t = o.ref.t;
t.setState({
  text: 'has clicked',
}, () => {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;

});
