class Fg extends karas.Component {
  render() {
    let { i } = this.props;
    let transform = [
      'scaleY(0.9) translateY(5%)',
      'scaleY(0.8) translateY(10%)',
      'scaleY(0.7) translateY(15%)',
      'scaleY(0.72) translateY(13%)',
      'scaleY(0.73) translateY(10%)',
      'scaleY(0.74) translateY(6%)',
      'translateX(-4%) scaleX(0.9) scaleY(0.745) translateY(1%) rotate(-0.5deg)',
      'translateX(-9%) scaleX(0.8) scaleY(0.75) translateY(-3%) rotate(-1.1deg)',
      'translateX(-15%) scaleX(0.7) scaleY(0.754) translateY(-6%) rotate(-1.7deg)',
      'translateX(-19%) scaleX(0.6) scaleY(0.757) translateY(-8%) rotate(-2.1deg)',
      'translateX(-22%) scaleX(0.5) scaleY(0.76) translateY(-9%) rotate(-2.4deg)',
      'translateX(-25%) scaleX(0.4) scaleY(0.76) translateY(-9%) rotate(-2.4deg)',
      'translateX(-28%) scaleX(0.3) scaleY(0.757) translateY(-9%) rotate(-2.1deg)',
      'translateX(-29%) scaleX(0.2) scaleY(0.754) translateY(-6%) rotate(-1.7deg)',
      'translateX(-30%) scaleX(0.1) scaleY(0.75) translateY(-3%) rotate(-1.1deg)',
      'translateX(-30%) scaleX(0.1) scaleY(0.745) translateY(1%) rotate(-0.5deg)',
      'scale(0)',
      'scale(0)',
      'scale(0)',
      'scale(0)',
      'scale(0)',
      'scale(0)',
      'scale(0.3)',
      'scale(0.6)',
      'scale(0.8)',
      'scale(0.9)'
    ];
    let begin = 0;
    if(i > 35) {
      begin = 360 - (i - 35) * 10;
    }
    else if(i > 20) {
      begin = 360;
    }
    begin = Math.max(begin, 90);
    return (
      <div>
        <$sector
          r="0.15"
          begin={begin}
          end="360"
          style={{
            position:'absolute',
            left:0,
            top:0,
            width:'100%',
            height:'100%',
            strokeWidth:0,
            fill:'#108ee9',
            transform: transform[0],
          }}
        />
      </div>
    );
  }
}
class Component extends karas.Component {
  constructor(...data) {
    super(...data);
    this.state = {
      i: 0,
    };
    setTimeout(() => this.frame(), 1);
  }
  frame() {
    let { i } = this.state;
    i++;
    if(i > 80) {
      i = 0;
    }
    this.setState({
      i,
    });
  }
  render() {
    let { i } = this.state;
    return <div>
      <Fg i={i}
          style={{
            position:'absolute',
            left:0,
            top:'4%',
            width:'100%',
            height:'100%'
          }}
      />
    </div>;
  }
}
let o = karas.render(
  <svg width="360" height="360">
    <Component style={{width:50,height:50}}/>
  </svg>,
  '#test'
);
setTimeout(function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
}, 5);
