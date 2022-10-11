let o = karas.render(
  <svg width="360" height="360">
    <$line style={{width:100,height:100}}/>
    <$line style={{width:100,height:100}} controlA={[0.2, 0.5]} controlB={[0.8, 0.5]}/>
    <$line style={{width:100,height:100,stroke:'#F00'}}/>
    <$line style={{width:100,height:100}} xa={0.4} ya={0.4} xb={0.5} yb={0.5}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
