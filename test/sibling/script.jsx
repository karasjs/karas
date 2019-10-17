let o = karas.render(
  <canvas width="360" height="360">
    <div>a</div>
    <div>b</div>
  </canvas>,
  '#test'
);

let [a, b] = o.children;

document.querySelector('input').value = a.prev + ',' + (a.next === b) + ',' + (a === b.prev) + ',' + b.next;
