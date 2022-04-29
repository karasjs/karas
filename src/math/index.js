import matrix from './matrix';
import tar from './tar';
import vector from './vector';
import geom from './geom';
import bezier from './bezier';
import { union, diff, intersection, xor } from './martinez';

export default {
  matrix,
  tar,
  vector,
  geom,
  bezier,
  booleanOperations: {
    union,
    diff,
    intersection,
    xor,
  },
};
