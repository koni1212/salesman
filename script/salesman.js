var Nodes;
var Edas;
var TreePar;
var TreeRank;
var TreeSelectedEdas;
var OneStrokeArray;
var SelectedNodes;
var MinNodes;

// ノード情報
function Node(name, ido, keido) {
	this.name = name;
	this.ido = ido;
	this.keido = keido;
}

// 枝情報
function Eda(point1, point2, len) {
	this.point1 = point1;
	this.point2 = point2;
	this.len = len;
}

// UnionFind木の木の根を探索
function find(x) {
	if (TreePar[x] == x) {
		return x;
	} else {
		return find(TreePar[x]);
	}
}

// UnionFind木の属する集合を併合
function unite(x, y) {
	// 木の根を求める
	x = find(x);
	y = find(y);
	if (x == y) {
		return;
	}

	// 木が浅い方に併合する
	if (TreeRank[x] < TreeRank[y]) {
		TreePar[x] = y;
	} else {
		TreePar[y] = x;
		if (TreeRank[x] == TreeRank[y]) {
			TreeRank[x]++;
		}
	}
}

// UnionFind木の同じ集合に属するかどうか
function same(x, y) {
	return find(x) == find(y);
}

// 最小コストの経路を算出
function solve(x) {
	if (SelectedNodes.has(x)) {
	} else {
		SelectedNodes.add(x);
		MinNodes.push(Nodes[x]);
		for (let i in OneStrokeArray[x]) {
			solve(OneStrokeArray[x][i].point1);
			solve(OneStrokeArray[x][i].point2);
		}
	}
}

// 巡回セールスマン問題
function salesman() {

	console.time("巡回セールスマン問題");

	// データの初期化
	Edas = [];
	TreePar = [];
	TreeRank = [];
	TreeSelectedEdas = [];
	OneStrokeArray = [];
	SelectedNodes = new Set();
	MinNodes = [];

	/**
	 * 最小全域木を求める クラスカル法
	 */
	console.log("Nodes");
	console.log(Nodes);

	// 枝の長さを計算する
	for (let i in Nodes) {
		for (let j in Nodes) {
			if (i>=j) continue;
			let len = Math.sqrt((Nodes[i].ido - Nodes[j].ido) ** 2 + (Nodes[i].keido - Nodes[j].keido) ** 2);
			Edas.push(new Eda(i, j, len));
		}
	}

	// 枝をソートする
	Edas.sort(function(a, b) {
		if (a.len > b.len) {
			return 1;
		} else {
			return -1;
		}
	});
	console.log("Sorted Edas");
	console.log(Edas);

	// UnionFind木を作る
	for (let i in Nodes) {
		TreePar[i] = i;
		TreeRank[i] = 0;
	}

	// 枝の短い方から順にUnionFind木の集合を確認して採用していく
	for (let i in Edas) {
		if (!(same(Edas[i].point1, Edas[i].point2))) {
			unite(Edas[i].point1, Edas[i].point2);
			TreeSelectedEdas.push(Edas[i]);
		}
	}
	console.log("TreeSelectedEdas");
	console.log(TreeSelectedEdas);

	/**
	 * 最小全域木を一筆書きして1周しつつ、すでに立ち寄ったノードはスキップする
	 */
	for (let i in TreeSelectedEdas) {
		if (OneStrokeArray[TreeSelectedEdas[i].point1] == null) {
			OneStrokeArray[TreeSelectedEdas[i].point1] = [];
		}
		if (OneStrokeArray[TreeSelectedEdas[i].point2] == null) {
			OneStrokeArray[TreeSelectedEdas[i].point2] = [];
		}
		OneStrokeArray[TreeSelectedEdas[i].point1].push(TreeSelectedEdas[i]);
		OneStrokeArray[TreeSelectedEdas[i].point2].push(TreeSelectedEdas[i]);
	}
	console.log("OneStrokeArray");
	console.log(OneStrokeArray);

	// スタート地点を設定して計算
	solve("0");
	console.log("MinNodes");
	console.log(MinNodes);

	console.timeEnd("巡回セールスマン問題");

}