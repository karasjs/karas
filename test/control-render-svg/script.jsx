let controller = new karas.Controller();

let o = karas.render(
  <svg width="360" height="360">
    {
      karas.parse({
        tagName: 'span',
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
        children: [123]
      }, {
        controller,
      })
    }
  </svg>,
  '#test'
);
let input = document.querySelector('input');
input.value = controller.records.length + ',' + controller.list.length;
controller.play();
input.value += '/' + controller.records.length + ',' + controller.list.length;
