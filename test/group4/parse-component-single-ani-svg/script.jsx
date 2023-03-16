class Component extends karas.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>123</div>;
  }
}

karas.Component.register('Component', Component);

let o = karas.render(
  <svg width={360} height={360}>
    {
      karas.parse(
        {
          tagName: 'Component',
          props: {},
          animate: {
            value: [
              {
                color: '#F00',
              },
              {
                color: '#00F',
              }
            ],
            options: {
              duration: 200,
              fill: 'both',
            },
          },
        }
      )
    }
  </svg>,
  '#test'
);

o.children[0].animationList[0].on(karas.Event.FINISH, () => {
  let svg = document.querySelector('svg');
  let input = document.querySelector('input');
  input.value = svg.innerHTML;
});
