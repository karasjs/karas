class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
  }
  render() {
    return <div>123</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component style={{color:'#F00'}}/>
    <div style={{color:'#00F'}}>
      <Component/>
    </div>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
