let input = document.querySelector('#base64');
let count = 0;

class Component extends karas.Component {
  componentDidMount() {
    let self = this;
    function cb() {
      input.value = ++count;
      if(count > 2) {
        self.ref.span.removeFrameAnimate(cb);
      }
    }
    self.ref.span.frameAnimate(cb);
  }

  render() {
    if(this.state.a) {
      return <div><span ref="span">1</span></div>
    }
    return <div><span ref="span">0</span></div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component ref="c"/>
  </svg>,
  '#test'
);

o.ref.c.setState({ a: 1 });
