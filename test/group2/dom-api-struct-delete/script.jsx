class Component extends karas.Component {
  render() {
    return <p style={{
      width:100,height:100,background:'#00F'
    }}>4</p>;
  }
}

let root = karas.render(
  <canvas width="360" height="360">
    <span ref="span1">1</span>
    <div ref="div">3</div>
    <span ref="span2">2</span>
    <Component ref="cp"/>
  </canvas>,
  '#test'
);
root.ref.div.remove();
root.ref.cp.remove(function() {
  let input = document.querySelector('input');
  input.value = JSON.stringify(root.__structs.map(item => {
    item.node = item.node.tagName || 'text';
    return item;
  }));
});
