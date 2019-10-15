let count = 0;

function cb(v) {
  document.getElementById('base64').value = v;
}

class Component extends karas.Component {
  constructor(...data) {
    super('cp', ...data);
  }

  render() {
    return <div onClick={()=>{cb(count++)}}>123</div>;
  }
}

karas.render(
  <canvas width="360" height="360">
    <div style={{width:100,height:100,background:'#F00'}}>
      <Component onClick={()=>{cb(count++)}}/>
    </div>
  </canvas>,
  '#test'
);
