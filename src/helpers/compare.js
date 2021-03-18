export function compareToObject(a, b, key) {
  function get(obj, path) {
    return path.split(".").reduce((r, e) => {
      if (!r) return r;
      else return r[e] || typeof r[e] == "boolean" ? r[e] : "";
    }, obj);
  }

  function isEmpty(o) {
    if (typeof o !== "object") return true;
    else return !Object.keys(o).length;
  }

  function build(a, b, o = null, prev = "") {
    return Object.keys(a).reduce(
      (r, e) => {
        const path = prev + (prev ? "." + e : e);
        const bObj = get(b, path);
        let value = false;
        const excluded = ["lineId", "skuId", "productId"];
        if (excluded.indexOf(e) == -1) {
          value = a[e] === bObj;
        }
        if (typeof a[e] === "object") {
          if (isEmpty(a[e]) && isEmpty(bObj)) {
            if (e in r) r[e] = r[e];
            else r[e] = true;
          } else if (!bObj && isEmpty(a[e])) {
            r[e] = value;
          } else {
            r[e] = build(a[e], b, r[e], path);
          }
          if (Object.values(r[e]) && !Object.values(r[e]).length) {
            delete r[e];
          }
        } else {
          if (value == false && e != "new" && a[e] != bObj) {
            r[e] = key ? a[e] : bObj;
          }
        }
        return r;
      },
      o ? o : {}
    );
  }

  function compare(a, b) {
    const o = build(a, b);
    return build(b, a, o);
  }

  return compare(a, b);
}
