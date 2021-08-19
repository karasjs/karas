class Component extends karas.Component {
  render() {
    return <span>a</span>;
  }
}

let a = <Component/>;

class Component2 extends karas.Component {
  constructor(props) {
    super(props);
    this.state.list = [0];
  }
  componentDidMount() {
    this.setState({
      list: [1]
    }, function() {
      karas.render(
        <canvas width="360" height="360">
          {b}
        </canvas>,
        '#test'
      );
      let input = document.querySelector('#base64');
      input.value = document.querySelector('canvas').toDataURL();
    });
  }
  render() {
    return <div>
      {a}
      {
        this.state.list.map(item => item)
      }
    </div>
  }
}

let b = <Component2/>;

karas.render(
  <canvas width="360" height="360">
    {b}
  </canvas>,
  '#test'
);
