/* Run with: node test/listen.test.js */
var Listen=require("../js/listen.js"),synth=require("./synth.js");
var R=[[["D5",1],["G4",.5],["A4",.5],["B4",.5],["C5",.5]],[["D5",1],["G4",1],["G4",1]],[["E5",1],["C5",.5],["D5",.5],["E5",.5],["F#5",.5]],[["G5",1],["G4",1],["G4",1]],
       [["C5",1],["D5",.5],["C5",.5],["B4",.5],["A4",.5]],[["B4",1],["C5",.5],["B4",.5],["A4",.5],["G4",.5]],[["F#4",1],["G4",.5],["A4",.5],["B4",.5],["G4",.5]],[["A4",3]]];
var minuet=[].concat.apply([],R);
function run(events,o,trackerOpts){
  var a=synth.render(events,o),tr=new Listen.NoteTracker(trackerOpts||{}),hop=Math.round(a.sr/60),got=[];
  for(var end=2048;end<=a.samples.length;end+=hop){
    var r=tr.push(a.samples.subarray(end-2048,end),a.sr,end/a.sr*1000);
    if(r.note!==null)got.push(r.note);
  }
  return got;
}
var fails=0;
function check(name,events,o,trackerOpts){
  var want=events.filter(function(e){return e[0]}).map(function(e){return synth.midi(e[0])}),got=run(events,o,trackerOpts);
  var ok=want.join()===got.join();if(!ok)fails++;
  console.log((ok?"ok   ":"FAIL ")+name+(ok?" ("+got.length+" notes)":"\n  want "+want.join(" ")+"\n  got  "+got.join(" ")));
}
check("Minuet bars 1-8 at 72",minuet,{bpm:72});
check("Minuet at 110 (fast)",minuet,{bpm:110});
check("Minuet, notes ring on (legato)",minuet,{bpm:72,overlap:0.5});
check("Minuet at 44.1 kHz",minuet,{bpm:72,sr:44100});
check("Minuet, noisy room",minuet,{bpm:72,noise:0.012});
check("Minuet, quiet playing",minuet,{bpm:72,gain:0.06,noise:0.002});
check("Piano 30 cents flat, calibrated",minuet,{bpm:72,a4:432.4},{a4:432.4});
check("Octave leaps and repeats",[["G4",1],["G5",1],["G4",1],["G4",1],["G4",1],["D4",1],["D5",1],["B5",1]],{bpm:80});
check("Low right-hand range",[["D4",.5],["E4",.5],["F#4",.5],["G4",.5],["A4",.5],["B4",.5],["C4",1],["C4",1]],{bpm:72});
check("12/8 roll on A flat",[["Ab4",1/3],["C5",1/3],["Eb5",1/3],["Ab4",1/3],["C5",1/3],["Eb5",1/3],["Ab4",1/3],["Db5",1/3],["F5",1/3]],{bpm:46});
var long=[];for(var k=0;k<12;k++)long=long.concat(minuet);
check("Three minutes without a pause (pedal held)",long,{bpm:110,overlap:0.6});
var silent=run([[null,8]],{noise:0.01});
if(silent.length){fails++;console.log("FAIL silence produced notes: "+silent.join(" "))}else console.log("ok   silence stays silent");
process.exit(fails?1:0);
