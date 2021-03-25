class Component extends karas.Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: {},
    };
  }

  componentDidMount() {
    let hash = this.state.hash;
    hash[0] = 0;
    this.setState({
      hash,
    });
    hash[1] = 1;
    this.setState({
      hash,
    }, () => {
      let input = document.querySelector('#base64');
      input.value = JSON.stringify(o.virtualDom);
    });
  }

  render() {
    return <div>
      {
        Object.keys(this.state.hash).map(id => {
          return <span ref={id}
                       key={id}
                       style={{
                         display:'inlineBlock',
                         width: 32,
                         height: 32,
                         background: id === '0' ? '#F00' : '#00F',
                       }}/>;
        })
      }
    </div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component/>
  </svg>,
  '#test'
);
