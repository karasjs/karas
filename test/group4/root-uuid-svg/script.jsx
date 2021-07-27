karas.render(
  <svg width="360" height="360" style={{background:'linear-gradient(#F00,#00F)'}}/>,
  '#test'
);
karas.render(
  <svg width="360" height="360" style={{background:'linear-gradient(#F00,#00F)'}}/>,
  '#test'
);
let o = karas.render(
  <svg width="360" height="360" style={{background:'linear-gradient(#F00,#00F)'}}/>,
  '#test2'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
