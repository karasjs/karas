class Component extends karas.Component {
  constructor(props) {
    super(props);
  }
  click() {
    this.updateStyle({
      color: '#F00',
    });
  }
  render() {
    return <div onClick={this.click.bind(this)}>a</div>;
  }
}

let o = karas.render(
  <canvas width="360" height="360">
    <Component/>
  </canvas>,
  '#test'
);

let n = 0;
o.on(karas.Event.REFRESH, function() {
  document.querySelector('input').value = n++;
});
