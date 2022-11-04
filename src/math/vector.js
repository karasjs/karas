// 向量点乘积
function dotProduct(x1, y1, x2, y2) {
  return x1 * x2 + y1 * y2;
}

function dotProduct3(x1, y1, z1, x2, y2, z2) {
  if(z1 === undefined && x2 === undefined && y2 === undefined && z2 === undefined) {
    x2 = y1.x;
    z2 = y1.z;
    y2 = y1.y;
    y1 = x1.y;
    z1 = x1.z;
    x1 = x1.x;
  }
  return x1 * x2 + y1 * y2 + z1 * z2;
}

// 向量叉乘积
function crossProduct(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}

function crossProduct3(x1, y1, z1, x2, y2, z2) {
  if(z1 === undefined && x2 === undefined && y2 === undefined && z2 === undefined) {
    x2 = y1.x;
    z2 = y1.z;
    y2 = y1.y;
    y1 = x1.y;
    z1 = x1.z;
    x1 = x1.x;
  }
  return {
    x: y1 * z2 - y2 * z1,
    y: z1 * x2 - z2 * x1,
    z: x1 * y2 - x2 * y1,
  };
}

// 归一化
function unitize(x, y) {
  let n = length(x, y);
  return {
    x: x / n,
    y: y / n,
  };
}

function unitize3(x, y, z) {
  if(y === undefined && z === undefined) {
    y = x.y;
    z = x.z;
    x = x.x;
  }
  let n = length3(x, y, z);
  return {
    x: x / n,
    y: y / n,
    z: z / n,
  };
}

// 是否平行
function isParallel(x1, y1, x2, y2) {
  if(isZero(x1, y1, x2, y2)) {
    return true;
  }
  let ag = angle(x1, y1, x2, y2);
  if(Math.abs(ag) < 1e-9) {
    return true;
  }
  if(Math.PI - Math.abs(ag) < 1e-9) {
    return true;
  }
  return false;
}

function isParallel3(x1, y1, z1, x2, y2, z2) {
  if(z1 === undefined && x2 === undefined && y2 === undefined && z2 === undefined) {
    x2 = y1.x;
    z2 = y1.z;
    y2 = y1.y;
    y1 = x1.y;
    z1 = x1.z;
    x1 = x1.x;
  }
  if(isZero3(x1, y1, z1, x2, y2, z2)) {
    return true;
  }
  let ag = angle3(x1, y1, z1, x2, y2, z2);
  if(Math.abs(ag) < 1e-9) {
    return true;
  }
  if(Math.PI - Math.abs(ag) < 1e-9) {
    return true;
  }
  return false;
}

// 是否是零，考虑误差
function isZero(x1, y1, x2, y2) {
  return Math.abs(x1) < 1e-9 && Math.abs(y1) < 1e-9
    && Math.abs(x2) < 1e-9 && Math.abs(y2) < 1e-9;
}

function isZero3(x1, y1, z1, x2, y2, z2) {
  if(z1 === undefined && x2 === undefined && y2 === undefined && z2 === undefined) {
    x2 = y1.x;
    z2 = y1.z;
    y2 = y1.y;
    y1 = x1.y;
    z1 = x1.z;
    x1 = x1.x;
  }
  return Math.abs(x1) < 1e-9 && Math.abs(y1) < 1e-9 && Math.abs(z1) < 1e-9
    && Math.abs(x2) < 1e-9 && Math.abs(y2) < 1e-9 && Math.abs(z2) < 1e-9;
}

// 向量夹角
function angle(x1, y1, x2, y2) {
  let cos = dotProduct(x1, y1, x2, y2) / (length(x1, y1) * length(x2, y2));
  if(cos < -1) {
    cos = -1;
  }
  else if(cos > 1) {
    cos = 1;
  }
  return Math.acos(cos);
}

function angle3(x1, y1, z1, x2, y2, z2) {
  if(z1 === undefined && x2 === undefined && y2 === undefined && z2 === undefined) {
    x2 = y1.x;
    z2 = y1.z;
    y2 = y1.y;
    y1 = x1.y;
    z1 = x1.z;
    x1 = x1.x;
  }
  let cos = dotProduct3(x1, y1, z1, x2, y2, z2) / (length3(x1, y1, z1) * length3(x2, y2, z2));
  if(cos < -1) {
    cos = -1;
  }
  else if(cos > 1) {
    cos = 1;
  }
  return Math.acos(cos);
}

// 向量长度
function length(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function length3(x, y, z) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
}

// 获取任意一个垂直于目标的向量
function getPerpendicularVector3(x, y, z) {
  let i, j, k, a, b;
  if(Math.abs(y) > Math.abs(x)) {
    if(Math.abs(z) > Math.abs(y)) {
      i = 2;
      j = 1;
      k = 0;
      a = z;
      b = -y;
    }
    else if(Math.abs(z) > Math.abs(x)) {
      i = 1;
      j = 2;
      k = 0;
      a = y;
      b = -z;
    }
    else {
      i = 1;
      j = 0;
      k = 2;
      a = y;
      b = -x;
    }
  }
  else if(Math.abs(z) > Math.abs(x)) {
    i = 2;
    j = 0;
    k = 1;
    a = z;
    b = -x;
  }
  else if(Math.abs(z) > Math.abs(y)) {
    i = 0;
    j = 2;
    k = 1;
    a = x;
    b = -z;
  }
  else {
    i = 0;
    j = 1;
    k = 2;
    a = x;
    b = -y;
  }
  let arr = [0, 0, 0];
  arr[i] = b;
  arr[j] = a;
  arr[k] = 0;
  return unitize3(arr[0], arr[1], arr[2]);
}

export default {
  dotProduct,
  dotProduct3,
  crossProduct,
  crossProduct3,
  unitize,
  unitize3,
  isParallel,
  isParallel3,
  isZero,
  isZero3,
  angle,
  angle3,
  length,
  length3,
  getPerpendicularVector3,
};
