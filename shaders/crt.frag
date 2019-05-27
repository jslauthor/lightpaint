#ifdef GL_ES
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif // GL_FRAGMENT_PRECISION_HIGH
#endif // GL_ES

// I take almost zero credit for this code
// The honor goes to https://www.shadertoy.com/view/Ms23DR

uniform sampler2D source;
varying highp vec2 qt_TexCoord0;
uniform highp float qt_Opacity;

uniform float strength;
uniform float time;
uniform vec2 size;

vec2 curve(vec2 uv)
{
    uv = (uv - 0.5) * 2.0;
    uv *= 1.1;
    uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0);
    uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
    uv  = (uv / 2.0) + 0.5;
    uv =  uv *0.92 + 0.04;
    return uv;
}

void main(void)
{
    vec2 q = qt_TexCoord0;
    vec2 uv = qt_TexCoord0;
    vec2 fragCoord = size * q;
    uv = curve( uv );
    vec3 col = texture2D(source, uv).rgb;

    // Tie turbulence to this
    float x =  sin(0.3*time+uv.y*21.0)*sin(0.7*time+uv.y*29.0)*sin(0.3+0.33*time+uv.y*31.0) * strength;

    col.r = texture2D(source,vec2(x+uv.x+0.001,uv.y+0.001)).x+0.05;
    col.g = texture2D(source,vec2(x+uv.x+0.000,uv.y-0.002)).y+0.05;
    col.b = texture2D(source,vec2(x+uv.x-0.002,uv.y+0.000)).z+0.05;
    col.r += 0.08*texture2D(source,0.75*vec2(x+0.025, -0.027)+vec2(uv.x+0.001,uv.y+0.001)).x;
    col.g += 0.05*texture2D(source,0.75*vec2(x+-0.022, -0.02)+vec2(uv.x+0.000,uv.y-0.002)).y;
    col.b += 0.08*texture2D(source,0.75*vec2(x+-0.02, -0.018)+vec2(uv.x-0.002,uv.y+0.000)).z;

    col = clamp(col*0.6+0.4*col*col*1.0,0.0,1.0);

    float vig = (0.0 + 1.0*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y));
    col *= vec3(pow(vig,0.1));

    col *= vec3(0.95,1.05,0.95);
    col *= 2.8;

    float scans = clamp( 0.35+0.35*sin(3.5*time+uv.y*size.y*1.5), 0.0, 1.0);

    float s = pow(scans,1.7);
    col = col*vec3( 0.4+0.7*s) ;

    col *= 1.0+0.01*sin(110.0*time);
    if (uv.x < 0.0 || uv.x > 1.0)
            col *= 0.0;
    if (uv.y < 0.0 || uv.y > 1.0)
            col *= 0.0;

    // Darkens?
//    col *= 1.0-0.65*vec3(clamp((mod(fragCoord.x, 2.0)-1.0)*2.0,0.0,1.0));

    gl_FragColor = vec4(col, 1.) * qt_Opacity;
}
