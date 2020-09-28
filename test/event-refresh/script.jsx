class Component extends karas.Component {
  constructor(props) {
    super(props);
    this.state.a = 0;
  }
  click() {
    this.setState({
      a: 1,
    });
  }
  render() {
    return <div onClick={this.click.bind(this)}>{this.state.a}</div>;
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
