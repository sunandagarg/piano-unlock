/* Course content: songs, the 30 days, quizzes and context. Minuet in G is public domain;
   the pop songs are taught as chords and patterns only, never reproduced. */
/* ================= content ================= */
var SONGS=[
 {name:"Minuet in G",by:"Petzold",info:"G major, 3/4",gate:0,how:"Open from day 1"},
 {name:"Drops of Jupiter",by:"Train",info:"C major",gate:6,how:"Key on day 6: switch C, G, F in time"},
 {name:"This Year's Love",by:"David Gray",info:"A♭ major, 12/8",gate:13,how:"Key on day 13: steady pulse over a rocking bass"},
 {name:"Let It Be",by:"The Beatles",info:"C major, 4/4",gate:20,how:"Key on day 20: find chords by ear"},
 {name:"Love Song",by:"Sara Bareilles",info:"Bonus",gate:30,how:"Opens after day 30"}
];
var WEEK_NAMES={1:"Week 1 · Minuet in G",2:"Week 2 · Drops of Jupiter",3:"Week 3 · This Year's Love",4:"Week 4 · Let It Be",5:"Finish"};
var WEEK_GATE={1:0,2:6,3:13,4:20,5:20};
var WEEK_NEED={1:"A piano or keyboard and your phone. Every note is shown below, so a score is optional.",
 2:"Your chord chart for Drops of Jupiter and the recording.",
 3:"Your chord chart for This Year's Love and the recording.",
 4:"Your chord chart for Let It Be and the recording.",
 5:"Your charts and your phone for recording."};

/* Minuet in G, bars 1-16 (public domain; checked against the Mutopia edition) */
var R1=[["D5",1],["G4",.5],["A4",.5],["B4",.5],["C5",.5]],R2=[["D5",1],["G4",1],["G4",1]],
    R3=[["E5",1],["C5",.5],["D5",.5],["E5",.5],["F#5",.5]],R4=[["G5",1],["G4",1],["G4",1]],
    R5=[["C5",1],["D5",.5],["C5",.5],["B4",.5],["A4",.5]],R6=[["B4",1],["C5",.5],["B4",.5],["A4",.5],["G4",.5]],
    R7=[["F#4",1],["G4",.5],["A4",.5],["B4",.5],["G4",.5]],R8=[["A4",3]],
    R15=[["A4",1],["B4",.5],["A4",.5],["G4",.5],["F#4",.5]],R16=[["G4",3]];
var L1=[[["G3","B3","D4"],2],["A3",1]],L2=[["B3",3]],L3=[["C4",3]],L4=[["B3",3]],L5=[["A3",3]],L6=[["G3",3]],
    L7=[["D4",1],["B3",1],["G3",1]],L8=[["D4",1],["D3",.5],["C4",.5],["B3",.5],["A3",.5]];
var R3nat=[["E5",1],["C5",.5],["D5",.5],["E5",.5],["F5",.5]];
var L9=[["B3",2],["A3",1]],L10=[["G3",1],["B3",1],["G3",1]],L11=[["C4",3]],L12=[["B3",1],["C4",.5],["B3",.5],["A3",.5],["G3",.5]],
    L13=[["A3",2],["F#3",1]],L14=[["G3",2],["B3",1]],L15=[["C4",1],["D4",1],["D3",1]],L16=[["G3",2],["G2",1]];
var R17=[["B5",1],["G5",.5],["A5",.5],["B5",.5],["G5",.5]],R18=[["A5",1],["D5",.5],["E5",.5],["F#5",.5],["D5",.5]],
    R19=[["G5",1],["E5",.5],["F#5",.5],["G5",.5],["D5",.5]],R20=[["C#5",1],["B4",.5],["C#5",.5],["A4",1]],
    R21=[["A4",.5],["B4",.5],["C#5",.5],["D5",.5],["E5",.5],["F#5",.5]],R22=[["G5",1],["F#5",1],["E5",1]],
    R23=[["F#5",1],["A4",1],["C#5",1]],R24=[["D5",3]];
var L17=[["G3",3]],L18=[["F#3",3]],L19=[["E3",1],["G3",1],["E3",1]],L20=[["A3",2],["A2",1]],L21=[["A3",3]],
    L22=[["B3",1],["D4",1],["C#4",1]],L23=[["D4",1],["F#3",1],["A3",1]],L24=[["D4",1],["D3",1],["C4",1]];
var R25=[["D5",1],["G4",.5],["F#4",.5],["G4",1]],R26=[["E5",1],["G4",.5],["F#4",.5],["G4",1]],R27=[["D5",1],["C5",1],["B4",1]],
    R28=[["A4",.5],["G4",.5],["F#4",.5],["G4",.5],["A4",1]],R29=[["D4",.5],["E4",.5],["F#4",.5],["G4",.5],["A4",.5],["B4",.5]],
    R30=[["C5",1],["B4",1],["A4",1]],R31=[["B4",.5],["D5",.5],["G4",1],["F#4",1]],R32=[["G4",3]];
var L25=[["B3",1],[["B3","D4"],2]],L26=[["C4",1],[["C4","E4"],2]],L27=[["B3",1],["A3",1],["G3",1]],L28=[["D4",2],[null,1]],
    L29=[["D3",2],[["D3","F#3"],1]],L30=[["E3",1],["G3",1],["F#3",1]],L31=[["G3",1],["B2",1],["D3",1]],L32=[["G3",1],["D3",1],["G2",1]];


function mel(label,bpm,lo,oct,rh,lh,o){o=o||{};return {t:"mel",label:label,bpm:bpm,lo:lo,oct:oct,rh:rh||null,lh:lh||null,meter:o.meter||"4/4",key:o.key||"C"}}
function mn(label,bpm,lo,oct,rh,lh){return mel(label,bpm,lo,oct,rh,lh,{meter:"3/4",key:"G"})}
function ch(label,lo,oct,chords){return {t:"ch",label:label,lo:lo,oct:oct,chords:chords}}

/* chord shapes */
var C=["C4","E4","G4"],G=["B3","D4","G4"],F=["C4","F4","A4"],Am=["C4","E4","A4"];
var Gg=["G4","B4","D5"],Cg=["G4","C5","E5"],Dg=["F#4","A4","D5"];
var Ab=["Ab4","C5","Eb5"],Db=["Ab4","Db5","F5"],Eb=["G4","Bb4","Eb5"];
function rep(c,n,b,l){var a=[];for(var i=0;i<n;i++)a.push([c,b,l]);return a}
function roll(c){var a=[];for(var i=0;i<4;i++){a.push([c[0],1/3],[c[1],1/3],[c[2],1/3])}return a}

