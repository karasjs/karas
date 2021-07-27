let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

class Component extends karas.Component {
  constructor(...data) {
    super(...data);
  }

  render() {
    return <span onClick={()=>{this.emit('custom')}}>123</span>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <div style={{width:100,height:100,background:'#F00'}}>
      <Component on-custom={()=>{cb(count++)}}/>
    </div>
  </canvas>,
  '#test'
);
