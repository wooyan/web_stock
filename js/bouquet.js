/*
 * 花あかり — 花のイラストを SVG で組み立てる
 *
 * 画像ファイルは使わず、花びらの楕円を回転させながら重ねて描いている。
 * 色は CSS のカスタムプロパティ (--p1 〜 --p5) を参照するので、
 * テーマの切り替えにそのまま追従する。
 */

const NS = "http://www.w3.org/2000/svg";
const make = (name, attrs) => {
  const node = document.createElementNS(NS, name);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  return node;
};

// ひとつの花を、花びらの楕円を回転させながら重ねて描く
function bloom(scale, tone) {
  const g = make("g", {});
  const rings = [
    { count: 8, rx: scale * 0.44, ry: scale * 0.95, lift: scale * 0.55, fill: `var(--p${tone})`, turn: 0, o: 0.9 },
    { count: 6, rx: scale * 0.32, ry: scale * 0.64, lift: scale * 0.36, fill: `var(--p${tone}i)`, turn: 24, o: 0.95 }
  ];
  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      g.appendChild(make("ellipse", {
        cx: 0, cy: -ring.lift, rx: ring.rx.toFixed(2), ry: ring.ry.toFixed(2),
        fill: ring.fill, opacity: ring.o,
        transform: `rotate(${(360 / ring.count) * i + ring.turn})`
      }));
    }
  }
  g.appendChild(make("circle", { r: (scale * 0.21).toFixed(2), fill: "var(--center)", opacity: 0.9 }));
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 / 5) * i - 0.4;
    g.appendChild(make("circle", {
      cx: (Math.cos(a) * scale * 0.13).toFixed(2),
      cy: (Math.sin(a) * scale * 0.13).toFixed(2),
      r: (scale * 0.055).toFixed(2), fill: "var(--center)"
    }));
  }
  return g;
}

function leaf(x, y, len, angle, tone) {
  return make("ellipse", {
    cx: 0, cy: -len / 2, rx: len * 0.26, ry: len / 2, fill: tone, opacity: 0.8,
    transform: `translate(${x},${y}) rotate(${angle})`
  });
}

// ヒーローの花束
const bouquet = document.getElementById("bouquet");
if (bouquet) {
  const TIE = { x: 200, y: 400 };
  const flowers = [
    [126, 122, 36, 1], [254, 96, 30, 2], [310, 184, 23, 4],
    [ 76, 214, 25, 3], [196, 190, 34, 1], [248, 262, 19, 5],
    [114, 290, 18, 4], [172, 74, 17, 5], [300, 300, 15, 2]
  ];
  const stems = make("g", { fill: "none", stroke: "var(--stem)", "stroke-width": "2.2", "stroke-linecap": "round", opacity: "0.85" });
  const leaves = make("g", {});
  const heads = make("g", {});

  flowers.forEach(([x, y, s, tone], i) => {
    const cx = x + (TIE.x - x) * 0.2;
    stems.appendChild(make("path", { d: `M ${x} ${y} Q ${cx.toFixed(1)} ${y + 130} ${TIE.x} ${TIE.y}` }));
    if (i % 2 === 0) {
      const lx = x + (TIE.x - x) * 0.45;
      leaves.appendChild(leaf(lx, y + 120, 54 - i * 3, (TIE.x - x) * 0.11 + 26, "var(--leaf)"));
    }
    const spot = make("g", { transform: `translate(${x},${y})` });
    const swayer = make("g", { class: "sway" });
    swayer.style.animationDelay = `${(i * 0.55).toFixed(2)}s`;
    swayer.style.animationDuration = `${(7 + (i % 3)).toFixed(1)}s`;
    swayer.appendChild(bloom(s, tone));
    spot.appendChild(swayer);
    heads.appendChild(spot);
  });

  // 包み紙とリボン
  const paper = make("g", {});
  paper.appendChild(make("polygon", { points: "140,382 260,382 292,478 108,478", fill: "var(--wrap)" }));
  paper.appendChild(make("polygon", { points: "200,382 260,382 292,478 200,478", fill: "var(--wrap-2)", opacity: "0.55" }));
  paper.appendChild(make("rect", { x: "134", y: "396", width: "132", height: "7", rx: "3.5", fill: "var(--rose)", opacity: "0.75" }));
  paper.appendChild(make("path", {
    d: "M 200 403 Q 176 424 160 414 M 200 403 Q 224 424 240 414",
    fill: "none", stroke: "var(--rose)", "stroke-width": "3", "stroke-linecap": "round", opacity: "0.6"
  }));

  bouquet.append(stems, leaves, paper, heads);
}

// 今週の花の小さなアイコン
document.querySelectorAll("svg[data-bloom]").forEach(svg => {
  const g = make("g", { transform: "translate(50,50)" });
  g.appendChild(bloom(30, svg.dataset.bloom));
  svg.appendChild(g);
});
