let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAYAAAB65WHVAAAN9ElEQVR4Xu3UYWqeZRiE0bfV5Yi4IelSrFsR9yPuR1OpiqKglvyQi3tOoSQEku+eMw/z5vGPAAECBJICb5JXOYoAAQIEHgPtERAgQCAqYKCjxTiLAAECBtobIECAQFTAQEeLcRYBAgQMtDdAgACBqICBjhbjLAIECBhob4AAAQJRAQMdLcZZBAgQMNDeAAECBKICBjpajLMIECBgoL0BAgQIRAUMdLQYZxEgQMBAewMECBCIChjoaDHOIkCAgIH2BggQIBAVMNDRYpxFgAABA+0NECBAICpgoKPFOIsAAQIG2hsgQIBAVMBAR4txFgECBAy0N0CAAIGogIGOFuMsAgQIGGhvgAABAlEBAx0txlkECBAw0N4AAQIEogIGOlqMswgQIGCgvQECBAhEBQx0tBhnESBAwEB7AwQIEIgKGOhoMc4iQICAgfYGCBAgEBUw0NFinEWAAAED7Q0QIEAgKmCgo8U4iwABAgbaGyBAgEBUwEBHi3EWAQIEDLQ3QIAAgaiAgY4W4ywCBAgYaG+AAAECUQEDHS3GWQQIEDDQ3gABAgSiAgY6WoyzCBAgYKC9AQIECEQFDHS0GGcRIEDAQHsDBAgQiAoY6GgxziJAgICB9gYIECAQFTgz0F8+P3zz9nl5Pn9eno9ff/v/0x/f/9PPX/M7//UZnz0/f/Ln//1vvXu+/zb6VpxFgMD/LHBioL94fvzms+fl/cex/XMcP+371/zOp3zG6//uh2+/fr5//z+/Ax9HgEBQwEC/YtQNdPAlO4nAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQQEDbaAPPmuRCNwQMNAG+sZLloLAQYETA/2xl6+eH96/fV6et89Pz29fX57Pf//67z9/ze/822d8+PWz33zy5//1b717vnt/8J2JRIDAKwTODPQrsvsVAgQIpAUMdLoexxEgsCxgoJfbl50AgbSAgU7X4zgCBJYFDPRy+7ITIJAWMNDpehxHgMCygIFebl92AgTSAgY6XY/jCBBYFjDQy+3LToBAWsBAp+txHAECywIGerl92QkQSAsY6HQ9jiNAYFnAQC+3LzsBAmkBA52ux3EECCwLGOjl9mUnQCAtYKDT9TiOAIFlAQO93L7sBAikBQx0uh7HESCwLGCgl9uXnQCBtICBTtfjOAIElgUM9HL7shMgkBYw0Ol6HEeAwLKAgV5uX3YCBNICBjpdj+MIEFgWMNDL7ctOgEBawECn63EcAQLLAgZ6uX3ZCRBICxjodD2OI0BgWcBAL7cvOwECaQEDna7HcQQILAsY6OX2ZSdAIC1goNP1OI4AgWUBA73cvuwECKQFDHS6HscRILAsYKCX25edAIG0gIFO1+M4AgSWBQz0cvuyEyCQFjDQ6XocR4DAsoCBXm5fdgIE0gIGOl2P4wgQWBYw0Mvty06AQFrAQKfrcRwBAssCBnq5fdkJEEgLGOh0PY4jQGBZwEAvty87AQJpAQOdrsdxBAgsCxjo5fZlJ0AgLWCg0/U4jgCBZQEDvdy+7AQIpAUMdLoexxEgsCxgoJfbl50AgbSAgU7X4zgCBJYFDPRy+7ITIJAWMNDpehxHgMCygIFebl92AgTSAgY6XY/jCBBYFjDQy+3LToBAWsBAp+txHAECywIGerl92QkQSAsY6HQ9jiNAYFnAQC+3LzsBAmkBA52ux3EECCwLGOjl9mUnQCAtYKDT9TiOAIFlAQO93L7sBAikBQx0uh7HESCwLGCgl9uXnQCBtICBTtfjOAIElgUM9HL7shMgkBYw0Ol6HEeAwLKAgV5uX3YCBNICBjpdj+MIEFgWMNDL7ctOgEBawECn63EcAQLLAgZ6uX3ZCRBICxjodD2OI0BgWcBAL7cvOwECaQEDna7HcQQILAsY6OX2ZSdAIC1goNP1OI4AgWUBA73cvuwECKQFDHS6HscRILAsYKCX25edAIG0gIFO1+M4AgSWBQz0cvuyEyCQFjDQ6XocR4DAsoCBXm5fdgIE0gIGOl2P4wgQWBYw0Mvty06AQFrAQKfrcRwBAssCBnq5fdkJEEgLGOh0PY4jQGBZwEAvty87AQJpAQOdrsdxBAgsCxjo5fZlJ0AgLWCg0/U4jgCBZQEDvdy+7AQIpAUMdLoexxEgsCxgoJfbl50AgbSAgU7X4zgCBJYFDPRy+7ITIJAWMNDpehxHgMCygIFebl92AgTSAgY6XY/jCBBYFjDQy+3LToBAWsBAp+txHAECywIGerl92QkQSAsY6HQ9jiNAYFnAQC+3LzsBAmkBA52ux3EECCwLGOjl9mUnQCAtYKDT9TiOAIFlAQO93L7sBAikBQx0uh7HESCwLGCgl9uXnQCBtICBTtfjOAIElgUM9HL7shMgkBYw0Ol6HEeAwLKAgV5uX3YCBNICBjpdj+MIEFgWMNDL7ctOgEBawECn63EcAQLLAgZ6uX3ZCRBICxjodD2OI0BgWcBAL7cvOwECaQEDna7HcQQILAsY6OX2ZSdAIC1goNP1OI4AgWUBA73cvuwECKQFDHS6HscRILAsYKCX25edAIG0gIFO1+M4AgSWBQz0cvuyEyCQFjDQ6XocR4DAsoCBXm5fdgIE0gIGOl2P4wgQWBYw0Mvty06AQFrAQKfrcRwBAssCBnq5fdkJEEgLGOh0PY4jQGBZwEAvty87AQJpAQOdrsdxBAgsCxjo5fZlJ0AgLWCg0/U4jgCBZQEDvdy+7AQIpAUMdLoexxEgsCxgoJfbl50AgbSAgU7X4zgCBJYFDPRy+7ITIJAWMNDpehxHgMCygIFebl92AgTSAgY6XY/jCBBYFjDQy+3LToBAWsBAp+txHAECywIGerl92QkQSAsY6HQ9jiNAYFnAQC+3LzsBAmkBA52ux3EECCwLGOjl9mUnQCAtYKDT9TiOAIFlAQO93L7sBAikBQx0uh7HESCwLGCgl9uXnQCBtICBTtfjOAIElgUM9HL7shMgkBYw0Ol6HEeAwLKAgV5uX3YCBNICBjpdj+MIEFgWMNDL7ctOgEBawECn63EcAQLLAgZ6uX3ZCRBICxjodD2OI0BgWcBAL7cvOwECaQEDna7HcQQILAsY6OX2ZSdAIC1goNP1OI4AgWUBA73cvuwECKQFDHS6HscRILAsYKCX25edAIG0gIFO1+M4AgSWBQz0cvuyEyCQFjDQ6XocR4DAsoCBXm5fdgIE0gIGOl2P4wgQWBYw0Mvty06AQFrAQKfrcRwBAssCBnq5fdkJEEgLGOh0PY4jQGBZwEAvty87AQJpAQOdrsdxBAgsCxjo5fZlJ0AgLWCg0/U4jgCBZQEDvdy+7AQIpAUMdLoexxEgsCxgoJfbl50AgbSAgU7X4zgCBJYFDPRy+7ITIJAWMNDpehxHgMCygIFebl92AgTSAgY6XY/jCBBYFjDQy+3LToBAWsBAp+txHAECywIGerl92QkQSAsY6HQ9jiNAYFnAQC+3LzsBAmkBA52ux3EECCwLGOjl9mUnQCAtYKDT9TiOAIFlAQO93L7sBAikBQx0uh7HESCwLGCgl9uXnQCBtICBTtfjOAIElgUM9HL7shMgkBYw0Ol6HEeAwLKAgV5uX3YCBNICBjpdj+MIEFgWMNDL7ctOgEBawECn63EcAQLLAgZ6uX3ZCRBICxjodD2OI0BgWcBAL7cvOwECaQEDna7HcQQILAsY6OX2ZSdAIC1goNP1OI4AgWUBA73cvuwECKQFDHS6HscRILAsYKCX25edAIG0gIFO1+M4AgSWBQz0cvuyEyCQFjDQ6XocR4DAsoCBXm5fdgIE0gIGOl2P4wgQWBYw0Mvty06AQFrAQKfrcRwBAssCBnq5fdkJEEgLGOh0PY4jQGBZwEAvty87AQJpAQOdrsdxBAgsCxjo5fZlJ0AgLWCg0/U4jgCBZQEDvdy+7AQIpAUMdLoexxEgsCxgoJfbl50AgbSAgU7X4zgCBJYFDPRy+7ITIJAWMNDpehxHgMCygIFebl92AgTSAgY6XY/jCBBYFjDQy+3LToBAWuAXhdROLFor0n0AAAAASUVORK5CYII=')
      .end();
  }
};