var LAZY=ch("Lazy shapes in C. Tap a chord to see and hear it.",3,2,[["C",C],["G",G],["F",F]]);
var LAZY4=ch("Four lazy shapes. Tap each one.",3,2,[["C",C],["Am",Am],["F",F],["G",G]]);
var P1=mel("Pattern 1, held chords. A practice loop of C, G, F, F.",80,2,3,
  [[[C,4,"C"]],[[G,4,"G"]],[[F,4,"F"]],[[F,4,"F"]]],[[["C3",4]],[["G2",4]],[["F2",4]],[["F2",4]]]);
var P2=mel("Pattern 2, pulse. Same loop.",80,2,3,
  [rep(C,4,1,"C"),rep(G,4,1,"G"),rep(F,4,1,"F"),rep(F,4,1,"F")],[[["C3",4]],[["G2",4]],[["F2",4]],[["F2",4]]]);
var P3=mel("Pattern 3, rocking bass. Left hand moves, right hand holds.",80,2,3,
  [[[C,4,"C"]],[[G,4,"G"]],[[F,4,"F"]]],
  [[["C3",1],["G3",1],["C3",1],["G3",1]],[["G2",1],["D3",1],["G2",1],["D3",1]],[["F2",1],["C3",1],["F2",1],["C3",1]]]);
var P4=mel("Pattern 4, the push. The new chord arrives half a beat early.",76,2,3,
  [[[C,1,"C"],[C,1,"C"],[C,1,"C"],[C,.5,"C"],[G,.5,"G!"]],[[G,4,"G"]],[[G,1,"G"],[G,1,"G"],[G,1,"G"],[G,.5,"G"],[F,.5,"F!"]],[[F,4,"F"]]],
  [[["C3",2],["C3",1],["C3",.5],["G2",.5]],[["G2",4]],[["G2",2],["G2",1],["G2",.5],["F2",.5]],[["F2",4]]]);
var P5=mel("Pattern 5, the roll, on G, C and D. Four beats, three notes each.",46,3,3,
  [roll(Gg),roll(Cg),roll(Dg)],[[["G3",4]],[["C3",4]],[["D3",4]]],{meter:"12/8",key:"G"});
var P5ab=mel("The roll on A♭, D♭ and E♭.",46,3,3,
  [roll(Ab),roll(Db),roll(Eb)],[[["Ab3",4]],[["Db3",4]],[["Eb3",4]]],{meter:"12/8",key:"Ab"});
var P6=mel("Pattern 6, octave and offbeat.",66,2,3,
  [[[null,1],[C,1,"C"],[null,1],[C,1,"C"]],[[null,1],[G,1,"G"],[null,1],[G,1,"G"]]],
  [[[["C2","C3"],2],[["C2","C3"],2]],[[["G2","G3"],2],[["G2","G3"],2]]]);
var VERSE=mel("Verse in numbers: I V vi IV, then I V IV I. Two chords per bar.",66,2,3,
  [[[C,2,"C"],[G,2,"G"]],[[Am,2,"Am"],[F,2,"F"]],[[C,2,"C"],[G,2,"G"]],[[F,2,"F"],[C,2,"C"]]],
  [[["C3",2],["G2",2]],[["A2",2],["F2",2]],[["C3",2],["G2",2]],[["F2",2],["C3",2]]]);
var WALK=mel("The walk-down: bass F, E, D, C under two alternating shapes.",66,2,3,
  [[[F,1,"F"],[C,1,"C/E"],[F,1,"Dm7"],[C,1,"C"]]],[[["F3",1],["E3",1],["D3",1],["C3",1]]]);

function S(k,m,d,demos,ok,more){return {k:k,m:m,d:d,demos:demos||[],ok:ok||"",more:more||""}}
function mc(q,opts,a,why,play){return {type:"mc",q:q,opts:opts,a:a,why:why,play:play||null}}
function tap(q,notes,ordered,why){return {type:"tap",q:q,tap:notes,ordered:!!ordered,why:why}}
function echo(q,play,why){return {type:"echo",q:q,play:play,why:why}}
function spot(q,score,idx,wrong,why){return {type:"spot",q:q,score:score,idx:idx,wrong:wrong,why:why}}
function pick(q,play,options,a,why){return {type:"pick",q:q,play:play,options:options,a:a,why:why}}

