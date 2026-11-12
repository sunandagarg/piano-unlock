/* App: progress, sound, keyboard, notation, listening UI, quizzes and views. */
/* ================= state and storage ================= */
var state={done:[],fb:{},mic:{a4:440,done:false},sel:1,view:"home",step:0,peek:{},flash:""};
var LS="piano30.done";
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
(function(){var raw=lsGet(LS);if(raw){try{var a=JSON.parse(raw);if(Array.isArray(a))state.done=a.filter(function(n){return n>=1&&n<=30})}catch(e){}}})();
function isDone(n){return state.done.indexOf(n)>=0}
function today(){for(var i=1;i<=30;i++)if(!isDone(i))return i;return 30}
function weekOpen(w){var g=WEEK_GATE[w];return g===0||isDone(g)}
(function(){var raw=lsGet("piano30.fb");if(raw){try{var o=JSON.parse(raw);if(o&&typeof o==="object")state.fb=o}catch(e){}}})();
(function(){var raw=lsGet("piano30.mic");if(raw){try{var o=JSON.parse(raw);if(o&&o.a4>400&&o.a4<480)state.mic={a4:+o.a4,done:!!o.done}}catch(e){}}})();
state.sel=today();

function persist(){lsSet(LS,JSON.stringify(state.done));lsSet("piano30.fb",JSON.stringify(state.fb));lsSet("piano30.mic",JSON.stringify(state.mic))}

