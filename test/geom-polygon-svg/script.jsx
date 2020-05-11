let o = karas.render(
  <svg width="360" height="360">
    <$polygon points={[
      [0, 0],
      [1, 0.3],
      [0.5, 1]
    ]} style={{width:100,height:100}}/>
    <$polygon points={[
      [0, 0],
      [1, 0.3],
      [0.5, 1]
    ]} controls={[
      [0.5, 0],
      [1, 0.5, 0.8, 0.9],
      [0, 0.5]
    ]} style={{width:100,height:100}}/>
    <$polygon points={[
      [0, 0],
      [1, 0.3],
      [0.5, 1]
    ]} controls={[
      [0.5, 0],
      [1, 0.5, 0.8, 0.9],
      [0, 0.5]
    ]} style={{width:100,height:100,stroke:'#F00',fill:'#00F'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