var DAYS=[
/* ---------- Week 1 ---------- */
{w:1,type:"practice",title:"Both hands from day one",goal:"You can play each hand of bars 1 to 8, and bars 1 to 4 with hands together.",bpm:66,meter:"3/4",steps:[
 S("Baseline",3,["Open your phone's voice memo app.","Record 60 seconds of anything you can play. One take.","Keep the recording. You compare it with day 30."]),
 S("Song",13,["Press Play and follow the notation. The top staff is the right hand, the bottom staff the left.","Right hand alone, bars 1 to 8. Three coins on each two-bar pair.","Left hand alone, bars 1 to 8. It is mostly one long note per bar, so this goes quickly.","Hands together, bars 1 to 4, slowly. Three coins."],
   [mn("Minuet in G, bars 1 to 8",72,2,4,[R1,R2,R3,R4,R5,R6,R7,R8],[L1,L2,L3,L4,L5,L6,L7,L8])],
   "You can play bars 1 to 4 hands together three times in a row without stopping, at any tempo.",
   "Join all eight bars hands together today, with the metronome at 66."),
 S("Game: the scale hiding in the tune",6,["Look at bars 1 to 4 below. Bars 1 and 2 climb G A B C D. Bars 3 and 4 climb C D E F♯ G. Together that is the G major scale.","The single sharp in the key signature is that F♯.","Transposition dare: play bars 1 and 2 starting on G instead of D, on white keys only. Work it out by ear.","Check yourself with the second example. You have just moved the tune from G major to C major."],
   [mn("Bars 1 to 4, right hand",80,4,2,[R1,R2,R3,R4]),
    mel("Check: bars 1 and 2 moved to C major",80,4,2,[[["G4",1],["C4",.5],["D4",.5],["E4",.5],["F4",.5]],[["G4",1],["C4",1],["C4",1]]],null,{meter:"3/4",key:"C"})],
   "Your version matches the check example."),
 S("Free play",3,["Left hand holds a low G.","Right hand makes up a four-bar tune from the scale, in the minuet's rhythm.","End on G and notice that it sounds finished."])],
 quiz:[echo("Echo. Listen to five notes from bar 5, then play them back on the keys. The first note is a C.",mn("",80,4,2,[R5]),"C, then D C B A stepping down. That is bar 5."),
       spot("Spot the wrong note. Press Listen, follow bars 3 and 4, then tap the note that was played wrong.",mn("",76,4,2,[R3,R4]),4,"F5","The fifth note should be F♯. Played as F natural it stops pulling towards G."),
       pick("Listen. Which bar did you hear?",mn("",80,4,2,[R6]),[mn("",80,4,2,[R5]),mn("",80,4,2,[R6]),mn("",80,4,2,[R7])],1,"Bar 6: B, then C B A G stepping down.")]},
{w:1,type:"practice",title:"Three chords run the show",goal:"You can play bars 1 to 8 with both hands and name the three chords underneath.",bpm:66,meter:"3/4",steps:[
 S("Replay",3,["Bars 1 to 4, hands together.","Left hand, bars 5 to 8."]),
 S("Song",12,["Hands together on bars 5 and 6, then bars 7 and 8. Three coins each.","Join bars 1 to 8. If the move from bar 4 to bar 5 trips you, loop only those two bars.","Metronome at 66. Three coins on the whole phrase."],
   [mn("Minuet in G, bars 1 to 8",72,2,4,[R1,R2,R3,R4,R5,R6,R7,R8],[L1,L2,L3,L4,L5,L6,L7,L8])],
   "Eight bars in a row with the metronome and no stops.",
   "Raise the metronome to 80. Then play it again with the left hand clearly softer than the right."),
 S("Game: chord detective",7,["Bar 1's left hand stacks G, B and D: a G chord. Bar 3 sits on C. Bar 8 lands on D.","Tap the three chords below and play each on your piano.","Play bars 1 to 4 with the right hand while the left hand holds just these chords: G, G, C, G.","Counting up from G, they are chords I, IV and V. Almost all of this piece is built from them."],
   [ch("The three chords of G major",4,2,[["G (I)",["G4","B4","D5"]],["C (IV)",["C5","E5","G5"]],["D (V)",["D5","F#5","A5"]]])],
   "You can say which chord sits under bars 1, 3 and 8 without looking."),
 S("Free play",3,["Play bars 1 and 2 as a question.","Improvise a two-bar answer that ends on G.","Find three different answers and keep the best."])],
 quiz:[echo("Echo. Three falling notes, starting on D. Play them back.",mn("",70,4,2,[[["D5",1],["B4",1],["G4",1]]]),"D, B, G: a G chord played downwards. The left hand does exactly this in bar 7."),
       mc("Listen to two chords. Does the second one feel like home or away?",["Home","Away"],1,"It goes G to D, from I to V. Chord V always sounds like it wants to return.",mel("",60,4,2,[[[["G4","B4","D5"],2],[["F#4","A4","D5"],2]]])),
       tap("Tap the three notes of chord IV in G major.",["C","E","G"],false,"Chord IV in G is C: C, E and G.")]},
{w:1,type:"practice",title:"Same tune, new ending",goal:"You can play bars 9 to 16 with both hands.",bpm:66,meter:"3/4",steps:[
 S("Replay",3,["Bars 1 to 8, hands together, with the metronome."]),
 S("Song",12,["Listen to bars 9 to 16. The right hand repeats bars 1 to 6 and then ends differently.","The left hand is busier this time. Play it alone first.","Hands together, two bars at a time, three coins each.","Join bars 9 to 16."],
   [mn("Minuet in G, bars 9 to 16",72,2,4,[R1,R2,R3,R4,R5,R6,R15,R16],[L9,L10,L11,L12,L13,L14,L15,L16])],
   "Bars 9 to 16 hands together, slowly, without stopping.",
   "Play bars 1 to 16 straight through at 72. That is the complete first half."),
 S("Game: F sharp on trial",7,["Press Play on the first example: bars 3 and 4 with F natural. Look for the natural sign in the notation.","Press Play on the second: the real version. The F♯ leans into G.","Play both yourself. That pull is why G major carries one sharp in its key signature."],
   [mn("Wrong: with F natural",80,4,2,[R3nat,R4]),mn("Right: with F♯",80,4,2,[R3,R4])]),
 S("Free play",3,["Improvise on the G scale.","Rest on F♯ for a moment each time, then resolve up to G."])],
 quiz:[pick("Listen. Is this the halfway ending or the final ending?",mn("",76,4,2,[R15,R16]),[mn("",76,4,2,[R7,R8]),mn("",76,4,2,[R15,R16])],1,"The final ending lands on G, the home note. The halfway ending stops on A, which is left hanging."),
       spot("Spot the wrong note in bars 13 and 14. Listen, then tap it.",mn("",76,4,2,[R5,R6]),2,"C#5","The third note should be a plain C. C♯ does not belong to G major."),
       mc("How many sharps are in the key signature of G major?",["None","One","Two"],1,"One: F♯.")]},
{w:1,type:"practice",title:"A visit to D major",goal:"You can play the right hand of bars 17 to 24 and hear the music change key.",bpm:66,meter:"3/4",steps:[
 S("Replay",3,["Bars 1 to 16, once through."]),
 S("Song",12,["Listen to bars 17 to 24. The tune starts high and a new note appears: C♯.","Right hand alone, three coins per two-bar pair.","Left hand alone.","Hands together, bars 17 to 20."],
   [mn("Minuet in G, bars 17 to 24",72,2,4,[R17,R18,R19,R20,R21,R22,R23,R24],[L17,L18,L19,L20,L21,L22,L23,L24])],
   "Right hand through bars 17 to 24 without stopping, and bars 17 to 20 hands together slowly.",
   "Hands together all the way to bar 24."),
 S("Game: the intruder",7,["Find the first sharp sign in the notation. It is a C♯, in bar 20.","From there to bar 24 the music is in D major, which is chord V of G.","Play bars 20 to 24 with the right hand and stop on the long D. It sounds like a new home.","In bar 24 the left hand ends on a plain C. That one note cancels D major and points back to G."],
   [mn("Bars 20 to 24",72,2,4,[R20,R21,R22,R23,R24],[L20,L21,L22,L23,L24])],
   "You can point to the bar where the key changes and the note that changes it back."),
 S("Free play",3,["Improvise in D major: the G scale, but with C♯ instead of C.","End on D."])],
 quiz:[mc("From bar 20 the music visits which key?",["C major","D major","E minor"],1,"D major, the V of G. Pieces very often travel to their V and back."),
       spot("Spot the wrong note in bars 20 and 21. Listen, then tap it.",mn("",72,4,2,[R20,R21]),0,"C5","The first note should be C♯. Without it the music never leaves G major."),
       echo("Echo. Three notes stepping down from a high G. Play them back.",mn("",70,4,2,[R22]),"G, F♯, E: bar 22.")]},
{w:1,type:"practice",title:"Moving house",goal:"You can play bars 17 to 24 with both hands, and the three chords in a new key.",bpm:72,meter:"3/4",steps:[
 S("Replay",3,["Bars 1 to 16."]),
 S("Song",12,["Hands together, bars 21 to 24. Three coins.","Join bars 17 to 24.","Play bars 1 to 24 straight through, slowly. If you slip, keep going."],
   [mn("Minuet in G, bars 17 to 24",72,2,4,[R17,R18,R19,R20,R21,R22,R23,R24],[L17,L18,L19,L20,L21,L22,L23,L24]),
    mn("Stretch: bars 25 to 32",72,2,4,[R25,R26,R27,R28,R29,R30,R31,R32],[L25,L26,L27,L28,L29,L30,L31,L32])],
   "Bars 17 to 24 hands together without stopping.",
   "Learn bars 25 to 32 from the second example and you have the whole piece. The left hand of bars 25, 26 and 29 is slightly simplified here."),
 S("Game: moving house",7,["In G, chords I, IV and V are G, C and D.","Count up from C instead and they are C, F and G. Tap them below.","These are lazy shapes: the hand barely moves between them.","Play C, F, G, C on your piano until you can do it without looking."],
   [LAZY]),
 S("Free play",3,["Tomorrow's key uses these chords in time.","Try four beats each at 80: C, G, F, F."])],
 quiz:[mc("Listen to four chords. Which order was it?",["C, F, G, C","C, G, F, C"],0,"I, IV, V, I: out through F and G, then home.",mel("",70,3,2,[[[C,2],[F,2]],[[G,2],[C,2]]])),
       tap("Tap chord IV in the key of C.",["F","A","C"],false,"C is 1, D is 2, E is 3, F is 4. The F chord is F, A, C."),
       mc("In G, chords I, IV, V are G, C, D. What are they in C?",["C, F, G","C, D, E","C, E, G"],0,"Count up from C: 1 is C, 4 is F, 5 is G.")]},
{w:1,type:"boss",title:"Minuet on record",goal:"You have a recording of the first half and the key to Drops of Jupiter.",bpm:80,meter:"4/4",steps:[
 S("Warm up",3,["Bars 1 to 16 once, slowly."]),
 S("Record",10,["Record bars 1 to 16, hands together.","Up to three takes. Keep the best.","A steady slow take beats a fast shaky one."],
   [mn("Minuet in G, bars 1 to 16",72,2,4,[R1,R2,R3,R4,R5,R6,R7,R8,R1,R2,R3,R4,R5,R6,R15,R16],[L1,L2,L3,L4,L5,L6,L7,L8,L9,L10,L11,L12,L13,L14,L15,L16])],
   "One take of 16 bars that never stops.",
   "Record the whole piece, all 32 bars."),
 S("The key",7,["This unlocks Drops of Jupiter.","Start the metronome at 80 in 4/4 and start the timer.","Right hand plays C, G, F, F, four beats each, looping for 60 seconds.","Look at the wall, not at your hands. You pass if you never stop.","Most people need two or three goes."],
   [P1]),
 S("Listen",5,["Listen to today's recording.","Then listen to your baseline from day 1."])],
 quiz:[mc("Which note do the lazy shapes of C (C E G) and G (B D G) share?",["C","E","G"],2,"G stays on top in both. Keep that finger down."),
       mc("Listen. Which change is this?",["C to F","C to G"],1,"The top note stayed and the lower two dropped: that is C to G.",mel("",60,3,2,[[[C,2],[G,2]]]))]},
{w:1,type:"rest",title:"Rest",goal:"No piano today.",steps:[
 S("Optional listening",10,["Listen to Drops of Jupiter twice.","Tap the slow pulse on your knee.","Lift a finger each time the chord changes."])],quiz:[]},
/* ---------- Week 2 ---------- */
{w:2,type:"practice",title:"Lazy hands",goal:"You can play the verse with held chords.",bpm:66,meter:"4/4",steps:[
 S("Replay",3,["Yesterday's key: C, G, F, F for 60 seconds."]),
 S("Song",12,["Listen to Pattern 1 below: right hand chord, left hand one low note, both held.","Open your chord chart at the verse.","Play each chord in the chart this way and hold it until the chart shows the next one.","Use the lazy shapes for C, G and F. Metronome at 66."],
   [P1,LAZY]),
 S("Game: which finger stays?",7,["Tap C, then F. Your thumb stays on C.","Tap C, then G. Your little finger stays on G.","Play the changes and say the staying note out loud each time.","This shared note is called a common tone."],
   [LAZY]),
 S("Play along",3,["Play the first verse along with the recording, held chords only."])],
 quiz:[mc("Which note stays when C (C E G) moves to F (C F A)?",["C","E","G"],0,"C is in both chords. Leave your thumb on it."),
       tap("Tap the lazy G shape.",["B","D","G"],false,"B D G: the G chord with B at the bottom, right next to C E G."),
       mc("In Pattern 1, when do you play the next chord?",["On every beat","When the chart changes chord","Whenever you like"],1,"Held chords: play once and hold until the next change.")]},
{w:2,type:"practice",title:"The pulse",goal:"You can keep a steady pulse through verse and chorus.",bpm:72,meter:"4/4",steps:[
 S("Replay",3,["The verse with held chords."]),
 S("Song",12,["Listen to Pattern 2: the right hand repeats the chord on every click.","Play the verse from your chart this way. Left hand still holds one note.","Then the chorus. Start at 66 and move to 76 when it is even."],
   [P2]),
 S("Game: numbers travel",7,["In C the song's main chords are I (C), V (G) and IV (F).","The same numbers in G are G, D and C. Tap them below.","Play I, V, IV in C, then in G. It is the same music in a new key."],
   [ch("I, V, IV in the key of G",4,2,[["G (I)",Gg],["D (V)",Dg],["C (IV)",Cg]])]),
 S("Sing",3,["Ladder step 2: go back to held chords and hum the verse melody over them."])],
 quiz:[mc("In the key of C, which chord is V?",["F","G","Am"],1,"C D E F G: G is the fifth."),
       mc("I, V, IV in C is C, G, F. What is it in G?",["G, D, C","G, C, D","G, A, B"],0,"Count from G: 5 is D, 4 is C.")]},
{w:2,type:"practice",title:"The sad twin",goal:"Your left hand can move while the right hand holds, and you know the vi chord.",bpm:72,meter:"4/4",steps:[
 S("Replay",3,["The verse with pulse."]),
 S("Song",12,["Listen to Pattern 3: the left hand alternates the root and the note five above it.","Practise the left hand alone on C, G and F.","Add held chords in the right hand. Then play the verse from your chart."],
   [P3]),
 S("Game: one finger changes everything",7,["Tap C. Then tap Am. Only the top note moved, from G to A.","A minor is chord vi, the relative minor of C: its sad twin.","Loop the four shapes on your piano: C, Am, F, G."],
   [LAZY4]),
 S("Free play",3,["Find any chord in your chart that is not C, G or F.","Practise the bar before it and the bar after it."])],
 quiz:[tap("Tap the three notes of A minor.",["A","C","E"],false,"A C E. It shares C and E with the C chord."),
       mc("Listen. Is this chord major or minor?",["Major","Minor"],1,"That was A minor.",mel("",60,3,2,[[[Am,3]]])),
       mc("In the key of C, which number is A minor?",["ii","IV","vi"],2,"A is the sixth note of the C scale. Small numerals mean minor.")]},
{w:2,type:"practice",title:"The push",goal:"You can change chord half a beat early, the way pop players do.",bpm:72,meter:"4/4",steps:[
 S("Replay",3,["The verse with rocking bass."]),
 S("Song",12,["Listen to Pattern 4. The chips marked ! are the early chords.","Count 1 and 2 and 3 and 4 and. Play the new chord on the last \"and\" and hold it.","Practise C to G only until it feels like leaning forward.","Use it once per line in the verse."],
   [P4]),
 S("Game: speak it",7,["Ladder step 3: speak the verse lyrics in rhythm over the pulse.","If your hands stall when your mouth moves, drop to held chords for that line and carry on."]),
 S("Sing",3,["Sing the verse properly over held chords."])],
 quiz:[mc("In the push, when does the new chord arrive?",["Half a beat early","Exactly on beat 1","Half a beat late"],0,"On the \"and\" before the bar line."),
       mc("Your hands stall while you speak the lyrics. What do you do?",["Stop and restart","Drop to held chords for that line","Play faster"],1,"Simplify the hands and keep the voice going.")]},
{w:2,type:"practice",title:"Whole song, simple",goal:"You can play the song from start to finish without stopping.",bpm:76,meter:"4/4",steps:[
 S("Replay",3,["The chorus with pulse."]),
 S("Song",12,["Write the song's map on paper from your chart: intro, verse, chorus, bridge, and the number of bars in each.","Play start to finish. Held chords in verses, pulse in choruses.","No-stop rule: if you get lost, hold the last chord and rejoin at the next line."]),
 S("Game: colour note",7,["Tap C, then Csus4, then C again. One finger lifts from E to F and drops back.","Do the same with G and Gsus4.","Add one of these at the end of a line where a chord lasts a long time."],
   [ch("Sus4: one borrowed note",3,2,[["C",C],["Csus4",["C4","F4","G4"]],["G",G],["Gsus4",["C4","D4","G4"]]])]),
 S("Sing",3,["Ladder step 4 on your favourite section."])],
 quiz:[tap("Tap Csus4.",["C","F","G"],false,"C F G. The E has been lifted to F."),
       mc("You are lost in the middle of the song. What does the no-stop rule say?",["Go back to the start","Hold the last chord and rejoin at the next line","Stop and find your place"],1,"Keeping time matters more than any single chord.")]},
{w:2,type:"boss",title:"Drops of Jupiter on record",goal:"You have a recording of a verse and chorus and the key to This Year's Love.",bpm:76,meter:"4/4",steps:[
 S("Warm up",3,["Verse with held chords, humming."]),
 S("Record",10,["Record one verse and one chorus, singing.","Up to three takes.","Use whichever patterns let you keep going."]),
 S("The key",7,["This unlocks This Year's Love.","Metronome at 76. Start the timer.","Right hand pulses C, Am, F, G, four clicks each.","Left hand rocks root and fifth underneath. Count the beats out loud.","You pass after 60 seconds without stopping."],
   [mel("The key: pulse over rocking bass",76,2,3,
     [rep(C,4,1,"C"),rep(Am,4,1,"Am"),rep(F,4,1,"F"),rep(G,4,1,"G")],
     [[["C3",1],["G3",1],["C3",1],["G3",1]],[["A2",1],["E3",1],["A2",1],["E3",1]],[["F2",1],["C3",1],["F2",1],["C3",1]],[["G2",1],["D3",1],["G2",1],["D3",1]]])]),
 S("Listen",5,["Listen back.","Write down one thing that sounds good and one bar to fix."])],
 quiz:[mc("Rocking bass under an F chord uses which two notes?",["F and A","F and C","F and G"],1,"Root and fifth: F and C."),
       tap("Tap the roots of C, Am, F, G in order.",["C","A","F","G"],true,"C, A, F, G.")]},
{w:2,type:"rest",title:"Rest",goal:"No piano today.",steps:[
 S("Optional listening",10,["Listen to This Year's Love.","Sway on the four slow beats.","Count 1-2-3 inside each beat."])],quiz:[]},
/* ---------- Week 3 ---------- */
{w:3,type:"practice",title:"Four beats, three notes each",goal:"You can play the rolling feel of 12/8.",bpm:46,meter:"12/8",steps:[
 S("Replay",3,["The Drops of Jupiter verse, to keep it alive."]),
 S("Song",12,["Listen to Pattern 5, the roll: bottom, middle, top, four times per bar.","Start the metronome in 12/8 at 46. Loud clicks are beats, soft ticks split each beat in three.","Roll the G chord for four bars. Left hand holds a low G.","Then C, then D. Three coins means four bars on each chord with no bump."],
   [P5]),
 S("Game: waltz or roll?",7,["Play bars 1 and 2 of the Minuet counting 1 2 3.","Play the roll counting 1-2-3, 2-2-3, 3-2-3, 4-2-3.","The Minuet has three beats in a bar. The roll has four beats, each split in three.","That is the difference between 3/4 and 12/8. Clap both."],
   [mn("3/4: the Minuet",80,4,2,[R1,R2])]),
 S("Free play",3,["Roll through any chords you like, slowly."])],
 quiz:[mc("How many main beats are in a bar of 12/8?",["3","4","12"],1,"Four beats. The 12 counts the small ticks."),
       mc("Each beat in 12/8 splits into how many?",["2","3","4"],1,"Three, which gives the rolling feel."),
       mc("Listen. Is this 3/4 or 12/8?",["3/4","12/8"],1,"Four groups of three: 12/8.",mel("",46,4,2,[roll(Gg)]))]},
{w:3,type:"practice",title:"Clean pedal",goal:"You can roll the verse in G with clean pedal changes.",bpm:46,meter:"12/8",steps:[
 S("Replay",3,["The roll on G, C and D."]),
 S("Song",12,["Your chart is in A♭. Write a number over each chord: A♭ is I, B♭m is ii, Cm is iii, D♭ is IV, E♭ is V, Fm is vi.","For today, play those numbers in G: I is G, ii is Am, iii is Bm, IV is C, V is D, vi is Em.","Roll through the verse with left hand roots. The verse leans mostly on IV and V."],
   [ch("I, IV, V in G",4,2,[["G (I)",Gg],["C (IV)",Cg],["D (V)",Dg]])]),
 S("Game: mud test",7,["Hold the pedal down and roll G, then C, without lifting. That blur is mud.","Now do it properly: play the new chord, then lift the pedal and press it again straight away.","Say it as you do it: hands down, foot up and down."]),
 S("Free play",3,["The verse again with clean pedal changes."])],
 quiz:[mc("If A♭ is chord I, which number is E♭?",["IV","V","vi"],1,"A♭ B♭ C D♭ E♭: fifth note."),
       mc("Your chart says D♭, which is IV. What do you play in G?",["C","D","Em"],0,"IV in G is C."),
       mc("What is the order for a clean pedal change?",["Lift, then play the chord","Play the chord, then lift and re-press","Keep the pedal down throughout"],1,"Hands first, then the foot.")]},
{w:3,type:"practice",title:"Same shape on black keys",goal:"You can play the song in A♭ and you have chosen your key.",bpm:46,meter:"12/8",steps:[
 S("Replay",3,["The verse in G with roll and pedal."]),
 S("Song",12,["The record is in A♭. Tap the three chords below.","In root position each is black, white, black. The lazy shapes keep your hand in one place.","Roll each chord at 46, then play the verse in A♭."],
   [ch("Lazy shapes in A♭",4,2,[["A♭ (I)",Ab],["D♭ (IV)",Db],["E♭ (V)",Eb]]),P5ab]),
 S("Game: which key fits your voice?",7,["Sing the first line in G.","Sing it in A♭.","Pick the key where the highest note is comfortable. That is your key for the week."]),
 S("Play along",3,["If you chose A♭, play along with the recording using held chords."])],
 quiz:[tap("Tap the three notes of an A♭ chord.",["Ab","C","Eb"],false,"A♭ C E♭: black, white, black."),
       mc("In root position, A♭, D♭ and E♭ chords all have which shape?",["White, black, white","Black, white, black","All black"],1,"The outer notes are black and the middle one is white.")]},
{w:3,type:"practice",title:"Bass walk",goal:"You can sing over the roll and connect chords with a bass walk.",bpm:50,meter:"12/8",steps:[
 S("Replay",3,["The verse in your chosen key."]),
 S("Song",12,["Ladder step 2: hum over held chords.","Ladder step 3: speak the words in rhythm over the roll.","If the roll wobbles when you use your voice, roll only on beats 1 and 3 and hold on 2 and 4."]),
 S("Game: bass walk",7,["Listen below: the left hand steps up from G to C, one note per beat.","Use it in the last bar before a move from I to IV.","In A♭ the walk is A♭, B♭, C, D♭.","Charts write walks as slash chords: C/E means a C chord with E in the bass."],
   [mel("Bass walk from G to C",50,3,3,[[[Gg,4,"G"]],[[Cg,4,"C"]]],[[["G3",1],["A3",1],["B3",1],["B3",1]],[["C4",4]]])]),
 S("Sing",3,["Sing one verse with the walk in it."])],
 quiz:[tap("Tap the walk from G up to C, in order.",["G","A","B","C"],true,"G, A, B, C: step by step."),
       mc("What does C/E mean on a chart?",["C chord, then E chord","C chord with E in the bass","Choose C or E"],1,"The letter after the slash is the bass note.")]},
{w:3,type:"practice",title:"Shape the song",goal:"You can play the whole song with a plan for soft and loud.",bpm:54,meter:"12/8",steps:[
 S("Replay",3,["Verse with the bass walk."]),
 S("Song",12,["Write a plan on your chart: verse 1 soft with held chords, verse 2 with the roll, last section with the roll and left hand octaves.","Play the whole song under the no-stop rule.","Sing it through."]),
 S("Game: top note stays",7,["Tap G, then D. The note D can stay on top through both.","Tap C, then G (lazy). The note G is in both.","Play each pair on your piano with the shared note held. It glues the chords together."],
   [ch("Shared notes in G",4,2,[["G",Gg],["D",Dg],["C",Cg]])]),
 S("Free play",3,["Play your favourite section one more time."])],
 quiz:[mc("Which note is in both the G chord and the D chord?",["B","D","G"],1,"G B D and D F♯ A share D."),
       mc("Which shape suits a ballad?",["Loud from the first bar","Start soft and build","Same volume throughout"],1,"Leave yourself somewhere to go.")]},
{w:3,type:"boss",title:"This Year's Love on record",goal:"You have a recording of the song and the key to Let It Be.",bpm:54,meter:"12/8",steps:[
 S("Warm up",3,["The roll on chords I, IV and V in your key."]),
 S("Record",10,["Record the song, or as much as you have, singing.","Up to three takes."]),
 S("The key",7,["This unlocks Let It Be.","Pick a tune you can hum from memory, such as a folk song or a carol.","In C, using only C, F, G and Am, find chords for its first eight bars.","Start on C. When it sounds wrong, try the other three.","Write the chords down. You pass when you can play the eight bars and hum along."],
   [LAZY4]),
 S("Listen",5,["Listen back.","Compare with your Drops of Jupiter recording."])],
 quiz:[mc("Finding chords by ear in C, which chord does a tune most often start on?",["C","F","G"],0,"Most tunes start at home, on chord I."),
       mc("C sounds wrong in a bar. What do you try next?",["Any black key","F, G or Am","Give up on that bar"],1,"Those four chords cover most simple tunes.")]},
{w:3,type:"rest",title:"Rest",goal:"No piano today.",steps:[
 S("Optional listening",10,["Listen to Let It Be.","Count how many different chords you hear in the verse."])],quiz:[]},
/* ---------- Week 4 ---------- */
{w:4,type:"practice",title:"Write your own chart",goal:"You can play the verse from chord numbers, without a sheet.",bpm:60,meter:"4/4",steps:[
 S("Replay",3,["A verse of This Year's Love."]),
 S("Song",12,["Keep your sheet closed. Press Play: the verse uses four chords in C, two per bar.","Play it with held chords and the lazy shapes.","Write it down as numbers: I V vi IV, then I V IV I.","Now open your sheet and check."],
   [VERSE]),
 S("Game: four-chord jukebox",7,["Loop I V vi IV: C, G, Am, F.","Hum other songs over it. A great many pop choruses fit.","Count how many you find in five minutes."],
   [LAZY4]),
 S("Free play",3,["Play the same loop in G: G, D, Em, C."])],
 quiz:[tap("Tap the roots of I, V, vi, IV in C, in order.",["C","G","A","F"],true,"C, G, A, F."),
       mc("The second line of the verse, in numbers, is…",["I V vi IV","I V IV I","IV V I I"],1,"It goes home to I at the end.")]},
{w:4,type:"practice",title:"Pattern roulette",goal:"You can give verse and chorus a fuller sound.",bpm:64,meter:"4/4",steps:[
 S("Replay",3,["The verse with held chords."]),
 S("Song",12,["Listen to Pattern 6: left hand octave on beats 1 and 3, right hand chord on beats 2 and 4.","Practise it on C alone, then on the verse.","Then the chorus: Am, G, F, C, then C, G, F, C."],
   [P6]),
 S("Game: pattern roulette",7,["Loop the verse.","Change pattern every time round: held chords, pulse, rocking bass, octave and offbeat.","No stopping between rounds."]),
 S("Sing",3,["Ladder step 2: hum the verse over held chords."])],
 quiz:[mc("In Pattern 6, where do the left hand octaves go?",["Beats 1 and 3","Beats 2 and 4","Every beat"],0,"Left hand on 1 and 3, right hand answers on 2 and 4."),
       mc("The chorus starts on vi. In C, that is…",["F","G","Am"],2,"A minor.")]},
{w:4,type:"practice",title:"The walk-down",goal:"You can play the bass line that makes it sound like the record.",bpm:66,meter:"4/4",steps:[
 S("Replay",3,["Verse with octave and offbeat."]),
 S("Song",12,["Listen below: the bass steps down F, E, D, C.","Charts write this as F, C/E, Dm7, C.","Left hand plays the four bass notes. Right hand just alternates two shapes.","Fit it in at the end of a line, where F returns to C."],
   [WALK]),
 S("Game: two colours",7,["Tap G, then Gsus4, then G. Use it just before a G returns to C.","Tap C, then Cadd2. Use it on a long C.","Use each colour once in a verse."],
   [ch("Two colour chords",3,2,[["G",G],["Gsus4",["C4","D4","G4"]],["C",C],["Cadd2",["C4","D4","E4","G4"]]])]),
 S("Sing",3,["Ladder step 3: speak the verse in rhythm over the pulse."])],
 quiz:[tap("Tap the walk-down bass from F to C, in order.",["F","E","D","C"],true,"F, E, D, C."),
       tap("Tap Gsus4.",["G","C","D"],false,"G C D. The B is lifted to C."),
       mc("Over the bass note D, which right hand shape gives Dm7?",["C F A","B D G","C E G"],0,"D with F, A and C above it is Dm7.")]},
{w:4,type:"practice",title:"Arrange it",goal:"You have a plan from intro to last chord.",bpm:70,meter:"4/4",steps:[
 S("Replay",3,["Verse with the walk-down."]),
 S("Song",12,["Write the arrangement on your chart. A plan that works: verse 1 held chords, verse 2 pulse, choruses octave and offbeat.","Sing the whole song at 70."]),
 S("Game: intro and ending",7,["Intro: play the verse chords once through with the walk-down at the end.","Ending: slow the last two chords.","Roll the final C from the bottom note to the top."],
   [VERSE]),
 S("Free play",3,["Play only the intro and the ending, three times."])],
 quiz:[mc("Which pattern makes a chorus sound biggest?",["Held chords","Octave and offbeat","Single notes"],1,"Octaves in the left hand add weight."),
       mc("What makes a good ending?",["Stop suddenly","Slow down and roll the last chord","Speed up"],1,"Slowing tells the listener the song is finishing.")]},
{w:4,type:"practice",title:"Your key",goal:"You can play the whole song in the key that suits your voice.",bpm:70,meter:"4/4",steps:[
 S("Replay",3,["Intro, first verse, ending."]),
 S("Game: three keys",7,["I V vi IV in C is C, G, Am, F. Tap the chords in G and F below.","Sing the first line in all three keys.","Keep the most comfortable one."],
   [ch("In G",4,2,[["G",Gg],["D",Dg],["Em",["G4","B4","E5"]],["C",Cg]]),ch("In F",4,2,[["F",["F4","A4","C5"]],["C",["E4","G4","C5"]],["Dm",["F4","A4","D5"]],["B♭",["F4","Bb4","D5"]]])]),
 S("Song",12,["Whole song, singing, in the key you chose.","No-stop rule."]),
 S("Free play",3,["Play any of your four songs for fun."])],
 quiz:[mc("I V vi IV in G is…",["G, D, Em, C","G, C, D, Em","G, A, B, C"],0,"5 is D, 6 is E minor, 4 is C."),
       tap("Tap a B♭ chord.",["Bb","D","F"],false,"B♭ D F. It is chord IV in the key of F.")]},
{w:4,type:"boss",title:"Let It Be on record",goal:"You have a recording of the whole song.",bpm:70,meter:"4/4",steps:[
 S("Warm up",3,["Intro and first verse."]),
 S("Record",14,["Record Let It Be from start to finish, singing.","Up to three takes.","If you slip, keep going."]),
 S("Listen",5,["Listen back with your chart.","Mark one bar to tidy."]),
 S("Choose",3,["Pick your recital song for day 30 from the three pop songs."])],
 quiz:[mc("You play a wrong chord while recording. What do you do?",["Stop the take","Keep going","Start the bar again"],1,"A take that keeps going is worth more than a perfect half.")]},
{w:4,type:"rest",title:"Rest",goal:"No piano today.",steps:[
 S("Optional listening",10,["Listen to your recital song once.","Follow your chart with a finger."])],quiz:[]},
/* ---------- Finish ---------- */
{w:5,type:"practice",title:"Dress rehearsal",goal:"You have performed your recital set twice.",bpm:70,meter:"4/4",steps:[
 S("Replay",3,["Minuet in G, bars 1 to 8."]),
 S("Perform",12,["Your set is the Minuet's first eight bars and your recital song.","Sit, breathe, count yourself in and play.","Do not stop for anything."]),
 S("Fix",7,["Choose the two worst bars from that run.","Three coins on each, slowly.","Leave everything else alone."]),
 S("Run",3,["Perform the start of the set once more."])],
 quiz:[mc("In a performance run, a wrong note means…",["Start again","Keep going","Stop and fix it"],1,"Fixing happens between runs."),
       mc("Between runs, what do you practise?",["Everything","The two worst bars","Only the parts you like"],1,"Small, targeted fixes.")]},
{w:5,type:"recital",title:"Recital",goal:"You have a final recording to compare with day 1.",bpm:70,meter:"4/4",steps:[
 S("Warm up",3,["Play the first line of each piece."]),
 S("Record",12,["Record your set. One take if you can, two at most."]),
 S("Compare",7,["Listen to your baseline from day 1.","Listen to today.","Write down three things you can do now that you could not do then."]),
 S("Next",3,["Love Song is now open.","Start it the same way as the others: held chords first, then the singing ladder."])],
 quiz:[mc("I V vi IV in C is…",["C, G, Am, F","C, F, G, Am","C, Am, G, F"],0,"The four chords behind a great many songs."),
       mc("placeholder",["a","b"],0,"")]}
];
/* ---------- later-week patches ---------- */
DAYS[17].steps[2].demos[0].lh=[[["G3",1],["A3",1],["B3",1],["B3",1]],[["C4",4]]];
DAYS[17].steps[2].demos[0].meter="12/8";DAYS[17].steps[2].demos[0].key="G";
DAYS[7].quiz[1]=mc("Listen. Which change is this?",["C to F","C to G"],0,"The bottom note stayed and the top two rose: that is C to F.",mel("",60,3,2,[[[C,2],[F,2]]]));
DAYS[8].quiz.push(echo("Echo. Three notes: the roots of I, V and IV in C. Play them back.",mel("",70,4,2,[[["C4",1],["G4",1],["F4",1]]]),"C, G, F."));
DAYS[11].quiz.push(mc("Listen. Did you hear a sus4 resolving, or the plain chord twice?",["Sus4 resolving","Plain chord twice"],0,"C F G, then C E G: the F drops to E.",mel("",60,3,2,[[[["C4","F4","G4"],2],[C,2]]])));
DAYS[21].quiz.push(mc("Listen. Which line of the verse is this?",["Line 1: I V vi IV","Line 2: I V IV I"],1,"It comes home to C at the end, so it is line 2.",mel("",70,3,2,[[[C,2],[G,2]],[[F,2],[C,2]]])));
DAYS[29].quiz[1]=echo("One last echo: the first five notes of the Minuet. The first note is D.",mel("",80,4,2,[R1],null,{meter:"3/4",key:"G"}),"D, then G A B C. You found the G major scale inside this tune on day 1.");
var EX={8:[1,"You get through the verse without stopping, even with slow changes.","Close your eyes for the chord changes."],
 9:[1,"Your pulse stays even through every chord change.","Play along with the recording at full speed."],
 10:[1,"The left hand keeps rocking while the right hand changes chord.","Pulse in the right hand over the rocking bass."],
 11:[1,"The early chord feels like leaning forward, not like a mistake.","Push every chord change in the chorus."],
 12:[1,"One full run from intro to ending without stopping.","A second run where each section uses a different pattern."],
 15:[1,"Four bars of each chord with no bump between groups of three.","Change chord every bar: G, C, D, G."],
 16:[1,"The verse in G with no blur between chords.","Add the left hand note an octave lower on beat 1 of each bar."],
 17:[1,"The verse in A♭ without hunting for notes.","Play along with the recording using the roll."],
 18:[1,"You can speak the words while the roll keeps going.","Sing it properly over the roll."],
 19:[1,"One full run with a clear difference between soft and loud sections.","Record it today and listen back before the unlock day."],
 22:[1,"The verse from memory, using numbers only.","Play the verse in G from the same numbers."],
 23:[1,"Left and right hands answer each other without stumbling.","Add the push before each bar line."],
 24:[1,"The walk-down lands on C in time.","Use the walk-down at the end of every line."],
 25:[1,"One full run that follows your written plan.","Add a four-bar instrumental break between verse 2 and the chorus."],
 26:[2,"The whole song in your key without stopping.","Play the intro in one key and switch up a key for the last chorus."]};
