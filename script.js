MathJax = {
	tex: {
		inlineMath: [["$", "$"]],
		displayMath: [["$$", "$$"]],
		tags: "ams"
	},
	svg: {
    displayAlign: 'center',
    displayIndent: '0',
    fontCache: 'global'
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("calculateBtn").addEventListener("click", () => {
    calculateDerivative();
    updateOriginalFunction();
  });

  document.getElementById("functionInput").addEventListener("input", updateOriginalFunction);

  document.getElementById("functionInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      calculateDerivative();
      updateOriginalFunction();
    }
  });
});

function plotFunctions(node, derivative) {
  const xValues = [];
  const yValues = [];
  const dyValues = [];
  
  try {
    const func = node.compile();
    const derivFunc = derivative.compile();
    
    for(let x = -10; x <= 10; x += 0.1) {
      xValues.push(x);
      yValues.push(func.evaluate({x}));
      dyValues.push(derivFunc.evaluate({x}));
    }
  } catch(e) { 
		return;
	}

  Plotly.newPlot("plotContainer", [{
    x: xValues,
    y: yValues,
    name: "f(x)",
    line: { 
			color: "#3498db"
		}
  }, {
    x: xValues,
    y: dyValues,
    name: "f'(x)",
    line: { 
			dash: "dot",
			color: "#e74c3c" 
		}
  }], {
    margin: { 
			t: 25, 
			b: 40, 
			l: 50, 
			r: 25 
		},
    showlegend: true,
    paper_bgcolor: "#f8f9fa",
    plot_bgcolor: "#f8f9fa"
  }, {
    scrollZoom: true,
    modeBarButtonsToRemove: ["toImage"],
    displaylogo: false,
    responsive: true
  });
}

function updateOriginalFunction() {
  const input = document.getElementById("functionInput").value;
  const origDiv = document.getElementById("originalFunction");
  try {
    const node = math.parse(input);
    const latex = node.toTex();
    origDiv.innerHTML = `<div>$$f(x) = ${latex}$$</div>`;
  } catch (e) {
    origDiv.innerHTML = `<div>f(x) = ${input}</div>`;
  }
  MathJax.typesetPromise();
}

function calculateDerivative() {
  const input = document.getElementById("functionInput").value;
  const resultBox = document.getElementById("resultBox");
  try {
    const node = math.parse(input);
    const derivative = math.derivative(node, "x");
    const derivLatex = derivative.toTex();
    resultBox.innerHTML = `<div>$$f'(x) = ${derivLatex}$$</div>`;
    plotFunctions(node, derivative);
  } catch (e) {
    resultBox.innerHTML = `<div class="error">${e.message}</div>`;
    document.getElementById("plotContainer").innerHTML = "";
  }
  MathJax.typesetPromise();
}
