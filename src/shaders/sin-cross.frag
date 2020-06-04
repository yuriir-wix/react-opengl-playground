// Author: Inigo Quiles
// Title: Expo

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(float p, float pct){
  return  smoothstep( pct-0.02, pct, p) -
          smoothstep( pct, pct+0.02, p);
}
float figure(float anchor, float var, float phase, float ampl1, float freq1, float ampl2, float freq2){
    return anchor + ampl1 * sin(var * 2. * PI * freq1 +  phase) + ampl2 * cos(var * 2. * PI * freq2 +phase);
}
void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
	vec2 cur = u_mouse/u_resolution.xy;
    float freq = 5. * cos(u_time/2.);
    float ampl = 0.05 * sin(u_time/3.);
    float lh1 = figure(cur.y, st.x, u_time * 10., ampl, freq, ampl/2., freq/2.);
    float lh2 = figure(cur.y, st.x, u_time * 10., 1.5 * ampl, freq * 0.75, ampl * 0.3, freq);
    float lh3 = figure(cur.y, st.x, u_time * 23., ampl/3., freq, ampl/6., freq*20.);
    float lv1 = figure(cur.x, st.y, u_time * 10., ampl, freq, ampl/2., freq/2.);
    float lv2 = figure(cur.x, st.y, u_time * 20., ampl, freq/5., ampl/2., freq/10.);
    float lv3 = figure(cur.x, st.y, u_time * 10., 1.5 * ampl, freq * 0.75, ampl * 0.3, freq);
    
    vec3 color = vec3(lh1);

    float pct = plot(st.y,lh1);
    color = mix(color,vec3(0.0,1.0,0.0),pct);
	pct = plot(st.y,lh2);
    color = mix(color,vec3(0.645,0.310,1.000),pct);
    pct = plot(st.y,lh3);
    color = mix(color,vec3(1.000,0.599,0.474),pct);
    pct = plot(st.x,lv1);
    color = mix(color,vec3(0.731,1.000,0.347),pct);
    pct = plot(st.x,lv2);
    color = mix(color,vec3(0.950,0.128,1.000),pct);
    pct = plot(st.x,lv3);
    color = mix(color,vec3(0.464,1.000,0.875),pct);
    gl_FragColor = vec4(color,1.0);
}
