import matrix from './matrix';
import tar from './tar';
import vector from './vector';
import geom from './geom';
import { union, diff, intersection, xor } from './martinez';

export default {
  matrix,
  tar,
  vector,
  geom,
  booleanOperations: {
    union,
    diff,
    intersection,
    xor,
  },
};