Object.keys(EX).forEach(function(d){var e=EX[d],s=DAYS[d-1].steps[e[0]];s.ok=e[1];s.more=e[2]});
var WHY={1:"Starting with both hands on day one sets the pace for the month. The scale is something you find inside the tune, not a drill.",
 2:"Every pop song you play later is built from numbered chords. You meet the three most important ones here.",
 3:"Repeated material is free progress. Spotting it is how good readers learn pieces quickly.",
 4:"This is your first key change. Hearing where music leaves home and how it gets back is the core of music theory.",
 5:"Moving chords to a new key is what lets you play a song where your voice sits best.",
 6:"Recording is the most honest feedback you can get. The unlock test checks the one skill week 2 depends on.",
 8:"Pop piano is mostly choosing chord shapes that sit close together. Today you learn to barely move.",
 9:"A steady pulse matters more than any single right note.",
 10:"A moving left hand makes three chords sound like a band.",
 11:"Changing chord slightly early is the small rhythmic trick that makes pop piano sound like pop.",
 12:"Finishing a whole song, however simply, beats polishing one verse.",
 13:"You sing and play on record for the first time.",
 15:"The lilt of 12/8 sits behind a lot of slow ballads.",
 16:"The pedal is what makes a ballad sound warm, and what makes it sound muddy.",
 17:"Black-key chords look hard and feel easy once you see they share one shape.",
 18:"Coordinating voice and hands is its own skill. The ladder builds it in order.",
 19:"Soft and loud are what turn chords into a performance.",
 20:"Finding chords by ear is the skill that frees you from sheet music.",
 22:"Four chords in this order sit under a huge number of songs.",
 23:"Switching patterns on the fly is how you arrange without writing anything down.",
 24:"A bass line that moves by step is the detail people recognise from the record.",
 25:"An arrangement is a plan for where the song grows.",
 26:"Your key is the one your voice likes.",
 27:"A full song, start to finish, on record.",
 29:"Performing is a separate skill from practising. Today you practise performing.",
 30:"You compare day 1 with day 30."};
