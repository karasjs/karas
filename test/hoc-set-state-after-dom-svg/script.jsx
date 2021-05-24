class A extends karas.Component {
  render() {
    return <Component/>;
  }
}

class Component extends karas.Component {
  componentDidMount(){
    this.setState({
      a: 1
    }, function() {
      var input = document.querySelector('#base64');
      input.value = document.querySelector('svg').innerHTML;
    });
  }

  render() {
    return <div style={{width:100,height:20,background:'#F00'}}/>;
  }
}
let o = karas.render(
  <svg width="360" height="360" cache="1">
    <div style={{width:50,height:20,background:'#000'}}/>
    <A/>
  </svg>,
  '#test'
);
