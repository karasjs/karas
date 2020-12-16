let o = karas.render(
  <svg width="360" height="360">
    <$sector end="290" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="290" edge="true" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="290" edge="true" closure="true" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="290" closure="true" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="90" style={{margin:2,width:50,height:50,fill:'#F00'}}/>
    <$sector end="70" closure={1} style={{position:'absolute',left:100,top:10,width:100,height:100,fill:'#F00'}}/>
    <$sector end="150" closure={1} style={{position:'absolute',left:100,top:110,width:100,height:100,fill:'#F00'}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
