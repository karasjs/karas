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
      })
    }
  </svg>,
  '#test'
);
let input = document.querySelector('input');
let ac = o.animateController;
input.value = ac.records.length + ',' + ac.list.length;
ac.play();
input.value += '/' + ac.records.length + ',' + ac.list.length;
