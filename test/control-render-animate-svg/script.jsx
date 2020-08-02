let o = karas.render(
  <svg width="360" height="360">
    <span ref="t">123</span>
  </svg>,
  '#test'
);
let input = document.querySelector('input');
let ac = o.animateController;
input.value = ac.records.length + ',' + ac.list.length;
o.ref.t.animate([{
  color: '#f00'
}, {
  color: '#00f'
}], {
  duration: 200,
  fill: 'both',
}, true);
input.value += '/' + ac.records.length + ',' + ac.list.length;