/* ================= audio ================= */
var ctx=null;
function audio(){if(!ctx){var A=window.AudioContext||window.webkitAudioContext;if(A)ctx=new A()}if(ctx&&ctx.state==="suspended")ctx.resume();return ctx}
function blip(time,freq,vol,len){
  var o=ctx.createOscillator(),g=ctx.createGain();
  o.frequency.value=freq;o.type="sine";
  g.gain.setValueAtTime(vol,time);g.gain.exponentialRampToValueAtTime(0.001,time+len);
  o.connect(g);g.connect(ctx.destination);o.start(time);o.stop(time+len+0.02);
}
var PCN={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function midi(n){var m=/^([A-G])([#b]?)(\d)$/.exec(n);return PCN[m[1]]+(m[2]==="#"?1:m[2]==="b"?-1:0)+12*(+m[3]+1)}
function pcOf(n){var m=/^([A-G])([#b]?)/.exec(n);return (PCN[m[1]]+(m[2]==="#"?1:m[2]==="b"?-1:0)+12)%12}
function pretty(n){return n.replace(/\d/,"").replace("#","♯").replace(/^([A-G])b/,"$1♭")}
var SHARP=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"];
function tone(m,dur,vol){
  if(!audio())return;
  var t=ctx.currentTime,f=440*Math.pow(2,(m-69)/12),g=ctx.createGain();
  var len=Math.max(0.5,Math.min(2.4,dur+0.5));
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.012);g.gain.exponentialRampToValueAtTime(0.0008,t+len);
  g.connect(ctx.destination);
  [["triangle",1,1],["sine",2,0.25]].forEach(function(p){var o=ctx.createOscillator(),og=ctx.createGain();o.type=p[0];o.frequency.value=f*p[1];og.gain.value=p[2];o.connect(og);og.connect(g);o.start(t);o.stop(t+len+0.05)});
}

/* ================= keyboard ================= */
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function makeKb(lo,octs,labels,onTap){
  var kb=el("div","kb"),map={},W=["C","D","E","F","G","A","B"],total=7*octs,wi=0;
  for(var o=lo;o<lo+octs;o++){W.forEach(function(L,i){
    var m=PCN[L]+12*(o+1),b=el("button","wk",labels||L==="C"?L:"");b.type="button";b.setAttribute("aria-label",L+o);
    hook(b,m);kb.appendChild(b);map[m]=b;wi++;
    if(L!=="E"&&L!=="B"){var k=el("button","bk");k.type="button";k.setAttribute("aria-label",SHARP[(m+1)%12]+o);
      k.style.left=(wi/total*100)+"%";k.style.width=(60/total)+"%";hook(k,m+1);kb.appendChild(k);map[m+1]=k}
  })}
  function hook(b,m){b.addEventListener("click",function(){tone(m,0.6,0.3);b.classList.add("on");setTimeout(function(){if(!b.dataset.keep)b.classList.remove("on")},220);if(onTap)onTap(m)})}
  return {el:kb,clear:function(cls){Object.keys(map).forEach(function(k){map[k].classList.remove(cls||"on");if(!cls){map[k].classList.remove("on2")}delete map[k].dataset.keep})},
    light:function(ms,cls){ms.forEach(function(m){if(map[m]){map[m].classList.add(cls||"on");map[m].dataset.keep="1"}})}};
}

/* ================= score player ================= */
var player={to:[],stop:function(){}};
function stopPlayer(){player.to.forEach(clearTimeout);player.to=[];player.stop();player.stop=function(){}}
function evNotes(ev){return ev[0]==null?[]:[].concat(ev[0])}
function evLabel(ev){if(ev[2])return ev[2];var n=evNotes(ev);return n.length?n.map(pretty).join("·"):"·"}
function buildStrip(sc){
  var strip=el("div","strip"),chips={rh:[],lh:[]};
  var bars=Math.max(sc.rh?sc.rh.length:0,sc.lh?sc.lh.length:0);
  for(var b=0;b<bars;b++){
    var bar=el("div","sbar");
    [["rh",""],["lh"," l"]].forEach(function(v){
      if(!sc[v[0]]||!sc[v[0]][b])return;
      var row=el("div","srow");
      sc[v[0]][b].forEach(function(ev){var c=el("span","chip"+v[1],evLabel(ev));row.appendChild(c);chips[v[0]].push(c)});
      bar.appendChild(row);
    });
    strip.appendChild(bar);
  }
  return {el:strip,chips:chips};
}
/* ---- staff notation (VexFlow) ---- */
var VF=(window.Vex&&window.Vex.Flow)||null;
var mountQ=[];
function vfKey(n){var m=/^([A-G])([#b]?)(\d)$/.exec(n);return m[1].toLowerCase()+m[2]+"/"+m[3]}
function vfDur(b,meter){var k=Math.round(b*6);
  var t=meter==="12/8"?{2:["8",0],6:["q",1],12:["h",1],24:["w",1]}:{3:["8",0],6:["q",0],9:["q",1],12:["h",0],18:["h",1],24:["w",0]};return t[k]||["q",0]}
function inkColor(){return getComputedStyle(document.documentElement).getPropertyValue("--ink").trim()||"#000"}
function noteEl(n){var e=null;try{e=n.getSVGElement?n.getSVGElement():null}catch(x){}return e||(n.attrs&&n.attrs.el)||null}
function mkNotes(bar,clef,meter,lab){
  return bar.map(function(ev){
    var d=vfDur(ev[1],meter),ns=evNotes(ev),n;
    if(ns.length)n=new VF.StaveNote({keys:ns.map(vfKey),duration:d[0],dots:d[1],clef:clef,auto_stem:true});
    else n=new VF.StaveNote({keys:[clef==="bass"?"d/3":"b/4"],duration:d[0]+"r",dots:d[1],clef:clef});
    if(d[1]){if(VF.Dot&&VF.Dot.buildAndAttach)VF.Dot.buildAndAttach([n],{all:true});else if(n.addDotToAll)n.addDotToAll()}
    if(lab&&ev[2]&&ev[2]!==lab.last){lab.last=ev[2];n.addModifier(new VF.Annotation(ev[2].replace("!","")).setVerticalJustification(VF.Annotation.VerticalJustify.TOP),0)}
    return n;
  });
}
/* draws sc into box; returns {rh:[svg els],lh:[svg els]} in event order, or null if notation is unavailable */
function renderStaff(box,sc){
  if(!VF)return null;
  try{
    var W=Math.max(260,box.clientWidth||340),s=W<520?0.78:0.9,avail=W/s-4;
    var per=avail<560?2:avail<820?3:4;
    var voicesDef=[];if(sc.rh)voicesDef.push(["rh","treble"]);if(sc.lh)voicesDef.push(["lh","bass"]);
    var nb=Math.max(sc.rh?sc.rh.length:0,sc.lh?sc.lh.length:0);
    if(nb<per)per=Math.max(1,nb);
    var grand=voicesDef.length===2,els={rh:[],lh:[]},color=inkColor(),mt=sc.meter.split("/"),lab={last:""};
    var lead=58+(sc.key==="G"?12:sc.key==="Ab"?40:0);
    var H=grand?238:128;
    for(var start=0;start<nb;start+=per){
      var first=start===0,L=lead+(first?26:0),base=(avail-L)/per;
      var div=el("div","sys");box.appendChild(div);
      var r=new VF.Renderer(div,VF.Renderer.Backends.SVG);r.resize(W,H*s);
      var ctx=r.getContext();ctx.scale(s,s);ctx.setFillStyle(color);ctx.setStrokeStyle(color);
      var x=1;
      for(var b=start;b<Math.min(nb,start+per);b++){
        var w=base+(b===start?L:0),staves=[],voices=[],beams=[],noteSets=[];
        voicesDef.forEach(function(vd,vi){
          var st=new VF.Stave(x,vi===0?24:124,w);
          if(b===start){st.addClef(vd[1]).addKeySignature(sc.key);if(first)st.addTimeSignature(sc.meter)}
          staves.push(st);
        });
        if(grand){var sx=Math.max(staves[0].getNoteStartX(),staves[1].getNoteStartX());staves[0].setNoteStartX(sx);staves[1].setNoteStartX(sx)}
        staves.forEach(function(st){st.setContext(ctx).draw()});
        if(grand){
          if(b===start){new VF.StaveConnector(staves[0],staves[1]).setType(VF.StaveConnector.type.BRACE).setContext(ctx).draw();
            new VF.StaveConnector(staves[0],staves[1]).setType(VF.StaveConnector.type.SINGLE_LEFT).setContext(ctx).draw()}
          new VF.StaveConnector(staves[0],staves[1]).setType(VF.StaveConnector.type.SINGLE_RIGHT).setContext(ctx).draw();
        }
        voicesDef.forEach(function(vd,vi){
          var bar=sc[vd[0]][b];if(!bar){noteSets.push([]);voices.push(null);return}
          var notes=mkNotes(bar,vd[1],sc.meter,vd[0]==="rh"||!sc.rh?lab:null);
          var v=new VF.Voice({num_beats:+mt[0],beat_value:+mt[1]});v.setStrict(false);v.addTickables(notes);
          VF.Accidental.applyAccidentals([v],sc.key);
          beams=beams.concat(VF.Beam.generateBeams(notes,sc.meter==="12/8"?{groups:[new VF.Fraction(3,8)]}:{}));
          voices.push(v);noteSets.push(notes);
        });
        var live=voices.filter(Boolean),f=new VF.Formatter();
        live.forEach(function(v){f.joinVoices([v])});
        f.format(live,Math.max(40,staves[0].getNoteEndX()-staves[0].getNoteStartX()-14));
        voices.forEach(function(v,vi){if(v)v.draw(ctx,staves[vi])});
        beams.forEach(function(bm){bm.setContext(ctx).draw()});
        voicesDef.forEach(function(vd,vi){noteSets[vi].forEach(function(n){var e=noteEl(n);if(e&&vd[0]==="lh")e.classList.add("l");els[vd[0]].push(e||document.createElement("span"))})});
        x+=w;
      }
    }
    return els;
  }catch(e){box.innerHTML="";return null}
}
function renderChordStaff(box,chords){
  if(!VF)return null;
  try{
    var W=Math.max(260,box.clientWidth||340),s=0.85,w=Math.min(W/s-4,70+chords.length*78);
    var r=new VF.Renderer(box,VF.Renderer.Backends.SVG);r.resize(W,150*s);
    var ctx=r.getContext(),color=inkColor();ctx.scale(s,s);ctx.setFillStyle(color);ctx.setStrokeStyle(color);
    var st=new VF.Stave(1,34,w);st.addClef("treble");st.setContext(ctx).draw();
    var notes=chords.map(function(c){var n=new VF.StaveNote({keys:c[1].map(vfKey),duration:"w",clef:"treble"});
      n.addModifier(new VF.Annotation(c[0].replace(/ \(.*\)/,"")).setVerticalJustification(VF.Annotation.VerticalJustify.TOP),0);return n});
    notes.forEach(function(n,i){chords[i][1].forEach(function(k,j){var m=/^[A-G]([#b])/.exec(k);if(m)n.addModifier(new VF.Accidental(m[1]),j)})});
    var v=new VF.Voice({num_beats:4,beat_value:4});v.setStrict(false);v.addTickables(notes);
    new VF.Formatter().joinVoices([v]).format([v],st.getNoteEndX()-st.getNoteStartX()-20);
    v.draw(ctx,st);
    return notes.map(function(n){return noteEl(n)||document.createElement("span")});
  }catch(e){box.innerHTML="";return null}
}
function playScore(sc,kb,hl,rate,onEnd,alter){
  stopPlayer();if(!audio()){onEnd&&onEnd();return}
  var beat=60/(sc.bpm*rate),end=0;
  [["rh","on"],["lh","on2"]].forEach(function(v){
    if(!sc[v[0]])return;var t=0,i=0;
    sc[v[0]].forEach(function(bar){bar.forEach(function(ev){
      (function(ev,idx,at){player.to.push(setTimeout(function(){
        var names=evNotes(ev);
        if(alter&&v[0]==="rh"&&alter.i===idx)names=[alter.n];
        var ms=names.map(midi);
        if(kb){kb.clear(v[1]);kb.light(ms,v[1])}
        ms.forEach(function(m){tone(m,ev[1]*beat,v[0]==="rh"?0.26:0.2)});
        if(hl){hl[v[0]].forEach(function(c){c.classList.remove("on")});if(hl[v[0]][idx])hl[v[0]][idx].classList.add("on")}
      },at*1000))})(ev,i,t);
      t+=ev[1]*beat;i++;
    })});
    end=Math.max(end,t);
  });
  player.stop=function(){if(kb)kb.clear();if(hl){hl.rh.concat(hl.lh).forEach(function(c){c.classList.remove("on")})}onEnd&&onEnd()};
  player.to.push(setTimeout(function(){stopPlayer()},end*1000+300));
}
/* staff if the notation library loaded, letter chips otherwise */
function scoreView(box,sc){
  var hl={rh:[],lh:[]},holder=el("div","staff");box.appendChild(holder);
  mountQ.push(function(){
    var els=renderStaff(holder,sc);
    if(els){hl.rh=els.rh;hl.lh=els.lh}
    else{var st=buildStrip(sc);holder.className="";holder.appendChild(st.el);hl.rh=st.chips.rh;hl.lh=st.chips.lh}
  });
  return {hl:hl,holder:holder};
}
/* ---- listening: follow the player note by note ---- */
var listening=null;
function stopListening(){if(listening){var l=listening;listening=null;l.end()}}
function canFollow(d){
  if(d.t!=="mel"||!d.rh||!window.Listen)return false;
  var evs=[].concat.apply([],d.rh);
  return evs.every(function(ev){return !Array.isArray(ev[0])})&&evs.filter(function(ev){return ev[0]}).length>=3;
}
function noteName(m){return SHARP[((m%12)+12)%12]}
function followUI(d,sv,kb){
  var box=el("div","follow"),row=el("div","actions"),btn=el("button","ghost small","● Listen to me"),coinsEl=el("span","coins",""),
      meter=el("div","meter"),bar=el("i"),msg=el("p","fmsg muted","Listen follows the right hand, one note at a time. Play it alone, without the metronome.");
  btn.type="button";meter.appendChild(bar);meter.hidden=true;meter.setAttribute("aria-hidden","true");msg.setAttribute("aria-live","polite");
  var evs=[].concat.apply([],d.rh),idxs=[];evs.forEach(function(ev,i){if(ev[0])idxs.push(i)});
  var pos=0,slips=0,slipAt=-1,coins=0,finished=false,mine=null;
  function target(){return sv.hl.rh[idxs[pos]]}
  function clearMarks(){sv.hl.rh.forEach(function(c){c.classList.remove("ok","next","miss","missed")})}
  function showNext(){
    sv.hl.rh.forEach(function(c){c.classList.remove("next")});
    var e=target();if(e){e.classList.add("next");if(e.scrollIntoView)e.scrollIntoView({block:"nearest",inline:"nearest"})}
  }
  function drawCoins(){coinsEl.textContent="Coins "+"●".repeat(coins)+"○".repeat(3-coins)}
  function restart(){pos=0;slips=0;slipAt=-1;finished=false;clearMarks();showNext()}
  function onNote(m){
    if(finished)restart();
    var want=midi(evs[idxs[pos]][0]),e=target();
    kb.clear();kb.light([m]);
    if((m-want)%12===0){
      if(e){e.classList.remove("next","miss");e.classList.add("ok")}
      pos++;
      if(pos<idxs.length){msg.className="fmsg muted";msg.textContent=pos+" of "+idxs.length+" notes";showNext();return}
      finished=true;coins=slips?0:Math.min(3,coins+1);drawCoins();
      msg.className="fmsg "+(slips?"muted":"good");
      msg.textContent=slips?"Finished with "+slips+(slips===1?" slip":" slips")+". Coins go back to zero. Play it again from the top."
        :coins>=3?"Three clean runs in a row. This passage is yours.":"Clean run. Play it again from the top for the next coin.";
    }else if(slipAt===pos&&pos+1<idxs.length&&(m-midi(evs[idxs[pos+1]][0]))%12===0){
      /* the player went on after a wrong note: mark it missed and catch up with them */
      if(e){e.classList.remove("next","miss");e.classList.add("missed")}
      pos++;onNote(m);
    }else{
      if(slipAt!==pos){slips++;slipAt=pos}
      if(e){e.classList.add("miss");setTimeout(function(){e.classList.remove("miss")},500)}
      msg.className="fmsg bad";msg.textContent="Heard "+noteName(m)+". The blue note is "+pretty(evs[idxs[pos]][0])+". Play it, or carry on and I will catch up.";
    }
  }
  function begin(){
    stopListening();stopPlayer();stopMetro();
    var c=audio();
    if(!c){msg.className="fmsg bad";msg.textContent="This browser has no sound system for web pages.";return}
    btn.disabled=true;msg.className="fmsg muted";msg.textContent="Starting the microphone…";
    var me={end:function(){Listen.stop();btn.textContent="● Listen to me";meter.hidden=true;sv.hl.rh.forEach(function(x){x.classList.remove("next")});kb.clear()}};
    Listen.start(c,{a4:state.mic.a4,onFrame:function(f){bar.style.width=Math.min(100,f.rms*500)+"%"},onNote:onNote}).then(function(){
      btn.disabled=false;
      if(!box.isConnected){Listen.stop();return}
      listening=mine=me;btn.textContent="■ Stop listening";meter.hidden=false;drawCoins();restart();
      msg.textContent="Listening. Play from the first note; the blue note is next.";
    }).catch(function(e){btn.disabled=false;msg.className="fmsg bad";msg.textContent=Listen.errorText(e)});
  }
  btn.addEventListener("click",function(){
    if(mine&&listening===mine){stopListening();msg.className="fmsg muted";msg.textContent="Stopped listening."}else begin();
  });
  row.appendChild(btn);row.appendChild(coinsEl);box.appendChild(row);box.appendChild(meter);box.appendChild(msg);
  return box;
}
function demoUI(d){
  var box=el("div","demo");
  if(d.label)box.appendChild(el("p","dl",d.label));
  var wide=d.oct>3,kb=makeKb(d.lo,d.oct,!wide);
  if(d.t==="mel"){
    var sv=scoreView(box,d);
    var row=el("div","actions"),p=el("button","primary small","▶ Play"),s=el("button","ghost small","▶ Slowly"),x=el("button","ghost small","■ Stop");
    [p,s,x].forEach(function(b){b.type="button"});
    p.addEventListener("click",function(){stopListening();playScore(d,kb,sv.hl,1)});
    s.addEventListener("click",function(){stopListening();playScore(d,kb,sv.hl,0.6)});
    x.addEventListener("click",stopPlayer);
    row.appendChild(p);row.appendChild(s);row.appendChild(x);box.appendChild(row);
    if(canFollow(d))box.appendChild(followUI(d,sv,kb));
    box.appendChild(kb.el);
    if(d.lh&&d.rh)box.appendChild(el("div","legend",'<span><i style="background:var(--key-on)"></i>Right hand</span><span><i style="background:var(--brass-key)"></i>Left hand</span>'));
  }else{
    var holder=el("div","staff"),els=null;box.appendChild(holder);
    mountQ.push(function(){els=renderChordStaff(holder,d.chords)});
    var btns=el("div","chordbtns");
    d.chords.forEach(function(c,ci){
      var b=el("button","ghost small",c[0]+" <span class=\"muted\">"+c[1].map(pretty).join(" ")+"</span>");b.type="button";
      b.addEventListener("click",function(){stopListening();stopPlayer();kb.clear();kb.light(c[1].map(midi));c[1].forEach(function(n){tone(midi(n),1.2,0.24)});
        Array.prototype.forEach.call(btns.children,function(o){o.classList.remove("sel")});b.classList.add("sel");
        if(els){els.forEach(function(e){e.classList.remove("on")});els[ci].classList.add("on")}});
      btns.appendChild(b);
    });
    box.appendChild(btns);box.appendChild(kb.el);
  }
  return box;
}

/* ================= timer and metronome ================= */
var timer=null;
function fmt(s){var m=Math.floor(s/60),x=s%60;return m+":"+(x<10?"0":"")+x}
function stopTimer(){if(timer){clearInterval(timer.iv);timer=null}}
function timerBtn(mins){
  var secs=mins*60,btn=el("button","tbtn","▶ Timer "+fmt(secs));btn.type="button";
  btn.addEventListener("click",function(){
    var running=timer&&timer.btn===btn;stopTimer();btn.classList.remove("end","run");
    if(running){btn.textContent="▶ Timer "+fmt(secs);return}
    audio();var end=Date.now()+secs*1000;btn.classList.add("run");
    timer={btn:btn,iv:setInterval(tick,250)};tick();
    function tick(){var left=Math.max(0,Math.round((end-Date.now())/1000));btn.textContent="■ "+fmt(left)+" left";
      if(left<=0){stopTimer();btn.classList.remove("run");btn.classList.add("end");btn.textContent="Time is up";
        if(ctx&&!(window.Listen&&Listen.active())){var t=ctx.currentTime+0.05;blip(t,660,0.25,0.5);blip(t+0.35,880,0.25,0.8)}}}
  });
  return btn;
}
var METERS={"3/4":{beats:3,sub:1},"4/4":{beats:4,sub:1},"12/8":{beats:4,sub:3}};
var metro={on:false,bpm:72,meter:"4/4",next:0,step:0,iv:null,dots:null,btn:null};
function stopMetro(){metro.on=false;if(metro.iv){clearInterval(metro.iv);metro.iv=null}if(metro.btn&&metro.btn.isConnected)metro.btn.textContent="Start metronome";lightDot(-1)}
function lightDot(i){if(!metro.dots)return;Array.prototype.forEach.call(metro.dots.children,function(d,k){d.classList.toggle("on",k===i)})}
function schedule(){
  if(!ctx)return;
  var m=METERS[metro.meter],stepLen=60/metro.bpm/m.sub,total=m.beats*m.sub;
  while(metro.next<ctx.currentTime+0.12){
    var s=metro.step%total,beat=Math.floor(s/m.sub),onBeat=s%m.sub===0;
    if(onBeat)blip(metro.next,beat===0?1320:880,beat===0?0.5:0.35,0.06);else blip(metro.next,660,0.12,0.04);
    if(onBeat){(function(b,at){setTimeout(function(){if(metro.on)lightDot(b)},Math.max(0,(at-ctx.currentTime)*1000))})(beat,metro.next)}
    metro.next+=stepLen;metro.step++;
  }
}
function drawDots(){if(!metro.dots)return;metro.dots.innerHTML="";for(var i=0;i<METERS[metro.meter].beats;i++)metro.dots.appendChild(document.createElement("i"))}
function metroUI(day){
  stopMetro();metro.bpm=day.bpm;metro.meter=day.meter;
  var box=el("div","metro");
  var btn=el("button","ghost small","Start metronome");btn.type="button";metro.btn=btn;
  var l1=el("label",null,"Tempo ");var bpm=el("input");bpm.type="number";bpm.min=30;bpm.max=220;bpm.value=day.bpm;bpm.id="metro-bpm";l1.appendChild(bpm);
  var l2=el("label",null,"Count ");var sel=el("select");sel.id="metro-meter";
  Object.keys(METERS).forEach(function(k){var o=el("option",null,k);o.value=k;if(k===day.meter)o.selected=true;sel.appendChild(o)});l2.appendChild(sel);
  var dots=el("div","beat");metro.dots=dots;drawDots();
  bpm.addEventListener("change",function(){var v=Math.min(220,Math.max(30,parseInt(bpm.value,10)||day.bpm));bpm.value=v;metro.bpm=v});
  sel.addEventListener("change",function(){metro.meter=sel.value;metro.step=0;drawDots()});
  btn.addEventListener("click",function(){
    if(metro.on){stopMetro();return}
    if(!audio()){btn.textContent="No sound available here";return}
    stopListening();
    metro.on=true;metro.step=0;metro.next=ctx.currentTime+0.08;btn.textContent="Stop metronome";
    metro.iv=setInterval(schedule,25);schedule();
  });
  box.appendChild(btn);box.appendChild(l1);box.appendChild(l2);box.appendChild(dots);
  return box;
}

/* ================= quiz ================= */
function quizUI(day){
  var wrap=el("div","quiz"),right=0,answered=0;
  var score=el("p","muted","Wrong answers show the reason, and you can try again.");
  function mark(ok,first){if(first){answered++;if(ok)right++}score.textContent=right+" of "+day.quiz.length+" right first time"+(answered===day.quiz.length?".":" so far.")}
  function listenBtn(label,fn){var pb=el("button","primary small","▶ "+label);pb.type="button";pb.addEventListener("click",fn);var pr=el("div","actions");pr.appendChild(pb);return pr}
  day.quiz.forEach(function(q,qi){
    var box=el("div","q");box.appendChild(el("p","qt",(qi+1)+". "+q.q));
    var fb=el("p","fb"),tried=false;
    function say(ok,retry){fb.className="fb"+(ok?" ok":"");fb.textContent=ok?"Right. "+q.why:retry;mark(ok,!tried);tried=true}
    if(q.type==="tap"||q.type==="echo"){
      var isEcho=q.type==="echo",ordered=isEcho||q.ordered,want=isEcho?[].concat.apply([],q.play.rh).map(function(ev){return pcOf(evNotes(ev)[0])}):q.tap.map(pcOf);
      var got=[],shown=el("p","tapped muted","Tap the keys below.");
      if(isEcho)box.appendChild(listenBtn("Listen",function(){playScore(q.play,null,null,1)}));
      var kb=makeKb(4,2,false,function(m){
        if(!ordered&&got.indexOf(m%12)>=0)return;
        got.push(m%12);if(!ordered)kb.light([m]);shown.textContent=got.map(function(p){return SHARP[p]}).join("  ");shown.classList.remove("muted");
      });
      var row=el("div","actions"),chk=el("button","primary small","Check"),clr=el("button","ghost small","Clear");chk.type=clr.type="button";
      clr.addEventListener("click",function(){got=[];kb.clear();shown.textContent="Tap the keys below.";shown.classList.add("muted");fb.textContent="";fb.className="fb"});
      chk.addEventListener("click",function(){
        var ok=ordered?got.join()===want.join():(got.length===want.length&&want.every(function(p){return got.indexOf(p)>=0}));
        say(ok,isEcho?"Not yet. Press Clear, listen again and have another go.":"Not yet. "+q.why+" Press Clear and try again.");
      });
      row.appendChild(chk);row.appendChild(clr);
      box.appendChild(kb.el);box.appendChild(shown);box.appendChild(row);
    }else if(q.type==="spot"){
      var sv=scoreView(box,q.score);
      box.insertBefore(listenBtn("Listen",function(){playScore(q.score,null,null,1,null,{i:q.idx,n:q.wrong})}),sv.holder);
      box.appendChild(el("p","muted","Tap a note in the notation."));
      sv.holder.classList.add("tappable");
      sv.holder.addEventListener("click",function(e){
        var best=-1,bd=1e9;
        sv.hl.rh.forEach(function(n,i){if(!n.getBoundingClientRect)return;var r=n.getBoundingClientRect();if(e.clientY<r.top-60||e.clientY>r.bottom+60)return;var d=Math.abs(e.clientX-(r.left+r.width/2));if(d<bd){bd=d;best=i}});
        if(best<0||bd>40)return;
        sv.hl.rh.forEach(function(n){n.classList.remove("on")});sv.hl.rh[best].classList.add("on");
        say(best===q.idx,"Not that one. Listen again and follow the notes with your finger.");
      });
    }else if(q.type==="pick"){
      box.appendChild(listenBtn("Listen",function(){playScore(q.play,null,null,1)}));
      var opts=el("div","opts");
      q.options.forEach(function(o,oi){
        var b=el("button","opt notation");b.type="button";b.setAttribute("aria-label","Option "+(oi+1));
        scoreView(b,o);
        b.addEventListener("click",function(){var ok=oi===q.a;b.classList.add(ok?"right":"wrong");say(ok,"Not that one. Listen again.");
          if(ok)Array.prototype.forEach.call(opts.children,function(x){x.disabled=true})});
        opts.appendChild(b);
      });
      box.appendChild(opts);
    }else{
      if(q.play)box.appendChild(listenBtn("Listen",function(){playScore(q.play,null,null,1)}));
      var mo=el("div","opts");
      q.opts.forEach(function(o,oi){
        var b=el("button","opt",o);b.type="button";
        b.addEventListener("click",function(){var ok=oi===q.a;b.classList.add(ok?"right":"wrong");say(ok,"Not that one. Try another.");
          if(ok)Array.prototype.forEach.call(mo.children,function(x){x.disabled=true})});
        mo.appendChild(b);
      });
      box.appendChild(mo);
    }
    box.appendChild(fb);wrap.appendChild(box);
  });
  wrap.appendChild(score);
  return wrap;
}

/* ================= views ================= */
function renderHeader(){
  var c=state.done.length;
  document.getElementById("pcount").textContent=c+" of 30 days done";
  document.getElementById("pbar").style.width=(c/30*100)+"%";
}
function renderIntro(){
  var box=document.getElementById("intro");box.innerHTML="";
  if(lsGet("piano30.intro")==="1"||state.done.length||state.view!=="home")return;
  var c=el("div","intro");
  c.appendChild(el("h2",null,"How this works"));
  c.appendChild(el("ol",null,
    "<li>Sit at your piano with this page open. Each day is one 25-minute session.</li>"+
    "<li>Press <b>Start</b>. You get one step at a time: what to play, the notation, a keyboard that plays it for you, and a timer.</li>"+
    "<li>On melody steps, press <b>Listen to me</b> and play. The notes turn green as you get them right, and three clean runs earn three coins.</li>"+
    "<li>Each step says how you know you have it, and what to try if it is too easy.</li>"+
    "<li>Each day ends with a short ear-and-eye quiz. Then you rate the day and mark it done.</li>"+
    "<li>Days 6, 13 and 20 hold a 60-second test. Passing it unlocks the next song.</li>"));
  var b=el("button","ghost small","Got it");b.type="button";b.addEventListener("click",function(){lsSet("piano30.intro","1");box.innerHTML=""});
  var r=el("div","actions");r.appendChild(b);c.appendChild(r);box.appendChild(c);
}
function stepNames(day){var a=day.steps.map(function(s){return [s.k,s.m+" min"]});if(day.quiz.length)a.push(["Quiz",day.quiz.length+" questions"]);return a}
function aboutUI(w){
  var d=el("details","about");d.open=true;
  d.appendChild(el("summary",null,"About this "+(w===1?"piece":w===5?"week":"song")));
  var dl=el("dl","facts");
  ABOUT[w].forEach(function(r){dl.appendChild(el("dt",null,r[0]));dl.appendChild(el("dd",null,r[1]))});
  d.appendChild(dl);return d;
}
function renderHome(){
  var box=document.getElementById("main");box.innerHTML="";
  var n=state.sel,day=DAYS[n-1],t=today();
  if(state.flash){box.appendChild(el("div","banner",state.flash));state.flash=""}
  box.appendChild(el("span","label",(n===t&&!isDone(n)?"Today · ":"")+"Day "+n+" of 30 · "+WEEK_NAMES[day.w]+(day.type==="boss"?" · unlock day":"")));
  box.appendChild(el("h2","big",day.title));
  if(!weekOpen(day.w)&&!state.peek[day.w]){
    var gate=WEEK_GATE[day.w],lb=el("div","lockbox");
    lb.appendChild(el("p",null,"This day is locked. It opens when you pass the test on day "+gate+" and mark that day done."));
    var row=el("div","actions");
    var go=el("button","primary","Go to day "+gate);go.type="button";go.addEventListener("click",function(){state.sel=gate;render()});
    var pk=el("button","ghost","Peek anyway");pk.type="button";pk.addEventListener("click",function(){state.peek[day.w]=true;render()});
    row.appendChild(go);row.appendChild(pk);lb.appendChild(row);box.appendChild(lb);return;
  }
  var prev=state.fb[n-1];
  if(prev&&!isDone(n)&&prev.r==="easy")box.appendChild(el("p","coach","<b>Coach:</b> you rated day "+(n-1)+" too easy. Today, go for the “Too easy?” goal in every step and set the metronome 10 higher than suggested."));
  if(prev&&!isDone(n)&&prev.r==="hard")box.appendChild(el("p","coach","<b>Coach:</b> you rated day "+(n-1)+" too hard. Spend the Replay step on yesterday's Song step, at the Slowly speed, before moving on. Repeating a day is fine."));
  box.appendChild(el("p",null,"<b>After this session:</b> "+day.goal));
  if(WHY[n])box.appendChild(el("p",null,"<b>Why it matters:</b> "+WHY[n]));
  box.appendChild(el("p","muted","<b>You need:</b> "+(day.type==="rest"?"Nothing. Headphones if you want to listen.":WEEK_NEED[day.w])));
  var act=el("div","actions");
  var start=el("button","primary",isDone(n)?"Do this session again":(day.type==="rest"?"Open rest day":"Start session"));start.type="button";
  start.addEventListener("click",function(){state.view="session";state.step=0;render();scrollTop()});
  act.appendChild(start);
  if(isDone(n)){
    act.appendChild(el("span","muted","Done ✓"));
    var un=el("button","ghost small","Mark as not done");un.type="button";
    un.addEventListener("click",function(){state.done=state.done.filter(function(x){return x!==n});persist();render()});act.appendChild(un);
  }else if(day.type==="rest"){
    var sk=el("button","ghost","Mark rest day done");sk.type="button";sk.addEventListener("click",function(){finishDay(n)});act.appendChild(sk);
  }
  box.appendChild(act);
  var ul=el("ol","steplist");
  stepNames(day).forEach(function(s,i){var li=el("li");li.appendChild(el("span",null,(i+1)+". "+s[0]));li.appendChild(el("span",null,s[1]));ul.appendChild(li)});
  box.appendChild(ul);
  box.appendChild(aboutUI(day.w));
}
function scrollTop(){var m=document.getElementById("main");if(m.scrollIntoView)m.scrollIntoView({block:"start"})}
function finishDay(n){
  if(!isDone(n))state.done.push(n);
  var msg="Day "+n+" done.";
  SONGS.forEach(function(s){if(s.gate===n)msg+=" <b>"+s.name+" is unlocked.</b>"});
  if(n===30)msg+=" That is the whole course. Compare your two recordings.";
  state.flash=msg;state.view="home";state.sel=n<30?n+1:30;
  stopTimer();stopMetro();stopPlayer();persist();render();scrollTop();
}
var RATE_TEXT={easy:"Noted. Tomorrow, aim for the “Too easy?” goal in every step and push the metronome up by 10.",
  ok:"Good. That is the level the course is aiming for.",
  hard:"Noted. Tomorrow, use the Replay step to redo today's Song step at the Slowly speed. Repeating a day is fine."};
function rateUI(n){
  var box=el("div","rate"),cur=state.fb[n]||{r:"",note:""};
  box.appendChild(el("p","qt","How was today?"));
  var row=el("div","actions"),out=el("p","fb",cur.r?RATE_TEXT[cur.r]:"");
  [["easy","Too easy"],["ok","About right"],["hard","Too hard"]].forEach(function(o){
    var b=el("button","ghost"+(cur.r===o[0]?" sel":""),o[1]);b.type="button";
    b.addEventListener("click",function(){cur.r=o[0];state.fb[n]=cur;Array.prototype.forEach.call(row.children,function(x){x.classList.remove("sel")});b.classList.add("sel");out.textContent=RATE_TEXT[o[0]];persist()});
    row.appendChild(b);
  });
  box.appendChild(row);box.appendChild(out);
  var lab=el("label","muted","Anything boring, confusing or missing? Your note is saved with your progress.");lab.setAttribute("for","note-"+n);
  var ta=el("textarea");ta.id="note-"+n;ta.rows=3;ta.value=cur.note||"";
  ta.addEventListener("change",function(){cur.note=ta.value.slice(0,2000);state.fb[n]=cur;persist()});
  box.appendChild(lab);box.appendChild(ta);
  return box;
}
function renderSession(){
  var box=document.getElementById("main");box.innerHTML="";
  var n=state.sel,day=DAYS[n-1];
  var total=day.steps.length+(day.quiz.length?1:0)+1,i=state.step;
  var dots=el("div","dots");for(var k=0;k<total;k++)dots.appendChild(el("i",k<i?"past":k===i?"now":""));
  box.appendChild(dots);
  var head=el("div","stephead");
  var isStep=i<day.steps.length,isQuiz=!isStep&&day.quiz.length&&i===day.steps.length;
  if(isStep){
    var s=day.steps[i];
    var left=el("div");left.appendChild(el("span","label","Day "+n+" · Step "+(i+1)+" of "+total+" · "+s.m+" min"));left.appendChild(el("h2","big",s.k));
    head.appendChild(left);head.appendChild(timerBtn(s.m));box.appendChild(head);
    var ol=el("ol","do");s.d.forEach(function(t){ol.appendChild(el("li",null,t))});box.appendChild(ol);
    s.demos.forEach(function(d){box.appendChild(demoUI(d))});
    if(s.ok)box.appendChild(el("p","check","<b>You have it when:</b> "+s.ok));
    if(s.more)box.appendChild(el("p","more","<b>Too easy?</b> "+s.more));
    if(day.bpm)box.appendChild(metroUI(day));
  }else if(isQuiz){
    var l2=el("div");l2.appendChild(el("span","label","Day "+n+" · Step "+(i+1)+" of "+total));l2.appendChild(el("h2","big","Ear and eye quiz"));
    head.appendChild(l2);box.appendChild(head);box.appendChild(quizUI(day));
  }else{
    var l3=el("div");l3.appendChild(el("span","label","Day "+n+" · Finished"));l3.appendChild(el("h2","big",day.type==="boss"?"Did you pass the key?":"Session complete"));
    head.appendChild(l3);box.appendChild(head);
    box.appendChild(el("p",null,day.type==="boss"?"Mark the day done only when you got through the 60 seconds without stopping. If not, try again tomorrow.":"<b>Today's goal:</b> "+day.goal));
    box.appendChild(rateUI(n));
  }
  var nav=el("div","actions");
  var back=el("button","ghost",i===0?"Leave session":"Back");back.type="button";
  back.addEventListener("click",function(){stopTimer();stopMetro();stopPlayer();if(i===0){state.view="home"}else{state.step--}render();scrollTop()});
  nav.appendChild(back);
  if(i<total-1){
    var next=el("button","primary",i===day.steps.length-1&&day.quiz.length?"Next: quiz":i===total-2?"Finish":"Next step");next.type="button";
    next.addEventListener("click",function(){stopTimer();stopMetro();stopPlayer();state.step++;render();scrollTop()});nav.appendChild(next);
  }else{
    var done=el("button","primary",day.type==="boss"?"I passed. Mark day "+n+" done":"Mark day "+n+" done");done.type="button";
    done.addEventListener("click",function(){finishDay(n)});nav.appendChild(done);
    if(day.type==="boss"){var later=el("button","ghost","Not yet");later.type="button";later.addEventListener("click",function(){state.view="home";render();scrollTop()});nav.appendChild(later)}
  }
  box.appendChild(nav);
}
function renderPlan(){
  var sb=document.getElementById("songs");sb.innerHTML="";
  SONGS.forEach(function(s){
    var open=s.gate===0||isDone(s.gate),c=el("div","song"+(open?" open":""));
    c.appendChild(el("span","state",open?"Unlocked":"Locked"));
    c.appendChild(el("span","name",s.name));
    c.appendChild(el("span","how",open?s.by+" · "+s.info:s.how));
    sb.appendChild(c);
  });
  var box=document.getElementById("plan");box.innerHTML="";var t=today();
  [[1,7,1],[8,14,2],[15,21,3],[22,28,4],[29,30,5]].forEach(function(r){
    var wk=el("div","week");wk.appendChild(el("span","label",WEEK_NAMES[r[2]]));
    for(var d=r[0];d<=r[1];d++){(function(d){
      var day=DAYS[d-1],locked=!weekOpen(day.w),done=isDone(d),isT=d===t&&!done;
      var b=el("button","drow"+(done?" done":"")+(isT?" today":"")+(locked?" locked":"")+(d===state.sel?" sel":""));b.type="button";
      b.appendChild(el("span","n",String(d)));
      b.appendChild(el("span",null,day.title+(day.type==="boss"?' <span class="muted">· unlock day</span>':"")));
      b.appendChild(el("span","st",done?"Done ✓":isT?"Today":locked?"Locked":""));
      b.addEventListener("click",function(){stopTimer();stopMetro();stopPlayer();state.sel=d;state.view="home";render();scrollTop()});
      wk.appendChild(b);
    })(d)}
    box.appendChild(wk);
  });
}
/* ---- one-time microphone check and tuning ---- */
function centsText(a4){
  var c=Math.round(1200*Math.log(a4/440)/Math.LN2);
  return Math.abs(c)<=4?"in tune (A = 440 Hz)":"A = "+a4.toFixed(1)+" Hz, "+Math.abs(c)+" cents "+(c<0?"flat":"sharp");
}
function renderMic(force){
  var box=document.getElementById("micbox");box.innerHTML="";
  var st=document.getElementById("micstate");
  if(st)st.textContent=state.mic.done?"Microphone check done. Your piano: "+centsText(state.mic.a4)+".":"The microphone check has not been run yet. Listening assumes A = 440 Hz until it has.";
  if(!window.Listen||(!force&&(state.mic.done||state.view!=="home")))return;
  var c=el("div","card");
  c.appendChild(el("span","label","One-time setup"));
  c.appendChild(el("h2",null,"Microphone check"));
  c.appendChild(el("p",null,"This site can listen to your piano and follow the notes you play. Put your phone or tablet on the music stand, then run the check. It takes about a minute."));
  var meter=el("div","meter"),bar=el("i");meter.appendChild(bar);meter.hidden=true;
  var out=el("p","fmsg muted","");out.setAttribute("aria-live","polite");
  var row=el("div","actions"),go=el("button","primary","Allow microphone"),skip=el("button","ghost","Skip for now");go.type=skip.type="button";
  var heard=[];
  function finish(a4,text){
    Listen.stop();listening=null;state.mic={a4:a4,done:true};persist();
    meter.hidden=true;row.innerHTML="";out.className="fmsg good";out.textContent=text;
    var ok=el("button","primary","Done");ok.type="button";ok.addEventListener("click",function(){renderMic(false)});row.appendChild(ok);
    if(st)st.textContent="Microphone check done. Your piano: "+centsText(a4)+".";
  }
  go.addEventListener("click",function(){
    stopListening();stopPlayer();stopMetro();
    var ac=audio();if(!ac){out.className="fmsg bad";out.textContent="This browser has no sound system for web pages.";return}
    go.disabled=true;out.className="fmsg muted";out.textContent="Starting the microphone…";
    Listen.start(ac,{a4:440,onFrame:function(f){
      bar.style.width=Math.min(100,f.rms*500)+"%";
      if(!f.valid)return;
      var n=Math.round(f.midi);
      if(n===69){heard.push(f.pitch);out.textContent="Hearing A. Keep it sounding…"}
      else{out.textContent="Hearing "+noteName(n)+". Looking for the A above middle C."}
      if(heard.length>=40){
        var s=heard.slice().sort(function(a,b){return a-b}),a4=Math.round(s[s.length>>1]*10)/10;
        finish(a4,"Your piano is "+centsText(a4)+". Listening is tuned to match.");
      }
    }}).then(function(){
      if(!c.isConnected){Listen.stop();return}
      listening={end:function(){Listen.stop()}};
      go.hidden=true;meter.hidden=false;
      out.textContent="Play any note: the bar should move. Then play the A above middle C a few times and let it ring.";
    }).catch(function(e){go.disabled=false;out.className="fmsg bad";out.textContent=Listen.errorText(e)});
  });
  skip.addEventListener("click",function(){finish(state.mic.a4||440,"Skipped. Listening assumes A = 440 Hz. You can run the check later from “Microphone and your data”.")});
  row.appendChild(go);row.appendChild(skip);
  c.appendChild(row);c.appendChild(meter);c.appendChild(out);
  c.appendChild(el("p","muted","The microphone is on only while listening is running. Sound is analysed on this device and is never uploaded or stored."));
  box.appendChild(c);
  if(force&&c.scrollIntoView)c.scrollIntoView({block:"start"});
}
/* ---- export and import of progress ---- */
function dataMsg(t,cls){var m=document.getElementById("datamsg");m.className="fmsg "+(cls||"muted");m.textContent=t}
function exportData(){
  var data={app:"piano-unlock",version:1,exported:new Date().toISOString(),done:state.done.slice().sort(function(a,b){return a-b}),fb:state.fb,mic:state.mic};
  var a=document.createElement("a"),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  a.href=url;a.download="piano-unlock-progress.json";document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url)},2000);
  dataMsg("Exported "+data.done.length+" finished days and "+Object.keys(data.fb).length+" day ratings.");
}
function importData(file){
  var r=new FileReader();
  r.onload=function(){
    try{
      var d=JSON.parse(r.result);
      if(!d||d.app!=="piano-unlock"||!Array.isArray(d.done))throw new Error("format");
      state.done=d.done.filter(function(n){return n===Math.floor(n)&&n>=1&&n<=30});
      state.fb=d.fb&&typeof d.fb==="object"?d.fb:{};
      if(d.mic&&d.mic.a4>400&&d.mic.a4<480)state.mic={a4:+d.mic.a4,done:!!d.mic.done};
      persist();state.sel=today();state.view="home";render();
      dataMsg("Loaded "+state.done.length+" finished days.","good");
    }catch(e){dataMsg("That file is not a Piano Unlock progress file. Nothing was changed.","bad")}
  };
  r.onerror=function(){dataMsg("The file could not be read.","bad")};
  r.readAsText(file);
}
document.getElementById("micagain").addEventListener("click",function(){renderMic(true)});
document.getElementById("exportbtn").addEventListener("click",exportData);
document.getElementById("importbtn").addEventListener("click",function(){document.getElementById("importfile").click()});
document.getElementById("importfile").addEventListener("change",function(e){if(e.target.files[0])importData(e.target.files[0]);e.target.value=""});

function render(){stopListening();mountQ=[];renderHeader();renderIntro();renderMic(false);if(state.view==="session")renderSession();else renderHome();renderPlan();var q=mountQ;mountQ=[];q.forEach(function(f){f()})}
render();