var ABOUT={
 1:[["Piece","Minuet in G, from the Notebook for Anna Magdalena Bach (1725). Long credited to J. S. Bach, now attributed to Christian Petzold."],
    ["Key","G major. One sharp, F♯."],["Time","3/4. A minuet is a dance in three."],
    ["Chords","G (I), C (IV) and D (V)."],
    ["Shape","Two halves of 16 bars. The first stays in G. The second visits D major and comes home."],
    ["Listen for","The opening tune returning in bar 9."]],
 2:[["Song","Drops of Jupiter, Train, 2001. A piano-led rock ballad."],
    ["Key","C major. No sharps or flats."],["Feel","A slow pulse near 81 on the metronome."],
    ["Chords","Mostly C (I), G (V) and F (IV): the same three numbers you found in the Minuet."],
    ["Your part","Chords and rhythm under your own voice."]],
 3:[["Song","This Year's Love, David Gray, from the album White Ladder."],
    ["Key","A♭ major on the record. Four flats: B♭, E♭, A♭, D♭."],["Time","12/8, slow, near 54. Four beats, each split in three."],
    ["Chords","The verse leans on IV and V, which are D♭ and E♭ in the original key."],
    ["Plan","Learn it in G first, where you know the chords, then move it to A♭."]],
 4:[["Song","Let It Be, The Beatles, 1970."],
    ["Key","C major."],["Time","4/4, near 70."],
    ["Chords","Verse: I V vi IV, then I V IV I. Chorus: vi V IV I, then I V IV I."],
    ["Your part","Build the arrangement yourself from a chord chart."]],
 5:[["Finish","A dress rehearsal and a recital recording to set beside day 1."]]};

