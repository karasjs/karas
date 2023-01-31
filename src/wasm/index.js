import inject from '../util/inject';
import util from '../util/util';

let wasm;
let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
  if (cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

/**
 */
export class Animation {

  static __wrap(ptr) {
    const obj = Object.create(Animation.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_animation_free(ptr);
  }
  /**
   * @returns {number}
   */
  get duration() {
    const ret = wasm.__wbg_get_animation_duration(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set duration(arg0) {
    wasm.__wbg_set_animation_duration(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get fps() {
    const ret = wasm.__wbg_get_animation_fps(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set fps(arg0) {
    wasm.__wbg_set_animation_fps(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get delay() {
    const ret = wasm.__wbg_get_animation_delay(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set delay(arg0) {
    wasm.__wbg_set_animation_delay(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get end_delay() {
    const ret = wasm.__wbg_get_animation_end_delay(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set end_delay(arg0) {
    wasm.__wbg_set_animation_end_delay(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get fill() {
    const ret = wasm.__wbg_get_animation_fill(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set fill(arg0) {
    wasm.__wbg_set_animation_fill(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get playback_rate() {
    const ret = wasm.__wbg_get_animation_playback_rate(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set playback_rate(arg0) {
    wasm.__wbg_set_animation_playback_rate(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get iterations() {
    const ret = wasm.__wbg_get_animation_iterations(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set iterations(arg0) {
    wasm.__wbg_set_animation_iterations(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get area_start() {
    const ret = wasm.__wbg_get_animation_area_start(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set area_start(arg0) {
    wasm.__wbg_set_animation_area_start(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get area_duration() {
    const ret = wasm.__wbg_get_animation_area_duration(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set area_duration(arg0) {
    wasm.__wbg_set_animation_area_duration(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get easing() {
    const ret = wasm.__wbg_get_animation_easing(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set easing(arg0) {
    wasm.__wbg_set_animation_easing(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get current_time() {
    const ret = wasm.__wbg_get_animation_current_time(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set current_time(arg0) {
    wasm.__wbg_set_animation_current_time(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get play_count() {
    const ret = wasm.__wbg_get_animation_play_count(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set play_count(arg0) {
    wasm.__wbg_set_animation_play_count(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get play_state() {
    const ret = wasm.__wbg_get_animation_play_state(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set play_state(arg0) {
    wasm.__wbg_set_animation_play_state(this.ptr, arg0);
  }
  /**
   * @returns {boolean}
   */
  get first_enter() {
    const ret = wasm.__wbg_get_animation_first_enter(this.ptr);
    return ret !== 0;
  }
  /**
   * @param {boolean} arg0
   */
  set first_enter(arg0) {
    wasm.__wbg_set_animation_first_enter(this.ptr, arg0);
  }
  /**
   * @returns {boolean}
   */
  get first_play() {
    const ret = wasm.__wbg_get_animation_first_play(this.ptr);
    return ret !== 0;
  }
  /**
   * @param {boolean} arg0
   */
  set first_play(arg0) {
    wasm.__wbg_set_animation_first_play(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get index() {
    const ret = wasm.__wbg_get_animation_index(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set index(arg0) {
    wasm.__wbg_set_animation_index(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get percent() {
    const ret = wasm.__wbg_get_animation_percent(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set percent(arg0) {
    wasm.__wbg_set_animation_percent(this.ptr, arg0);
  }
  /**
   * @param {number} direction
   * @param {number} duration
   * @param {number} fps
   * @param {number} delay
   * @param {number} end_delay
   * @param {number} fill
   * @param {number} playback_rate
   * @param {number} iterations
   * @param {number} area_start
   * @param {number} area_duration
   * @param {number} easing
   * @returns {Animation}
   */
  static new(direction, duration, fps, delay, end_delay, fill, playback_rate, iterations, area_start, area_duration, easing) {
    const ret = wasm.animation_new(direction, duration, fps, delay, end_delay, fill, playback_rate, iterations, area_start, area_duration, easing);
    return Animation.__wrap(ret);
  }
  /**
   * @param {number} c1
   * @param {number} c2
   * @param {number} c3
   * @param {number} c4
   */
  set_bezier(c1, c2, c3, c4) {
    wasm.animation_set_bezier(this.ptr, c1, c2, c3, c4);
  }
  /**
   * @param {boolean} is_reverse
   * @param {number} time
   * @param {number} easing
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  add_frame(is_reverse, time, easing, x1, y1, x2, y2) {
    wasm.animation_add_frame(this.ptr, is_reverse, time, easing, x1, y1, x2, y2);
  }
  /**
   * @param {boolean} is_reverse
   * @param {number} k
   * @param {number} v
   * @param {number} u
   * @param {number} d
   */
  add_item(is_reverse, k, v, u, d) {
    wasm.animation_add_item(this.ptr, is_reverse, k, v, u, d);
  }
  /**
   * @param {number} play_count
   */
  init_current_frames(play_count) {
    wasm.animation_init_current_frames(this.ptr, play_count);
  }
  /**
   * @param {number} dur
   * @param {boolean} from_goto
   * @returns {boolean}
   */
  cal_current(dur, from_goto) {
    const ret = wasm.animation_cal_current(this.ptr, dur, from_goto);
    return ret !== 0;
  }
  /**
   * @param {number} diff
   * @returns {boolean}
   */
  on_frame(diff) {
    const ret = wasm.animation_on_frame(this.ptr, diff);
    return ret !== 0;
  }
  /**
   * @param {number} current_time
   */
  goto(current_time) {
    wasm.__wbg_set_animation_current_time(this.ptr, current_time);
  }
}
/**
 */
export class Node {

  static __wrap(ptr) {
    const obj = Object.create(Node.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_node_free(ptr);
  }
  /**
   * @returns {boolean}
   */
  get is_text() {
    const ret = wasm.__wbg_get_node_is_text(this.ptr);
    return ret !== 0;
  }
  /**
   * @param {boolean} arg0
   */
  set is_text(arg0) {
    wasm.__wbg_set_node_is_text(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get x() {
    const ret = wasm.__wbg_get_node_x(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set x(arg0) {
    wasm.__wbg_set_node_x(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get y() {
    const ret = wasm.__wbg_get_node_y(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set y(arg0) {
    wasm.__wbg_set_node_y(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get offset_width() {
    const ret = wasm.__wbg_get_node_offset_width(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set offset_width(arg0) {
    wasm.__wbg_set_node_offset_width(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get offset_height() {
    const ret = wasm.__wbg_get_node_offset_height(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set offset_height(arg0) {
    wasm.__wbg_set_node_offset_height(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get xa() {
    const ret = wasm.__wbg_get_node_xa(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set xa(arg0) {
    wasm.__wbg_set_node_xa(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get ya() {
    const ret = wasm.__wbg_get_node_ya(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set ya(arg0) {
    wasm.__wbg_set_node_ya(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get xb() {
    const ret = wasm.__wbg_get_node_xb(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set xb(arg0) {
    wasm.__wbg_set_node_xb(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get yb() {
    const ret = wasm.__wbg_get_node_yb(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set yb(arg0) {
    wasm.__wbg_set_node_yb(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get lv() {
    const ret = wasm.__wbg_get_node_lv(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set lv(arg0) {
    wasm.__wbg_set_node_lv(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get refresh_level() {
    const ret = wasm.__wbg_get_node_refresh_level(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set refresh_level(arg0) {
    wasm.__wbg_set_node_refresh_level(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get total() {
    const ret = wasm.__wbg_get_node_total(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} arg0
   */
  set total(arg0) {
    wasm.__wbg_set_node_total(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get opacity() {
    const ret = wasm.__wbg_get_node_opacity(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set opacity(arg0) {
    wasm.__wbg_set_node_opacity(this.ptr, arg0);
  }
  /**
   * @param {boolean} is_text
   * @returns {Node}
   */
  static new(is_text) {
    const ret = wasm.node_new(is_text);
    return Node.__wrap(ret);
  }
  /**
   * @param {number} root
   */
  set_root(root) {
    wasm.node_set_root(this.ptr, root);
  }
  /**
   * @param {number} animation
   */
  add_ani(animation) {
    wasm.node_add_ani(this.ptr, animation);
  }
  /**
   * @param {number} animation
   */
  remove_ani(animation) {
    wasm.node_remove_ani(this.ptr, animation);
  }
  /**
   */
  clear() {
    wasm.node_clear(this.ptr);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} offset_width
   * @param {number} offset_height
   * @param {number} cs0
   * @param {number} cs1
   * @param {number} cs2
   * @param {number} cs3
   * @param {number} cs4
   * @param {number} cs5
   * @param {number} cs6
   * @param {number} cs7
   * @param {number} cs8
   * @param {number} cs9
   * @param {number} cs10
   * @param {number} cs11
   * @param {number} cs12
   * @param {number} cs13
   * @param {number} cs14
   * @param {number} cs15
   * @param {number} cs16
   * @param {number} cs17
   * @param {number} cu0
   * @param {number} cu1
   * @param {number} cu2
   * @param {number} cu16
   * @param {number} cu17
   */
  set_style(x, y, offset_width, offset_height, cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7, cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15, cs16, cs17, cu0, cu1, cu2, cu16, cu17) {
    wasm.node_set_style(this.ptr, x, y, offset_width, offset_height, cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7, cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15, cs16, cs17, cu0, cu1, cu2, cu16, cu17);
  }
  /**
   * @param {number} xa
   * @param {number} ya
   * @param {number} xb
   * @param {number} yb
   */
  set_bbox(xa, ya, xb, yb) {
    wasm.node_set_bbox(this.ptr, xa, ya, xb, yb);
  }
  /**
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} e
   * @param {number} f
   * @param {number} g
   * @param {number} h
   * @param {number} i
   * @param {number} j
   * @param {number} k
   * @param {number} l
   * @param {number} m
   * @param {number} n
   * @param {number} o
   * @param {number} p
   */
  set_transform(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    wasm.node_set_transform(this.ptr, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
  }
  /**
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} e
   * @param {number} f
   * @param {number} g
   * @param {number} h
   * @param {number} i
   * @param {number} j
   * @param {number} k
   * @param {number} l
   * @param {number} m
   * @param {number} n
   * @param {number} o
   * @param {number} p
   */
  set_matrix(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    wasm.node_set_matrix(this.ptr, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
  }
  /**
   * @returns {number}
   */
  m_ptr() {
    const ret = wasm.node_m_ptr(this.ptr);
    return ret;
  }
  /**
   * @returns {number}
   */
  me_ptr() {
    const ret = wasm.node_me_ptr(this.ptr);
    return ret;
  }
  /**
   * @returns {number}
   */
  get_op() {
    const ret = wasm.node_get_op(this.ptr);
    return ret;
  }
  /**
   * @returns {number}
   */
  get_rl() {
    const ret = wasm.__wbg_get_node_refresh_level(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} diff
   * @returns {number}
   */
  on_frame(diff) {
    const ret = wasm.node_on_frame(this.ptr, diff);
    return ret >>> 0;
  }
}
/**
 */
export class Root {

  static __wrap(ptr) {
    const obj = Object.create(Root.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_root_free(ptr);
  }
  /**
   * @returns {number}
   */
  get mode() {
    const ret = wasm.__wbg_get_root_mode(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set mode(arg0) {
    wasm.__wbg_set_root_mode(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get width() {
    const ret = wasm.__wbg_get_root_width(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set width(arg0) {
    wasm.__wbg_set_root_width(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get height() {
    const ret = wasm.__wbg_get_root_height(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set height(arg0) {
    wasm.__wbg_set_root_height(this.ptr, arg0);
  }
  /**
   * @returns {number}
   */
  get font_size() {
    const ret = wasm.__wbg_get_root_font_size(this.ptr);
    return ret;
  }
  /**
   * @param {number} arg0
   */
  set font_size(arg0) {
    wasm.__wbg_set_root_font_size(this.ptr, arg0);
  }
  /**
   * @returns {Root}
   */
  static new() {
    const ret = wasm.root_new();
    return Root.__wrap(ret);
  }
  /**
   * @param {number} node
   */
  add_node(node) {
    wasm.root_add_node(this.ptr, node);
  }
  /**
   * @param {number} i
   */
  remove_node(i) {
    wasm.root_remove_node(this.ptr, i);
  }
  /**
   * @param {number} i
   * @param {number} node
   */
  set_node(i, node) {
    wasm.root_set_node(this.ptr, i, node);
  }
  /**
   * @param {number} i
   * @param {number} node
   */
  insert_node(i, node) {
    wasm.root_insert_node(this.ptr, i, node);
  }
  /**
   */
  clear() {
    wasm.root_clear(this.ptr);
  }
  /**
   * @returns {number}
   */
  size() {
    const ret = wasm.root_size(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    wasm.root_resize(this.ptr, width, height);
  }
  /**
   * @param {number} diff
   * @returns {number}
   */
  on_frame(diff) {
    const ret = wasm.root_on_frame(this.ptr, diff);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  refresh() {
    const ret = wasm.root_refresh(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  rl_ptr() {
    const ret = wasm.root_rl_ptr(this.ptr);
    return ret;
  }
  /**
   * @returns {number}
   */
  me_ptr() {
    const ret = wasm.root_me_ptr(this.ptr);
    return ret;
  }
  /**
   * @returns {number}
   */
  op_ptr() {
    const ret = wasm.root_op_ptr(this.ptr);
    return ret;
  }
  /**
   * @returns {number}
   */
  vt_ptr() {
    const ret = wasm.root_vt_ptr(this.ptr);
    return ret;
  }
}

async function load(module, imports) {
  try {
    return await WebAssembly.instantiateStreaming(module, imports);
  }
  catch(e) {
    if(module.headers.get('Content-Type') !== 'application/wasm') {
      inject.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
    }
    else {
      inject.error(e.toString());
    }
  }
}

export default {
  async init(url, cb) {
    if(typeof fetch !== undefined && util.isFunction(fetch)) {
      let req = typeof location !== 'undefined' ? new URL(url, location.href) : new URL(url);
      let input = fetch(req);
      let imports = {
        wbg: {
          __wbg_log_7bf8a72f8beaaabe(arg0, arg1) {
            inject.log(getStringFromWasm0(arg0, arg1));
          },
          __wbindgen_throw(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
          },
        },
      };
      let res = await load(await input, imports);
      if(res) {
        wasm = res.instance.exports;
      }
    }
    if(cb) {
      cb(wasm);
    }
    return wasm;
  },
  get wasm() {
    return wasm;
  },
  Node,
  Root,
  Animation,
};
