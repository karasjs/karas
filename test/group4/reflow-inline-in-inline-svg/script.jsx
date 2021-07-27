let o = karas.render(
  <svg width="360" height="360">
    <div>
      <span>
        <strong ref="strong">a</strong>
      </span>
    </div>
  </svg>,
  '#test'
);

o.ref.strong.updateStyle({
  fontWeight: 200,
}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
