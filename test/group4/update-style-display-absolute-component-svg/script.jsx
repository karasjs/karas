class Component extends karas.Component {
  render() {
    return <div style={{top:100,display:'none',position:'absolute'}}>
      <span>123</span>
    </div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="div"/>
    <p>2</p>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.ref.div.updateStyle({
  display: 'block',
}, function() {
  input.value = JSON.stringify(o.virtualDom);
});
