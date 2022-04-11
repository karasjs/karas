export default {
  position: /(([-+]?[\d.]+[pxremvwhina%]*)|(left|top|right|bottom|center)){1,2}/ig,
  gradient: /\b(\w+)-?gradient\((.+)\)/i,
  img: /(?:\burl\((['"]?)(.*?)\1\))|(?:\b((data:)))/i,
  han: /\p{Script=Han}/u,
  punctuation: /\p{P}/u,
};
