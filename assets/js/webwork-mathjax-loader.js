window.MathJax = {
	MathMenu: {
		showContext: true
	}
}

var script  = document.createElement( 'script' );
script.type = 'text/javascript';
script.src  = WeBWorK_MathJax.mathjax_src;
document.getElementsByTagName( 'head' )[0].appendChild( script );
