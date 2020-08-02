let controller = new karas.Controller();

let o = karas.render(
  <svg width="360" height="360">
    <span ref="t">123</span>
  </svg>,
  '#test'
);
let input = document.querySelector('input');
input.value = controller.records.length + ',' + controller.list.length;
o.ref.t.animate([{
  color: '#f00'
}, {
  color: '#00f'
}], {
  duration: 200,
  fill: 'both',
  controller,
}, true);
input.value += '/' + controller.records.length + ',' + controller.list.length;
