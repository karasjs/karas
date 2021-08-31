let o = karas.parse({
  tagName: 'svg',
  props: {
    width: 360,
    height: 360,
  },
  children: [
    {
      tagName: 'div',
      props: {
        style: {
          width: 100,
          height: 100,
          backgroundColor: '#F00',
          vars: [
            {
              id: 'a',
              member: ['backgroundColor']
            }
          ]
        }
      },
      children: [
        'text',
        {
          libraryId: 0
        }
      ],
      vars: [
        {
          id: 'b',
          member: ['children', 0]
        }
      ]
    }
  ],
  library: [
    {
      id: 0,
      tagName: 'span',
      props: {
        color: '#999',
      },
      children: ['a']
    }
  ],
  vars: {
    id: 'd',
    member: ['library', 0]
  }
}, '#test', {
  vars: {
    a: '#00F',
    b: 'haha',
    c: '#0F0',
    d: {
      props: {
        style: {
          color: '#999',
          vars: {
            id: 'c',
            member: ['color']
          }
        }
      },
      children: ['b']
    }
  },
});
let input = document.querySelector('input');
input.value = document.querySelector('svg').innerHTML;
