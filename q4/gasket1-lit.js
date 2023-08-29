var gl;

var NumPoints = 100;
var colorLoc;
var color;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    color = [NumPoints];
    
    var vertices = [-0.1, -0.1, 0.1, -0.1, 0, 0.1];
    for ( var i = 0; i < NumPoints; i++ ) {
        
        vertices = vertices.concat(moveFromPos(generatePos(), generatePos()));
        color[i] = vec4(Math.random(), Math.random(), Math.random(), Math.random());
    
    }   
    vertices = new Float32Array(vertices);


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
    gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );

    // Associate shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Find the location of the variable fColor in the shader program
    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    var startingNodeToDraw = 0;
    i = 0;
    while(i < NumPoints-1){
        gl.uniform4fv( colorLoc, color[i] );
        gl.drawArrays( gl.TRIANGLES, startingNodeToDraw, 3);
        startingNodeToDraw+=3;
        i=i+1;
    }
}

//======================
//===Helper functions===
//======================
function generatePos(){
    var multipleXY = Math.random() * 1;
    var minusOrPlusXY = Math.random() * 1;
    if(multipleXY < 0.5){
        minusOrPlusXY = minusOrPlusXY*-1
    }
    return minusOrPlusXY;

}

//starting pos [-0.1, -0.1, 0.1, -0.1, 0, 0.1];
function moveFromPos (x, y) {
    var rslt = [x-0.1, y-0.1,
                x+0.1, y-0.1,
                x, y + 0.1]
    return rslt;
}

