function index(p_width, p_height) {
	var focus_node = null, highlight_node = null;
	var highlight_color = "blue";
	var highlight_trans = 0.1;
	var canvas_dom = document.getElementById('network');
	// canvas_dom.width = window.innerWidth;
	// canvas_dom.height = window.innerHeight;
	var canvas = d3.select("#network"),
		width = p_width,
		height = p_height,
		ctx = canvas.node().getContext("2d"),
		r = 10,
		color = function (group) {
			if (group == 0) {
				return "#000"
			} else if (group == "cumming") {
				return "#820263"
			} else if (group == "anal sex") {
				return "#D90368"
			} else if (group == "inside cumming") {
				return "#2E294E"
			} else if (group == "oral sex") {
				return "#FFD400"
			} else if (group == "cum inside") {
				return "#BC2C1A"
			} else if (group == "cum outside") {
				return "#7D1538"
			} else if (group == "cum fast") {
				return "#7FB7BE"
			} else if (group == "broken condom") {
				return "#96E8BC"
			} else if (group == "put a condom") {
				return "#7DD181"
			} else if (group == "without condom") {
				return "#EF959C"
			} else if (group == "contraceptives") {
				return "#BA5A31"
			} else if (group == "tubal ligation") {
				return "#47682C"
			} else if (group == "vasectomy") {
				return "#EF3054"
			} else if (group == "fertility awareness") {
				return "#F19A3E"
			} else if (group == "intra uterine device") {
				return "#33CA7F"
			} else if (group == "menstrual cramps") {
				return "#DDD92A"
			} else {
				return "#aaa"
			}
		},
		simulation = d3.forceSimulation()
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force("x", d3.forceX(width / 2))
			.force("y", d3.forceY(height / 2))
			.force("collide", d3.forceCollide(r + 5))
			.force("charge", d3.forceManyBody()
				.strength(-400))
			.force("link", d3.forceLink()
				.id(function (d) { return d.name; }));

	var transform = d3.zoomIdentity;

	d3.json("https://raw.githubusercontent.com/whatevercamps/twitter_graph_unfpa.github.io/master/graph.json").then(function (graph, err) {
		if (err) throw err;

		simulation.nodes(graph.nodes);
		simulation.force("link").links(graph.links);
		simulation.on("tick", update);

		canvas
			.call(d3.drag()
				.container(canvas.node())
				.subject(dragsubject).on("start", dragstarted).on("drag", dragged).on("end", dragended))
			.call(d3.zoom().scaleExtent([1 / 10, 8]).on("zoom", zoomed));



		function zoomed() {
			transform = d3.event.transform;
			update();
		}

		function update() {

			ctx.save();

			ctx.clearRect(0, 0, width, height);
			ctx.translate(transform.x, transform.y);
			ctx.scale(transform.k, transform.k);

			ctx.beginPath();

			ctx.globalAlpha = 0.3;
			ctx.strokeStyle = "#aaa";
			graph.links.forEach(drawLink);
			ctx.stroke();

			ctx.globalAlpha = 1.0;
			graph.nodes.forEach(drawNode);

			ctx.restore();
		}

		function dragsubject() {
			var i,
				x = transform.invertX(d3.event.x),
				y = transform.invertY(d3.event.y),
				dx,
				dy;
			for (i = graph.nodes.length - 1; i >= 0; --i) {
				node = graph.nodes[i];
				dx = x - node.x;
				dy = y - node.y;

				if (dx * dx + dy * dy < r * r) {

					node.x = transform.applyX(node.x);
					node.y = transform.applyY(node.y);

					return node;
				}
			}
		}
	});

	function dragstarted() {
		d3.event.subject
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d3.event.subject.fx = d3.event.subject.x;
		d3.event.subject.fy = d3.event.subject.y;
	}

	function dragged() {
		d3.event.subject.fx = d3.event.x;
		d3.event.subject.fy = d3.event.y;
	}

	function dragended() {
		if (!d3.event.active) simulation.alphaTarget(0);
		d3.event.subject.fx = null;
		d3.event.subject.fy = null;
	}

	function drawNode(d) {
		ctx.beginPath();
		ctx.arc(d.x, d.y, r, 0, Math.PI * 2, true);
		ctx.fillStyle = color(0);
		ctx.fillText(d.name, d.x + 10, d.y + 3);
		ctx.fillStyle = color(d.name);
		ctx.fill();

	}

	function drawLink(l) {
		ctx.moveTo(l.source.x, l.source.y);
		ctx.lineTo(l.target.x, l.target.y);
	}
}