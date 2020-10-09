window.MathJax = {
	MathMenu: {
		showContext: true
	}
}

var script  = document.createElement( 'script' );
script.type = 'text/javascript';
script.src  = WeBWorK_MathJax.mathjax_src;
script.async = true;
document.head.appendChild( script );
