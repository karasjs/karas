import Polyline from './Polyline';
import util from '../../util/util';
import { union, diff, intersection, xor } from '../../math/martinez';

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
    if(!isMulti) {
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
      let res = [];
      let last;
      for(let i = 0; i < len - 1; i++) {
        let a = list[i], b = list[i + 1];
        switch(bo[i]) {
          case 'intersection':
            if(!a || !a.length || !b || !b.length) {
              res.push(null);
            }
            else {
              res.push(intersection([a], [b])[0][0]);
            }
            last = true;
            break;
          case 'union':
            if((!a || !a.length) && (!b || !b.length)) {
              res.push(null);
            }
            else if(!a || !a.length) {
              res.push(b);
            }
            else if(!b || !b.length) {
              res.push(a);
            }
            else {
              res.push(union([a], [b])[0][0]);
            }
            last = true;
            break;
          case 'diff':
            if(!a || !a.length) {
              res.push(null);
            }
            else if(!b || !b.length) {
              res.push(a);
            }
            else {
              res.push(diff([a], [b])[0][0]);
            }
            last = true;
            break;
          case 'xor':
            if((!a || !a.length) && (!b || !b.length)) {
              res.push(null);
            }
            else if(!a || !a.length) {
              res.push(b);
            }
            else if(!b || !b.length) {
              res.push(a);
            }
            else {
              res.push(xor([a], [b])[0][0]);
            }
            last = true;
            break;
          default:
            res.push(list[i]);
            last = false;
            break;
        }
      }
      // 最后一个没参与布尔运算，原封不动装载
      if(!last) {
        res.push(list[len - 1]);
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
