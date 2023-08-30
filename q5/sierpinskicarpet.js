"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski carpet Gasket
    //

    var vertices = [
        vec2(  1, -1 ),
        vec2( -1, -1 ),
        vec2(  1, 1),
        vec2( -1, 1)
    ];

    divideRectangle( vertices[0], vertices[1], vertices[2], vertices[3],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function rectangle( a, b, c ,d )
{
    points.push( a, b, c, b, c, d);
}

function divideRectangle( a, b, c,d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        rectangle( a, b, c, d);
    }
    else {
        //bisect the sides
        var ab = mix( a, b, 1/3);
        var ba = mix( b, a, 1/3);

        var bd = mix( b, d, 1/3);
        var db = mix( d, b, 1/3);

        var dc = mix( d, c, 1/3);
        var cd = mix( c, d, 1/3);

        var ac = mix( a, c, 1/3);
        var ca = mix( c, a, 1/3);

         
        var abcd = mix( ab, cd, 1/3);
        var cdab = mix( cd, ab, 1/3);


        var badc = mix(ba, dc, 1/3);
        
        var badc = mix(ba, dc, 1/3);

        var dbca = mix(db, ca, 1/3);

        --count;

        divideRectangle( cd, cdab, c, ca, count );
        divideRectangle( cdab, abcd, ca, ac, count );
        divideRectangle( a, ab, ac, abcd, count );

        divideRectangle( ba, ab, badc, abcd, count);

        divideRectangle( db, d, dbca, dc, count);
        divideRectangle( bd, db, badc, dbca, count);
        divideRectangle( b, ba, bd, badc, count);

        divideRectangle( dc, cd, dbca, cdab, count);
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function findCut(){
    return 2.0/3.0;
}
