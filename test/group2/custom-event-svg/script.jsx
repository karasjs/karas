class Father extends karas.Component{
  constructor(props) {
    super(props);
    setTimeout(() => {
      this.emit('sb', 'a');
    },50);
  }
  render() {
    return <Child/>;
  }
}
class Child extends karas.Component{
  render() {
    return <span>1</span>;
  }
}

let o = karas.render(
  <svg width={360} height={360}>
    <Father on-sb={function(p){
      let input = document.querySelector('input');
      input.value = p;
    }}/>
  </svg>,
  '#test'
);
