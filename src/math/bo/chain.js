// 新线段添加到某个链上后，要先检查是否能合其它链连起来，再检查闭合情况
function join(res, chains, chain, index, pt, isHead) {
  for(let i = 0, len = chains.length; i < len; i++) {
    let item = chains[i];
    if(item !== chain) {
      let l = item.length;
      let head = item[0], tail = item[l - 1];
      let ptHead = head.coords[0];
      let coords = tail.coords, l2 = coords.length;
      let ptTail = coords[l2 - 1];
      if(pt.equal(ptHead)) {
        if(isHead) {
          item = reverse(chain).concat(item);
          chains[i] = item;
          chains.splice(index, 1);
          return close(res, chains, item, i);
        }
        else {
          item = chain.concat(item);
          chains[i] = item;
          chains.splice(index, 1);
          return close(res, chains, item, i);
        }
      }
      else if(pt.equal(ptTail)) {
        if(isHead) {
          item = item.concat(chain);
          chains[i] = item;
          chains.splice(index, 1);
          return close(res, chains, item, i);
        }
        else {
          item = item.concat(reverse(chain));
          chains[i] = item;
          chains.splice(index, 1);
          return close(res, chains, item, i);
        }
      }
    }
  }
  // 无法和别的链接，也要检查自身闭合
  close(res, chains, chain, index);
}

function close(res, chains, chain, index) {
  let l = chain.length;
  let head = chain[0], tail = chain[l - 1];
  let ptHead = head.coords[0];
  let coords2 = tail.coords, l2 = coords2.length;
  let ptTail = coords2[l2 - 1];
  if(ptHead.equal(ptTail)) {
    chains.splice(index, 1);
    // 结果要保证原先多边形的线段起始顺序，根据第一个判断即可，
    // 全部都是a多边形或全都是b多边形的话，正确的回路一定是全部线段一致的，都正或都反
    // 2个都有情况则无论正反绘制都可以
    // if(chain[0].isReversed) {
    //   reverse(chain);
    // }
    res.push(chain);
  }
}

// 整条链颠倒，包含每个线段自身颠倒
function reverse(chain) {
  chain.forEach(item => item.reverse());
  return chain.reverse();
}

export default function(list) {
  let chains = [], res = [];
  outer:
  while(list.length) {
    let seg = list.shift(), coords = seg.coords, len = coords.length;
    let start = coords[0], end = coords[len - 1];
    // 尝试追加到某条链中，互相头尾链接可能有4种情况，其中2种会reverse线段首尾
    for(let i = 0, len = chains.length; i < len; i++) {
      let chain = chains[i], l = chain.length;
      let head = chain[0], tail = chain[l - 1];
      let ptHead = head.coords[0];
      let coords2 = tail.coords, l2 = coords2.length;
      let ptTail = coords2[l2 - 1];
      if(start.equal(ptTail)) {
        chain.push(seg);
        join(res, chains, chain, i, end, false);
        continue outer;
      }
      else if(start.equal(ptHead)) {
        seg.reverse();
        chain.unshift(seg);
        join(res, chains, chain, i, end, true);
        continue outer;
      }
      else if(end.equal(ptTail)) {
        seg.reverse();
        chain.push(seg);
        join(res, chains, chain, i, start, false);
        continue outer;
      }
      else if(end.equal(ptHead)) {
        chain.unshift(seg);
        join(res, chains, chain, i, start, true);
        continue outer;
      }
    }
    // 找不到则生成新链
    chains.push([seg]);
  }
  return res.map(item => {
    let list = item.map(seg => {
      let coords = seg.coords, len = coords.length;
      if(len === 2) {
        return [coords[1].x, coords[1].y];
      }
      else if(len === 3) {
        return [coords[1].x, coords[1].y, coords[2].x, coords[2].y];
      }
      else if(len === 4) {
        return [coords[1].x, coords[1].y, coords[2].x, coords[2].y, coords[3].x, coords[3].y];
      }
    });
    // 首个顶点重合
    let first = item[0], coords = first.coords;
    list.unshift([coords[0].x, coords[0].y]);
    return list;
  });
}
