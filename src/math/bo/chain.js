import geom from '../geom';

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
  // 在对方内部的排在前面，这样会优先形成包含情况而不是交叉
  list.sort(function(a, b) {
    if(b.otherFill[0] && b.otherFill[1]) {
      return 1;
    }
    return -1;
  });
  outer:
  while(list.length) {
    let seg = list.shift(), coords = seg.coords, len = coords.length;
    let start = coords[0], end = coords[len - 1];
    let temp;
    // 尝试追加到某条链中，互相头尾链接可能有4种情况，其中2种会reverse线段首尾
    for(let i = 0, len = chains.length; i < len; i++) {
      let chain = chains[i], l = chain.length;
      let head = chain[0], tail = chain[l - 1];
      let ptHead = head.coords[0];
      let coords2 = tail.coords, l2 = coords2.length;
      let ptTail = coords2[l2 - 1];
      if(start.equal(ptTail)) {
        if(seg.belong !== tail.belong) {
          chain.push(seg);
          join(res, chains, chain, i, end, false);
          continue outer;
        }
        else if(!temp) {
          temp = {i, t: 0};
        }
      }
      else if(start.equal(ptHead)) {
        if(seg.belong !== tail.belong) {
          seg.reverse();
          chain.unshift(seg);
          join(res, chains, chain, i, end, true);
          continue outer;
        }
        else if(!temp) {
          temp = {i, t: 1};
        }
      }
      else if(end.equal(ptTail)) {
        if(seg.belong !== tail.belong) {
          seg.reverse();
          chain.push(seg);
          join(res, chains, chain, i, start, false);
          continue outer;
        }
        else if(!temp) {
          temp = {i, t: 2};
        }
      }
      else if(end.equal(ptHead)) {
        if(seg.belong !== tail.belong) {
          chain.unshift(seg);
          join(res, chains, chain, i, start, true);
          continue outer;
        }
        else if(!temp) {
          temp = {i, t: 3};
        }
      }
    }
    // 如果没有优先添加对方的线段形成包含，则到这里检查是否有己方的进行链接
    if(temp) {
      if(temp.t === 0) {
        chains[temp.i].push(seg);
        join(res, chains, chains[temp.i], temp.i, end, false);
      }
      else if(temp.t === 1) {
        seg.reverse();
        chains[temp.i].unshift(seg);
        join(res, chains, chains[temp.i], temp.i, end, true);
      }
      else if(temp.t === 2) {
        seg.reverse();
        chains[temp.i].push(seg);
        join(res, chains, chains[temp.i], temp.i, start, false);
      }
      else if(temp.t === 3) {
        chains[temp.i].unshift(seg);
        join(res, chains, chains[temp.i], temp.i, start, true);
      }
    }
    // 找不到则生成新链
    else {
      chains.push([seg]);
    }
  }
  // 鞋带公式求得每个多边形的时钟序  https://zhuanlan.zhihu.com/p/401010594
  let v = res.map(item => {
    // let isInner = true, isOuter = true;
    let clockwise = true;
    let s = 0, lastX, lastY, minX, minY, maxX, maxY;
    item.forEach((seg, i) => {
      // 内部是指边的两侧都是对方填充说明在内部
      // if(!seg.otherFill[0] || !seg.otherFill[1]) {
      //   isInner = false;
      // }
      // // 外部是指边的一侧为空
      // if(!seg.myFill[0] && !seg.otherFill[0] || !seg.myFill[1] && !seg.otherFill[1]) {}
      // else {
      //   isOuter = false;
      // }
      let coords = seg.coords, len = coords.length, bbox = seg.bbox;
      if(i) {
        minX = Math.min(minX, bbox[0]);
        minY = Math.min(minY, bbox[1]);
        maxX = Math.max(maxX, bbox[2]);
        maxY = Math.max(maxY, bbox[3]);
      }
      else {
        minX = bbox[0];
        minY = bbox[1];
        maxX = bbox[2];
        maxY = bbox[3];
      }
      if(len === 2) {
        if(i) {
          s += lastX * coords[1].y - lastY * coords[1].x;
        }
        else {
          s += coords[0].x * coords[1].y - coords[0].y * coords[1].x;
        }
        lastX = coords[1].x;
        lastY = coords[1].y;
      }
      else if(len === 3) {
        if(i) {
          s += lastX * coords[2].y - lastY * coords[2].x;
        }
        else {
          s += coords[0].x * coords[1].y - coords[0].y * coords[2].x;
        }
        lastX = coords[2].x;
        lastY = coords[2].y;
      }
      else if(len === 4) {
        if(i) {
          s += lastX * coords[3].y - lastY * coords[3].x;
        }
        else {
          s += coords[0].x * coords[3].y - coords[0].y * coords[3].x;
        }
        lastX = coords[3].x;
        lastY = coords[3].y;
      }
    });
    // 首个顶点重合
    let first = item[0], coords = first.coords;
    s += lastX * coords[0].y - lastY * coords[0].x;
    if(s < 0) {
      clockwise = false;
    }
    return {
      // isInner,
      // isOuter,
      list: item,
      clockwise,
      bbox: [minX, minY, maxX, maxY],
      area: (maxX - minX) * (maxY - minY),
    };
  });
  v.forEach(item => {
    if(item.checked) {
      return;
    }
    let bbox = item.bbox;
    let list = [item];
    for(let i = 0, len = v.length; i < len; i++) {
      let item2 = v[i];
      if(item2 !== item) {
        // 互相包含则存入列表
        if(geom.isRectsInside(bbox, item2.bbox) || geom.isRectsInside(item2.bbox, bbox)) {
          list.push(item2);
        }
      }
    }
    // 按面积排序，最小的即最里面的在前面
    if(list.length > 1) {
      list.sort(function(a, b) {
        return a.area - b.area;
      });
      // 可能存在已经排过序的，例如外围a包含了内部的b和c，b和c互不相交，a和b已经调整过排序了，a和c再调整则a已经checked
      for(let i = 1, len = list.length;i < len; i++) {
        let item = list[i];
        if(item.checked) {
          let clockwise = item.clockwise;
          for(let j = i - 1; j >= 0; j--) {
            let item2 = list[j];
            item2.checked = true;
            if(item2.clockwise === clockwise) {
              reverse(item2.list);
              item2.clockwise = !clockwise;
            }
            clockwise = !clockwise;
          }
          clockwise = item.clockwise;
          for(let j = i + 1; j < len; j++) {
            let item2 = list[j];
            item2.checked = true;
            if(item2.clockwise === clockwise) {
              reverse(item2.list);
              item2.clockwise = !clockwise;
            }
            clockwise = !clockwise;
          }
          return;
        }
      }
      // 新的依次时钟序互相颠倒
      let clockwise = list[0].clockwise;
      list[0].checked = true;
      for(let i = 1, len = list.length;i < len; i++) {
        let item = list[i];
        item.checked = true;
        if(item.clockwise === clockwise) {
          reverse(item.list);
          item.clockwise = !clockwise;
        }
        clockwise = !clockwise;
      }
    }
  });
  return v.map(item => {
    let list = item.list.map(seg => {
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
    let first = item.list[0], coords = first.coords;
    list.unshift([coords[0].x, coords[0].y]);
    return list;
  });
}
