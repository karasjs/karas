import Polyline from './Polyline';
import util from '../../util/util';
import bezier from '../../math/bezier';
import { union, diff, intersection, xor } from '../../math/martinez';

// 根据曲线长度将其分割为细小的曲线段，每个曲线段可近似认为是直线段，从而参与布尔运算
function convertCurve2Line(poly) {
  for(let len = poly.length, i = len - 1; i >= 0; i--) {
    let cur = poly[i], len2 = cur.length;
    if(len2 === 4 || len2 === 6) {
      let last = poly[(i || len) - 1];
      let len3 = last.length;
      let lastX = last[len3 - 2], lastY = last[len3 - 1];
      let coords = [
        [lastX, lastY],
        [cur[0], cur[1]],
        [cur[2], cur[3]],
      ];
      if(cur.length === 6) {
        coords.push([cur[4], cur[5]]);
      }
      let l = bezier.bezierLength(coords);
      // 每2个px长度分割
      let n = Math.ceil(l * 0.5);
      // <2px直接返回直线段
      if(n === 1) {
        cur.splice(0, len2 - 2);
      }
      else {
        // n段每段t为per
        let per = 1 / n;
        for(let j = 0; j < n - 1; j++) {
          let c = bezier.sliceBezier2Both(coords, per * j, per * (j + 1));
          if(len2 === 4) {
            poly.splice(i + j, 0, [c[2][0], c[2][1]]);
          }
          else {
            poly.splice(i + j, 0, [c[3][0], c[3][1]]);
          }
        }
        // 原本的曲线直接改数据为最后一段截取的
        cur.splice(0, len2 - 2);
      }
    }
  }
}

class Polygon extends Polyline {
  constructor(tagName, props) {
    super(tagName, props);
    if(props.booleanOperations) {
      this.__booleanOperations = props.booleanOperations;
    }
  }

  __getPoints(originX, originY, width, height, points, isControl) {
    let res = super.__getPoints(originX, originY, width, height, points, isControl);
    if(!isControl) {
      res.push(res[0]);
    }
    return res;
  }

  // 布尔运算覆盖，仅multi才发生，因为需要多个多边形数据
  __reprocessing(list, isMulti) {
    if(!isMulti || list.length < 2) {
      return list;
    }
    let bo = this.booleanOperations, len = list.length;
    if(!Array.isArray(bo) && bo) {
      let old = bo;
      bo = [bo];
      for(let i = 1; i < len - 1; i++) {
        bo.push(old);
      }
    }
    if(Array.isArray(bo) && bo.length) {
      list.forEach(poly => {
        if(poly && poly.length > 1) {
          convertCurve2Line(poly);
        }
        else {
          poly.splice(0);
        }
      });
      // 输出结果，依旧是前面的每个多边形都和新的进行布尔运算
      let res = [];
      if(list[0] && list[0].length > 1) {
        res.push(list[0]);
      }
      for(let i = 1; i < len; i++) {
        let op = (bo[i - 1] || '').toString().toLowerCase();
        let cur = list[i];
        if(!cur) {
          continue;
        }
        if(['intersection', 'union', 'diff', 'xor'].indexOf(op) === -1 || !res.length) {
          res.push(cur);
          continue;
        }
        switch(op) {
          case 'intersection':
            let r1 = intersection(res, [cur]);
            if(r1) {
              r1.forEach(item => {
                res = item;
              });
            }
            else {
              res = [];
            }
            break;
          case 'union':
            let r2 = union(res, [cur]);
            if(r2) {
              r2.forEach(item => {
                res = item;
              });
            }
            else {
              res = [];
            }
            break;
          case 'diff':
            let r3 = diff(res, [cur]);
            if(r3) {
              r3.forEach(item => {
                res = item;
              });
            }
            else {
              res = [];
            }
            break;
          case 'xor':
            let r4 = xor(res, [cur]);
            if(r4) {
              r4.forEach(item => {
                res = item;
              });
            }
            else {
              res = [];
            }
            break;
        }
      }
      return res;
    }
    return list;
  }

  // 覆盖，当booleanOperations动画改变时刷新顶点缓存
  __needRebuildSE(__cacheProps) {
    if(util.isNil(__cacheProps.booleanOperations)) {
      __cacheProps.booleanOperations = true;
      return true;
    }
  }

  get booleanOperations() {
    return this.getProps('booleanOperations');
  }
}

export default Polygon;
