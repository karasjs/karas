import matrix from './matrix';
import tar from './tar';
import geom from './geom';
import { union, diff, intersection, xor } from './martinez';

export default {
  matrix,
  tar,
  geom,
  booleanOperations: {
    union,
    diff,
    intersection,
    xor,
  },
};
