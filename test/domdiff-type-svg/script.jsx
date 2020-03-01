let input = document.querySelector('#base64');
input.value = 'correct';

function render(v) {
  let o = karas.render(
    <svg width="360" height="360">
      {v}
    </svg>,
    '#test'
  );
}

window.onerror = function() {
  input.value = 'wrong';
};

render(<$rect style={{width:100,height:100}}/>);
render(<div><$rect style={{width:100,height:100}}/></div>);
render(<$rect style={{width:100,height:100}}/>);
render(<div><$rect style={{width:100,height:100}}/></div>);
