import matrix from './matrix';
import tar from './tar';
import vector from './vector';
import equation from './equation';
import geom from './geom';
import bezier from './bezier';
import isec from './isec';
import { union, diff, intersection, xor } from './martinez';
import bo from './bo/index';

export default {
  matrix,
  tar,
  vector,
  equation,
  geom,
  bezier,
  isec,
  booleanOperations: {
    union,
    diff,
    intersection,
    xor,
  },
  bo,
};
