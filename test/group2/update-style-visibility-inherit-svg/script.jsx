class Component extends karas.Component {
  componentDidMount() {
    this.updateStyle({
      visibility: 'visible',
    });
    this.ref.player.updateStyle({
      opacity: 0.5,
    }, () => {
      let input = document.querySelector('#base64');
      input.value = JSON.stringify(o.virtualDom);
    });
  }
  render() {
    return <div style={{
      position: 'absolute',
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      background: '#F00',
      visibility: 'hidden',
    }}>
      <p ref="player"
         style={{
           position: 'absolute',
           left: 0,
           top: 0,
           width: 50,
           height: 50,
           background: '#00F',
         }}>
          <span ref="tank"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 20,
                  height: 20,
                  background: `#0F0`,
                }}/>
      </p>
    </div>
  }
}

let o = karas.render(
  <svg width={360} height={360}>
    <Component/>
  </svg>,
  '#test'
);
