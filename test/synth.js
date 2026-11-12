/* Synthesised piano-like tones for testing the listener without a real piano. */
var PCN={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function midi(n){var m=/^([A-G])([#b]?)(\d)$/.exec(n);return PCN[m[1]]+(m[2]==="#"?1:m[2]==="b"?-1:0)+12*(+m[3]+1)}
/* events: [[noteName|null, beats], ...]; opts: sr, bpm, a4, overlap (seconds a note rings on), noise, lead (s), gain */
function render(events,o){
  o=o||{};var sr=o.sr||48000,beat=60/(o.bpm||72),a4=o.a4||440,ring=o.overlap==null?0.15:o.overlap,noise=o.noise==null?0.003:o.noise,lead=o.lead==null?0.5:o.lead,gain=o.gain||0.25;
  var total=lead+events.reduce(function(a,e){return a+e[1]*beat},0)+1.5,out=new Float32Array(Math.ceil(total*sr)),t0=lead,seed=12345;
  function rnd(){seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff*2-1}
  events.forEach(function(e){
    var dur=e[1]*beat;
    if(e[0]){
      var f0=a4*Math.pow(2,(midi(e[0])-69)/12),len=Math.floor((dur+ring)*sr),start=Math.floor(t0*sr),B=0.0004;
      for(var k=1;k<=8;k++){
        var f=k*f0*Math.sqrt(1+B*k*k);if(f>sr/2.2)break;
        var amp=gain/Math.pow(k,1.3),decay=1.2+0.9*k,ph=k*0.7;
        for(var i=0;i<len&&start+i<out.length;i++){
          var t=i/sr,env=Math.min(1,t/0.004)*Math.exp(-decay*t);
          if(t>dur)env*=Math.exp(-(t-dur)*30); /* damper */
          out[start+i]+=amp*env*Math.sin(2*Math.PI*f*t+ph);
        }
      }
      for(var j=0;j<sr*0.008;j++)out[start+j]+=gain*0.3*rnd()*(1-j/(sr*0.008)); /* hammer thump */
    }
    t0+=dur;
  });
  for(var q=0;q<out.length;q++)out[q]+=noise*rnd();
  return {samples:out,sr:sr};
}
function wav(samples,sr){
  var b=Buffer.alloc(44+samples.length*2);
  b.write("RIFF",0);b.writeUInt32LE(36+samples.length*2,4);b.write("WAVEfmt ",8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);
  b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write("data",36);b.writeUInt32LE(samples.length*2,40);
  for(var i=0;i<samples.length;i++)b.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(samples[i]*32767))),44+i*2);
  return b;
}
module.exports={render:render,wav:wav,midi:midi};
