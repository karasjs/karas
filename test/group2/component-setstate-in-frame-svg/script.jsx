let input = document.querySelector('#base64');

class Component extends karas.Component {
  constructor(props) {
    super(props);
    let start = this._start = parseInt(props.start) || 0;
    this._end = parseInt(props.end) || 0;
    this._duration = parseInt(props.duration) || 1000;
    this.state = {
      text: start,
    };
    // 时间计数器
    this._count = 0;
    // 每帧触发器
    this.timer = (diff) => {
      if(this._count >= this._duration) {
        karas.animate.frame.offFrame(this.timer);
        this.setState({
          text: this._end,
        }, function() {
          input.value = document.querySelector('svg').innerHTML;
        });
        return;
      }
      let t = this._count += diff;
      t = Math.min(t, this._duration);
      this._count = t;
      let percent = t / this._duration;
      let difference = this._end - this._start;
      let v = Math.floor(this._start + difference * percent);
      v = Math.min(v, this._end);
      this.setState({
        text: v,
      });
    };
  }
  componentDidMount() {
    karas.animate.frame.onFrame(this.timer);
  }
  render() {
    return <div>{this.state.text}</div>;
  }
}

let o = karas.render(
  <svg width="360" height="360">
    <Component start={100} end={999} duration={50} />
  </svg>,
  '#test'
);
