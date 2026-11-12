/* Listening: turns microphone audio into note events.
   NoteTracker is pure (no browser APIs) so it can be tested in Node.
   Pitch detection is done by pitchy (McLeod pitch method). Audio never leaves the device. */
(function(root){
  var Pitchy=root.Pitchy||(typeof require==="function"?require("../test/pitchy.node.js"):null);

  function NoteTracker(o){
    o=o||{};
    this.a4=o.a4||440;
    this.size=o.size||2048;
    this.minRms=o.minRms||0.004;
    this.clarity=o.clarity||0.9;
    this.det=Pitchy.PitchDetector.forFloat32Array(this.size);
    this.reset();
  }
  NoteTracker.prototype.reset=function(){
    this.cur=null;this.curT=-1e9;this.cand=null;this.onset=null;this.lastOnset=-1e9;this.lastValid=-1e9;this.hist=[];this.noise=0.002;this.lastT=null;
  };
  /* buf: Float32Array of this.size samples (the most recent audio); sr: sample rate; t: time in ms.
     Returns {note: midi number or null, frame:{rms,pitch,clarity,midi,valid}} */
  NoteTracker.prototype.push=function(buf,sr,t){
    var n=buf.length,tail=Math.min(n,Math.round(sr*0.012)),i,s=0,st=0;
    for(i=0;i<n;i++){var v=buf[i]*buf[i];s+=v;if(i>=n-tail)st+=v}
    var rms=Math.sqrt(s/n),rT=Math.sqrt(st/tail);
    /* room-noise estimate: drops at once to any quieter moment, creeps up about 2% a second otherwise */
    var dt=this.lastT==null?16:Math.max(0,Math.min(100,t-this.lastT));this.lastT=t;
    this.noise=rms<this.noise?rms:Math.min(rms,this.noise*Math.pow(1.02,dt/1000));
    var floor=Math.max(this.minRms,Math.min(this.noise*3,0.02));
    /* onset: the last 12 ms are much louder than 40 ms ago */
    var ref=null;
    for(i=this.hist.length-1;i>=0;i--){if(this.hist[i].t<=t-40){ref=this.hist[i];break}}
    if(ref&&rT>floor&&rT>ref.r*1.7+0.002&&t-this.lastOnset>90){this.onset=t;this.lastOnset=t;this.cand=null}
    this.hist.push({t:t,r:rT});
    while(this.hist.length&&this.hist[0].t<t-220)this.hist.shift();
    if(this.onset!=null&&t-this.onset>300)this.onset=null;

    var pc=this.det.findPitch(buf,sr),pitch=pc[0],clarity=pc[1];
    var valid=clarity>=this.clarity&&rms>floor&&pitch>70&&pitch<2300;
    var mf=valid?69+12*Math.log(pitch/this.a4)/Math.LN2:null,out=null;
    if(valid){
      var note=Math.round(mf);
      this.lastValid=t;
      if(this.cand&&this.cand.n===note)this.cand.c++;else this.cand={n:note,t:t,c:1};
      if(this.cand.c>=2&&t-this.cand.t>=35){
        var fresh=this.onset!=null&&this.onset>this.curT+70;
        if(this.cur===null)out=note;
        else if(note!==this.cur){
          /* an octave jump with no new attack is the detector slipping to an overtone, not a new note */
          if((note-this.cur)%12!==0||fresh)out=note;
        }else if(fresh&&t-this.onset>=60)out=note; /* same note struck again: the pitch must hold after the new attack */
        if(out!==null){this.cur=note;this.curT=t;this.onset=null}
      }
    }else{
      this.cand=null;
      if(this.cur!==null&&t-this.lastValid>180)this.cur=null;
    }
    return {note:out,frame:{rms:rms,pitch:valid?pitch:null,clarity:clarity,midi:mf,valid:valid}};
  };

  /* ---- browser microphone ---- */
  var mic={stream:null,src:null,an:null,raf:0,token:0};
  function stop(){
    mic.token++;
    if(mic.raf){cancelAnimationFrame(mic.raf);mic.raf=0}
    if(mic.src){try{mic.src.disconnect()}catch(e){}mic.src=null}
    if(mic.stream){mic.stream.getTracks().forEach(function(tr){tr.stop()});mic.stream=null}
    mic.an=null;
  }
  /* ctx: AudioContext; o:{a4,onFrame(frame),onNote(midi)}. Resolves when listening has started. */
  function start(ctx,o){
    stop();
    if(!root.navigator||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return Promise.reject({name:"Unsupported"});
    var token=mic.token;
    return navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:1}}).then(function(stream){
      if(token!==mic.token){stream.getTracks().forEach(function(tr){tr.stop()});return}
      mic.stream=stream;mic.src=ctx.createMediaStreamSource(stream);
      mic.an=ctx.createAnalyser();mic.an.fftSize=2048;mic.an.smoothingTimeConstant=0;mic.src.connect(mic.an);
      var buf=new Float32Array(2048),tracker=new NoteTracker({a4:o.a4,size:2048});
      (function loop(){
        if(token!==mic.token)return;
        mic.raf=requestAnimationFrame(loop);
        mic.an.getFloatTimeDomainData(buf);
        var r=tracker.push(buf,ctx.sampleRate,performance.now());
        if(o.onFrame)o.onFrame(r.frame);
        if(r.note!==null&&o.onNote)o.onNote(r.note);
      })();
    });
  }
  function errorText(e){
    var n=e&&e.name;
    if(n==="Unsupported")return root.isSecureContext===false?"The microphone only works on a secure (https) address.":"This browser does not offer microphone access to web pages.";
    if(n==="NotAllowedError"||n==="SecurityError")return "Microphone access was blocked. Allow it for this site in your browser settings, then try again.";
    if(n==="NotFoundError")return "No microphone was found on this device.";
    return "The microphone could not be started. Close other apps that use it and try again.";
  }
  var api={NoteTracker:NoteTracker,start:start,stop:stop,errorText:errorText,active:function(){return !!mic.stream}};
  root.Listen=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
