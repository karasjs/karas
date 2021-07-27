class A extends karas.Component{
  render() {
    return <B/>;
  }
}
class B extends karas.Component{
  render() {
    return <C/>;
  }
}
class C extends karas.Component{
  render() {
    return <div>1</div>;
  }
}
let o = karas.render(
  <svg width="360" height="360">
    <A/>
  </svg>,
  '#test'
);
let a = o.children[0];
let input = document.querySelector('#base64');
input.value = a.shadow.tagName + a.shadowRoot.tagName
+ a.shadow.shadow.tagName + a.shadow.shadowRoot.tagName
+ a.shadow.shadow.shadow.tagName + a.shadow.shadow.shadowRoot.tagName
+ a.shadow.shadow.host.tagName + a.shadow.shadow.hostRoot.tagName
+ a.shadow.shadow.shadow.host.tagName + a.shadow.shadow.shadow.hostRoot.tagName;
