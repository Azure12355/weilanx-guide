var At=(e,t,s)=>new Promise((a,i)=>{var l=h=>{try{u(s.next(h))}catch(m){i(m)}},c=h=>{try{u(s.throw(h))}catch(m){i(m)}},u=h=>h.done?a(h.value):Promise.resolve(h.value).then(l,c);u((s=s.apply(e,t)).next())});import{m as Zt}from"./chunk-6EQESGSB-FhHSE4oJ.js";import{y as te}from"./chunk-T244DUNM-CrCjgr0Q.js";import{m as y,p as _,a as P,c as ee,d as se,U as ie,H as re,$ as ae,G as ne,j as oe,e as le,b2 as ce,h as K,N as he}from"./mermaid.esm.min-AW0ZdUu7.js";var Ct=(function(){var e=y(function(Y,n,o,g){for(o=o||{},g=Y.length;g--;o[Y[g]]=n);return o},"o"),t=[1,2],s=[1,3],a=[1,4],i=[2,4],l=[1,9],c=[1,11],u=[1,16],h=[1,17],m=[1,18],S=[1,19],A=[1,33],E=[1,20],D=[1,21],I=[1,22],R=[1,23],C=[1,24],p=[1,26],b=[1,27],w=[1,28],F=[1,29],O=[1,30],B=[1,31],j=[1,32],it=[1,35],rt=[1,36],at=[1,37],nt=[1,38],V=[1,34],f=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],ot=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],vt=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],mt={trace:y(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:y(function(Y,n,o,g,T,r,v){var d=r.length-1;switch(T){case 3:return g.setRootDoc(r[d]),r[d];case 4:this.$=[];break;case 5:r[d]!="nl"&&(r[d-1].push(r[d]),this.$=r[d-1]);break;case 6:case 7:this.$=r[d];break;case 8:this.$="nl";break;case 12:this.$=r[d];break;case 13:let ht=r[d-1];ht.description=g.trimColon(r[d]),this.$=ht;break;case 14:this.$={stmt:"relation",state1:r[d-2],state2:r[d]};break;case 15:let dt=g.trimColon(r[d]);this.$={stmt:"relation",state1:r[d-3],state2:r[d-1],description:dt};break;case 19:this.$={stmt:"state",id:r[d-3],type:"default",description:"",doc:r[d-1]};break;case 20:var z=r[d],q=r[d-2].trim();if(r[d].match(":")){var ct=r[d].split(":");z=ct[0],q=[q,ct[1]]}this.$={stmt:"state",id:z,type:"default",description:q};break;case 21:this.$={stmt:"state",id:r[d-3],type:"default",description:r[d-5],doc:r[d-1]};break;case 22:this.$={stmt:"state",id:r[d],type:"fork"};break;case 23:this.$={stmt:"state",id:r[d],type:"join"};break;case 24:this.$={stmt:"state",id:r[d],type:"choice"};break;case 25:this.$={stmt:"state",id:g.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:r[d-1].trim(),note:{position:r[d-2].trim(),text:r[d].trim()}};break;case 29:this.$=r[d].trim(),g.setAccTitle(this.$);break;case 30:case 31:this.$=r[d].trim(),g.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:r[d-3],url:r[d-2],tooltip:r[d-1]};break;case 33:this.$={stmt:"click",id:r[d-3],url:r[d-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:r[d-1].trim(),classes:r[d].trim()};break;case 36:this.$={stmt:"style",id:r[d-1].trim(),styleClass:r[d].trim()};break;case 37:this.$={stmt:"applyClass",id:r[d-1].trim(),styleClass:r[d].trim()};break;case 38:g.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:g.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:g.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:g.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:r[d].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:r[d-2].trim(),classes:[r[d].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:r[d-2].trim(),classes:[r[d].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:t,5:s,6:a},{1:[3]},{3:5,4:t,5:s,6:a},{3:6,4:t,5:s,6:a},e([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],i,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:l,5:c,8:8,9:10,10:12,11:13,12:14,13:15,16:u,17:h,19:m,22:S,24:A,25:E,26:D,27:I,28:R,29:C,32:25,33:p,35:b,37:w,38:F,41:O,45:B,48:j,51:it,52:rt,53:at,54:nt,57:V},e(f,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:u,17:h,19:m,22:S,24:A,25:E,26:D,27:I,28:R,29:C,32:25,33:p,35:b,37:w,38:F,41:O,45:B,48:j,51:it,52:rt,53:at,54:nt,57:V},e(f,[2,7]),e(f,[2,8]),e(f,[2,9]),e(f,[2,10]),e(f,[2,11]),e(f,[2,12],{14:[1,40],15:[1,41]}),e(f,[2,16]),{18:[1,42]},e(f,[2,18],{20:[1,43]}),{23:[1,44]},e(f,[2,22]),e(f,[2,23]),e(f,[2,24]),e(f,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},e(f,[2,28]),{34:[1,49]},{36:[1,50]},e(f,[2,31]),{13:51,24:A,57:V},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},e(ot,[2,44],{58:[1,56]}),e(ot,[2,45],{58:[1,57]}),e(f,[2,38]),e(f,[2,39]),e(f,[2,40]),e(f,[2,41]),e(f,[2,6]),e(f,[2,13]),{13:58,24:A,57:V},e(f,[2,17]),e(vt,i,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},e(f,[2,29]),e(f,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},e(f,[2,14],{14:[1,71]}),{4:l,5:c,8:8,9:10,10:12,11:13,12:14,13:15,16:u,17:h,19:m,21:[1,72],22:S,24:A,25:E,26:D,27:I,28:R,29:C,32:25,33:p,35:b,37:w,38:F,41:O,45:B,48:j,51:it,52:rt,53:at,54:nt,57:V},e(f,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},e(f,[2,34]),e(f,[2,35]),e(f,[2,36]),e(f,[2,37]),e(ot,[2,46]),e(ot,[2,47]),e(f,[2,15]),e(f,[2,19]),e(vt,i,{7:78}),e(f,[2,26]),e(f,[2,27]),{5:[1,79]},{5:[1,80]},{4:l,5:c,8:8,9:10,10:12,11:13,12:14,13:15,16:u,17:h,19:m,21:[1,81],22:S,24:A,25:E,26:D,27:I,28:R,29:C,32:25,33:p,35:b,37:w,38:F,41:O,45:B,48:j,51:it,52:rt,53:at,54:nt,57:V},e(f,[2,32]),e(f,[2,33]),e(f,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:y(function(Y,n){if(n.recoverable)this.trace(Y);else{var o=new Error(Y);throw o.hash=n,o}},"parseError"),parse:y(function(Y){var n=this,o=[0],g=[],T=[null],r=[],v=this.table,d="",z=0,q=0,ct=0,ht=2,dt=1,Ht=r.slice.call(arguments,1),k=Object.create(this.lexer),W={yy:{}};for(var St in this.yy)Object.prototype.hasOwnProperty.call(this.yy,St)&&(W.yy[St]=this.yy[St]);k.setInput(Y,W.yy),W.yy.lexer=k,W.yy.parser=this,typeof k.yylloc>"u"&&(k.yylloc={});var Tt=k.yylloc;r.push(Tt);var Xt=k.options&&k.options.ranges;typeof W.yy.parseError=="function"?this.parseError=W.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Qt(L){o.length=o.length-2*L,T.length=T.length-L,r.length=r.length-L}y(Qt,"popStack");function It(){var L;return L=g.pop()||k.lex()||dt,typeof L!="number"&&(L instanceof Array&&(g=L,L=g.pop()),L=n.symbols_[L]||L),L}y(It,"lex");for(var x,_t,M,N,we,kt,H={},ut,G,Lt,pt;;){if(M=o[o.length-1],this.defaultActions[M]?N=this.defaultActions[M]:((x===null||typeof x>"u")&&(x=It()),N=v[M]&&v[M][x]),typeof N>"u"||!N.length||!N[0]){var bt="";pt=[];for(ut in v[M])this.terminals_[ut]&&ut>ht&&pt.push("'"+this.terminals_[ut]+"'");k.showPosition?bt="Parse error on line "+(z+1)+`:
`+k.showPosition()+`
Expecting `+pt.join(", ")+", got '"+(this.terminals_[x]||x)+"'":bt="Parse error on line "+(z+1)+": Unexpected "+(x==dt?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(bt,{text:k.match,token:this.terminals_[x]||x,line:k.yylineno,loc:Tt,expected:pt})}if(N[0]instanceof Array&&N.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+x);switch(N[0]){case 1:o.push(x),T.push(k.yytext),r.push(k.yylloc),o.push(N[1]),x=null,_t?(x=_t,_t=null):(q=k.yyleng,d=k.yytext,z=k.yylineno,Tt=k.yylloc,ct>0);break;case 2:if(G=this.productions_[N[1]][1],H.$=T[T.length-G],H._$={first_line:r[r.length-(G||1)].first_line,last_line:r[r.length-1].last_line,first_column:r[r.length-(G||1)].first_column,last_column:r[r.length-1].last_column},Xt&&(H._$.range=[r[r.length-(G||1)].range[0],r[r.length-1].range[1]]),kt=this.performAction.apply(H,[d,q,z,W.yy,N[1],T,r].concat(Ht)),typeof kt<"u")return kt;G&&(o=o.slice(0,-1*G*2),T=T.slice(0,-1*G),r=r.slice(0,-1*G)),o.push(this.productions_[N[1]][0]),T.push(H.$),r.push(H._$),Lt=v[o[o.length-2]][o[o.length-1]],o.push(Lt);break;case 3:return!0}}return!0},"parse")},qt=(function(){var Y={EOF:1,parseError:y(function(n,o){if(this.yy.parser)this.yy.parser.parseError(n,o);else throw new Error(n)},"parseError"),setInput:y(function(n,o){return this.yy=o||this.yy||{},this._input=n,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:y(function(){var n=this._input[0];this.yytext+=n,this.yyleng++,this.offset++,this.match+=n,this.matched+=n;var o=n.match(/(?:\r\n?|\n).*/g);return o?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),n},"input"),unput:y(function(n){var o=n.length,g=n.split(/(?:\r\n?|\n)/g);this._input=n+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-o),this.offset-=o;var T=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),g.length-1&&(this.yylineno-=g.length-1);var r=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:g?(g.length===T.length?this.yylloc.first_column:0)+T[T.length-g.length].length-g[0].length:this.yylloc.first_column-o},this.options.ranges&&(this.yylloc.range=[r[0],r[0]+this.yyleng-o]),this.yyleng=this.yytext.length,this},"unput"),more:y(function(){return this._more=!0,this},"more"),reject:y(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:y(function(n){this.unput(this.match.slice(n))},"less"),pastInput:y(function(){var n=this.matched.substr(0,this.matched.length-this.match.length);return(n.length>20?"...":"")+n.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:y(function(){var n=this.match;return n.length<20&&(n+=this._input.substr(0,20-n.length)),(n.substr(0,20)+(n.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:y(function(){var n=this.pastInput(),o=new Array(n.length+1).join("-");return n+this.upcomingInput()+`
`+o+"^"},"showPosition"),test_match:y(function(n,o){var g,T,r;if(this.options.backtrack_lexer&&(r={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(r.yylloc.range=this.yylloc.range.slice(0))),T=n[0].match(/(?:\r\n?|\n).*/g),T&&(this.yylineno+=T.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:T?T[T.length-1].length-T[T.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+n[0].length},this.yytext+=n[0],this.match+=n[0],this.matches=n,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(n[0].length),this.matched+=n[0],g=this.performAction.call(this,this.yy,this,o,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),g)return g;if(this._backtrack){for(var v in r)this[v]=r[v];return!1}return!1},"test_match"),next:y(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var n,o,g,T;this._more||(this.yytext="",this.match="");for(var r=this._currentRules(),v=0;v<r.length;v++)if(g=this._input.match(this.rules[r[v]]),g&&(!o||g[0].length>o[0].length)){if(o=g,T=v,this.options.backtrack_lexer){if(n=this.test_match(g,r[v]),n!==!1)return n;if(this._backtrack){o=!1;continue}else return!1}else if(!this.options.flex)break}return o?(n=this.test_match(o,r[T]),n!==!1?n:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:y(function(){var n=this.next();return n||this.lex()},"lex"),begin:y(function(n){this.conditionStack.push(n)},"begin"),popState:y(function(){var n=this.conditionStack.length-1;return n>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:y(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:y(function(n){return n=this.conditionStack.length-1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},"topState"),pushState:y(function(n){this.begin(n)},"pushState"),stateStackSize:y(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:y(function(n,o,g,T){switch(g){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:break;case 9:break;case 10:return 5;case 11:break;case 12:break;case 13:break;case 14:break;case 15:return this.pushState("SCALE"),17;case 16:return 18;case 17:this.popState();break;case 18:return this.begin("acc_title"),33;case 19:return this.popState(),"acc_title_value";case 20:return this.begin("acc_descr"),35;case 21:return this.popState(),"acc_descr_value";case 22:this.begin("acc_descr_multiline");break;case 23:this.popState();break;case 24:return"acc_descr_multiline_value";case 25:return this.pushState("CLASSDEF"),41;case 26:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 27:return this.popState(),this.pushState("CLASSDEFID"),42;case 28:return this.popState(),43;case 29:return this.pushState("CLASS"),48;case 30:return this.popState(),this.pushState("CLASS_STYLE"),49;case 31:return this.popState(),50;case 32:return this.pushState("STYLE"),45;case 33:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;case 34:return this.popState(),47;case 35:return this.pushState("SCALE"),17;case 36:return 18;case 37:this.popState();break;case 38:this.pushState("STATE");break;case 39:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),25;case 40:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),26;case 41:return this.popState(),o.yytext=o.yytext.slice(0,-10).trim(),27;case 42:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),25;case 43:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),26;case 44:return this.popState(),o.yytext=o.yytext.slice(0,-10).trim(),27;case 45:return 51;case 46:return 52;case 47:return 53;case 48:return 54;case 49:this.pushState("STATE_STRING");break;case 50:return this.pushState("STATE_ID"),"AS";case 51:return this.popState(),"ID";case 52:this.popState();break;case 53:return"STATE_DESCR";case 54:return 19;case 55:this.popState();break;case 56:return this.popState(),this.pushState("struct"),20;case 57:break;case 58:return this.popState(),21;case 59:break;case 60:return this.begin("NOTE"),29;case 61:return this.popState(),this.pushState("NOTE_ID"),59;case 62:return this.popState(),this.pushState("NOTE_ID"),60;case 63:this.popState(),this.pushState("FLOATING_NOTE");break;case 64:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 65:break;case 66:return"NOTE_TEXT";case 67:return this.popState(),"ID";case 68:return this.popState(),this.pushState("NOTE_TEXT"),24;case 69:return this.popState(),o.yytext=o.yytext.substr(2).trim(),31;case 70:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),31;case 71:return 6;case 72:return 6;case 73:return 16;case 74:return 57;case 75:return 24;case 76:return o.yytext=o.yytext.trim(),14;case 77:return 15;case 78:return 28;case 79:return 58;case 80:return 5;case 81:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[12,13],inclusive:!1},struct:{rules:[12,13,25,29,32,38,45,46,47,48,57,58,59,60,74,75,76,77,78],inclusive:!1},FLOATING_NOTE_ID:{rules:[67],inclusive:!1},FLOATING_NOTE:{rules:[64,65,66],inclusive:!1},NOTE_TEXT:{rules:[69,70],inclusive:!1},NOTE_ID:{rules:[68],inclusive:!1},NOTE:{rules:[61,62,63],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[34],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[33],inclusive:!1},CLASS_STYLE:{rules:[31],inclusive:!1},CLASS:{rules:[30],inclusive:!1},CLASSDEFID:{rules:[28],inclusive:!1},CLASSDEF:{rules:[26,27],inclusive:!1},acc_descr_multiline:{rules:[23,24],inclusive:!1},acc_descr:{rules:[21],inclusive:!1},acc_title:{rules:[19],inclusive:!1},SCALE:{rules:[16,17,36,37],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[51],inclusive:!1},STATE_STRING:{rules:[52,53],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[12,13,39,40,41,42,43,44,49,50,54,55,56],inclusive:!1},ID:{rules:[12,13],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,13,14,15,18,20,22,25,29,32,35,38,56,60,71,72,73,74,75,76,77,79,80,81],inclusive:!0}}};return Y})();mt.lexer=qt;function lt(){this.yy={}}return y(lt,"Parser"),lt.prototype=mt,mt.Parser=lt,new lt})();Ct.parser=Ct;var Ge=Ct,Q="state",X="root",xt="relation",de="classDef",ue="style",pe="applyClass",et="default",Yt="divider",Pt="fill:none",Gt="fill: #333",jt="text",Ut="normal",Et="rect",Dt="rectWithTitle",ye="stateStart",fe="stateEnd",Ot="divider",Nt="roundedWithTitle",ge="note",me="noteGroup",st="statediagram",Se="state",Te=`${st}-${Se}`,zt="transition",_e="note",ke="note-edge",be=`${zt} ${ke}`,Ee=`${st}-${_e}`,De="cluster",Ce=`${st}-${De}`,xe="cluster-alt",$e=`${st}-${xe}`,Wt="parent",Mt="note",ve="state",$t="----",Ie=`${$t}${Mt}`,Rt=`${$t}${Wt}`,Kt=y((e,t="TB")=>{if(!e.doc)return t;let s=t;for(let a of e.doc)a.stmt==="dir"&&(s=a.value);return s},"getDir"),Le=y(function(e,t){return t.db.getClasses()},"getClasses"),Ae=y(function(e,t,s,a){return At(this,null,function*(){var S,A;_.info("REF0:"),_.info("Drawing state diagram (v2)",t);let{securityLevel:i,state:l,layout:c}=P();a.db.extract(a.db.getRootDocV2());let u=a.db.getData(),h=Zt(t,i);u.type=a.type,u.layoutAlgorithm=c,u.nodeSpacing=(l==null?void 0:l.nodeSpacing)||50,u.rankSpacing=(l==null?void 0:l.rankSpacing)||50,u.markers=["barb"],u.diagramId=t,yield ee(u,h);let m=8;try{(typeof a.db.getLinks=="function"?a.db.getLinks():new Map).forEach((E,D)=>{var F;let I=typeof D=="string"?D:typeof(D==null?void 0:D.id)=="string"?D.id:"";if(!I){_.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(D));return}let R=(F=h.node())==null?void 0:F.querySelectorAll("g"),C;if(R==null||R.forEach(O=>{var B;((B=O.textContent)==null?void 0:B.trim())===I&&(C=O)}),!C){_.warn("⚠️ Could not find node matching text:",I);return}let p=C.parentNode;if(!p){_.warn("⚠️ Node has no parent, cannot wrap:",I);return}let b=document.createElementNS("http://www.w3.org/2000/svg","a"),w=E.url.replace(/^"+|"+$/g,"");if(b.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",w),b.setAttribute("target","_blank"),E.tooltip){let O=E.tooltip.replace(/^"+|"+$/g,"");b.setAttribute("title",O)}p.replaceChild(b,C),b.appendChild(C),_.info("🔗 Wrapped node in <a> tag for:",I,E.url)})}catch(E){_.error("❌ Error injecting clickable links:",E)}se.insertTitle(h,"statediagramTitleText",(S=l==null?void 0:l.titleTopMargin)!=null?S:25,a.db.getDiagramTitle()),te(h,m,st,(A=l==null?void 0:l.useMaxWidth)!=null?A:!0)})},"draw"),je={getClasses:Le,draw:Ae,getDir:Kt},ft=new Map,U=0;function gt(e="",t=0,s="",a=$t){let i=s!==null&&s.length>0?`${a}${s}`:"";return`${ve}-${e}${i}-${t}`}y(gt,"stateDomId");var Oe=y((e,t,s,a,i,l,c,u)=>{_.trace("items",t),t.forEach(h=>{var m;switch(h.stmt){case Q:tt(e,h,s,a,i,l,c,u);break;case et:tt(e,h,s,a,i,l,c,u);break;case xt:{tt(e,h.state1,s,a,i,l,c,u),tt(e,h.state2,s,a,i,l,c,u);let S={id:"edge"+U,start:h.state1.id,end:h.state2.id,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:Pt,labelStyle:"",label:K.sanitizeText((m=h.description)!=null?m:"",P()),arrowheadStyle:Gt,labelpos:"c",labelType:jt,thickness:Ut,classes:zt,look:c};i.push(S),U++}break}})},"setupDoc"),wt=y((e,t="TB")=>{let s=t;if(e.doc)for(let a of e.doc)a.stmt==="dir"&&(s=a.value);return s},"getDir");function Z(e,t,s){if(!t.id||t.id==="</join></fork>"||t.id==="</choice>")return;t.cssClasses&&(Array.isArray(t.cssCompiledStyles)||(t.cssCompiledStyles=[]),t.cssClasses.split(" ").forEach(i=>{var c;let l=s.get(i);l&&(t.cssCompiledStyles=[...(c=t.cssCompiledStyles)!=null?c:[],...l.styles])}));let a=e.find(i=>i.id===t.id);a?Object.assign(a,t):e.push(t)}y(Z,"insertOrUpdateNode");function Jt(e){var t,s;return(s=(t=e==null?void 0:e.classes)==null?void 0:t.join(" "))!=null?s:""}y(Jt,"getClassesFromDbInfo");function Vt(e){var t;return(t=e==null?void 0:e.styles)!=null?t:[]}y(Vt,"getStylesFromDbInfo");var tt=y((e,t,s,a,i,l,c,u)=>{var D,I,R;let h=t.id,m=s.get(h),S=Jt(m),A=Vt(m),E=P();if(_.info("dataFetcher parsedItem",t,m,A),h!=="root"){let C=Et;t.start===!0?C=ye:t.start===!1&&(C=fe),t.type!==et&&(C=t.type),ft.get(h)||ft.set(h,{id:h,shape:C,description:K.sanitizeText(h,E),cssClasses:`${S} ${Te}`,cssStyles:A});let p=ft.get(h);t.description&&(Array.isArray(p.description)?(p.shape=Dt,p.description.push(t.description)):(D=p.description)!=null&&D.length&&p.description.length>0?(p.shape=Dt,p.description===h?p.description=[t.description]:p.description=[p.description,t.description]):(p.shape=Et,p.description=t.description),p.description=K.sanitizeTextOrArray(p.description,E)),((I=p.description)==null?void 0:I.length)===1&&p.shape===Dt&&(p.type==="group"?p.shape=Nt:p.shape=Et),!p.type&&t.doc&&(_.info("Setting cluster for XCX",h,wt(t)),p.type="group",p.isGroup=!0,p.dir=wt(t),p.shape=t.type===Yt?Ot:Nt,p.cssClasses=`${p.cssClasses} ${Ce} ${l?$e:""}`);let b={labelStyle:"",shape:p.shape,label:p.description,cssClasses:p.cssClasses,cssCompiledStyles:[],cssStyles:p.cssStyles,id:h,dir:p.dir,domId:gt(h,U),type:p.type,isGroup:p.type==="group",padding:8,rx:10,ry:10,look:c};if(b.shape===Ot&&(b.label=""),e&&e.id!=="root"&&(_.trace("Setting node ",h," to be child of its parent ",e.id),b.parentId=e.id),b.centerLabel=!0,t.note){let w={labelStyle:"",shape:ge,label:t.note.text,cssClasses:Ee,cssStyles:[],cssCompiledStyles:[],id:h+Ie+"-"+U,domId:gt(h,U,Mt),type:p.type,isGroup:p.type==="group",padding:(R=E.flowchart)==null?void 0:R.padding,look:c,position:t.note.position},F=h+Rt,O={labelStyle:"",shape:me,label:t.note.text,cssClasses:p.cssClasses,cssStyles:[],id:h+Rt,domId:gt(h,U,Wt),type:"group",isGroup:!0,padding:16,look:c,position:t.note.position};U++,O.id=F,w.parentId=F,Z(a,O,u),Z(a,w,u),Z(a,b,u);let B=h,j=w.id;t.note.position==="left of"&&(B=w.id,j=h),i.push({id:B+"-"+j,start:B,end:j,arrowhead:"none",arrowTypeEnd:"",style:Pt,labelStyle:"",classes:be,arrowheadStyle:Gt,labelpos:"c",labelType:jt,thickness:Ut,look:c})}else Z(a,b,u)}t.doc&&(_.trace("Adding nodes children "),Oe(t,t.doc,s,a,i,!l,c,u))},"dataFetcher"),Ne=y(()=>{ft.clear(),U=0},"reset"),$={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Bt=y(()=>new Map,"newClassesList"),Ft=y(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),yt=y(e=>JSON.parse(JSON.stringify(e)),"clone"),J,Ue=(J=class{constructor(t){this.version=t,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Bt(),this.documents={root:Ft()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.getAccTitle=ie,this.setAccTitle=re,this.getAccDescription=ae,this.setAccDescription=ne,this.setDiagramTitle=oe,this.getDiagramTitle=le,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}extract(t){this.clear(!0);for(let i of Array.isArray(t)?t:t.doc)switch(i.stmt){case Q:this.addState(i.id.trim(),i.type,i.doc,i.description,i.note);break;case xt:this.addRelation(i.state1,i.state2,i.description);break;case de:this.addStyleClass(i.id.trim(),i.classes);break;case ue:this.handleStyleDef(i);break;case pe:this.setCssClass(i.id.trim(),i.styleClass);break;case"click":this.addLink(i.id,i.url,i.tooltip);break}let s=this.getStates(),a=P();Ne(),tt(void 0,this.getRootDocV2(),s,this.nodes,this.edges,!0,a.look,this.classes);for(let i of this.nodes)if(Array.isArray(i.label)){if(i.description=i.label.slice(1),i.isGroup&&i.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${i.id}]`);i.label=i.label[0]}}handleStyleDef(t){let s=t.id.trim().split(","),a=t.styleClass.split(",");for(let i of s){let l=this.getState(i);if(!l){let c=i.trim();this.addState(c),l=this.getState(c)}l&&(l.styles=a.map(c=>{var u;return(u=c.replace(/;/g,""))==null?void 0:u.trim()}))}}setRootDoc(t){_.info("Setting root doc",t),this.rootDoc=t,this.version===1?this.extract(t):this.extract(this.getRootDocV2())}docTranslator(t,s,a){if(s.stmt===xt){this.docTranslator(t,s.state1,!0),this.docTranslator(t,s.state2,!1);return}if(s.stmt===Q&&(s.id===$.START_NODE?(s.id=t.id+(a?"_start":"_end"),s.start=a):s.id=s.id.trim()),s.stmt!==X&&s.stmt!==Q||!s.doc)return;let i=[],l=[];for(let c of s.doc)if(c.type===Yt){let u=yt(c);u.doc=yt(l),i.push(u),l=[]}else l.push(c);if(i.length>0&&l.length>0){let c={stmt:Q,id:ce(),type:"divider",doc:yt(l)};i.push(yt(c)),s.doc=i}s.doc.forEach(c=>this.docTranslator(s,c,!0))}getRootDocV2(){return this.docTranslator({id:X,stmt:X},{id:X,stmt:X,doc:this.rootDoc},!0),{id:X,doc:this.rootDoc}}addState(t,s=et,a=void 0,i=void 0,l=void 0,c=void 0,u=void 0,h=void 0){let m=t==null?void 0:t.trim();if(!this.currentDocument.states.has(m))_.info("Adding state ",m,i),this.currentDocument.states.set(m,{stmt:Q,id:m,descriptions:[],type:s,doc:a,note:l,classes:[],styles:[],textStyles:[]});else{let S=this.currentDocument.states.get(m);if(!S)throw new Error(`State not found: ${m}`);S.doc||(S.doc=a),S.type||(S.type=s)}if(i&&(_.info("Setting state description",m,i),(Array.isArray(i)?i:[i]).forEach(S=>this.addDescription(m,S.trim()))),l){let S=this.currentDocument.states.get(m);if(!S)throw new Error(`State not found: ${m}`);S.note=l,S.note.text=K.sanitizeText(S.note.text,P())}c&&(_.info("Setting state classes",m,c),(Array.isArray(c)?c:[c]).forEach(S=>this.setCssClass(m,S.trim()))),u&&(_.info("Setting state styles",m,u),(Array.isArray(u)?u:[u]).forEach(S=>this.setStyle(m,S.trim()))),h&&(_.info("Setting state styles",m,u),(Array.isArray(h)?h:[h]).forEach(S=>this.setTextStyle(m,S.trim())))}clear(t){this.nodes=[],this.edges=[],this.documents={root:Ft()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Bt(),t||(this.links=new Map,he())}getState(t){return this.currentDocument.states.get(t)}getStates(){return this.currentDocument.states}logDocuments(){_.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(t,s,a){this.links.set(t,{url:s,tooltip:a}),_.warn("Adding link",t,s,a)}getLinks(){return this.links}startIdIfNeeded(t=""){return t===$.START_NODE?(this.startEndCount++,`${$.START_TYPE}${this.startEndCount}`):t}startTypeIfNeeded(t="",s=et){return t===$.START_NODE?$.START_TYPE:s}endIdIfNeeded(t=""){return t===$.END_NODE?(this.startEndCount++,`${$.END_TYPE}${this.startEndCount}`):t}endTypeIfNeeded(t="",s=et){return t===$.END_NODE?$.END_TYPE:s}addRelationObjs(t,s,a=""){let i=this.startIdIfNeeded(t.id.trim()),l=this.startTypeIfNeeded(t.id.trim(),t.type),c=this.startIdIfNeeded(s.id.trim()),u=this.startTypeIfNeeded(s.id.trim(),s.type);this.addState(i,l,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),this.addState(c,u,s.doc,s.description,s.note,s.classes,s.styles,s.textStyles),this.currentDocument.relations.push({id1:i,id2:c,relationTitle:K.sanitizeText(a,P())})}addRelation(t,s,a){if(typeof t=="object"&&typeof s=="object")this.addRelationObjs(t,s,a);else if(typeof t=="string"&&typeof s=="string"){let i=this.startIdIfNeeded(t.trim()),l=this.startTypeIfNeeded(t),c=this.endIdIfNeeded(s.trim()),u=this.endTypeIfNeeded(s);this.addState(i,l),this.addState(c,u),this.currentDocument.relations.push({id1:i,id2:c,relationTitle:a?K.sanitizeText(a,P()):void 0})}}addDescription(t,s){var l;let a=this.currentDocument.states.get(t),i=s.startsWith(":")?s.replace(":","").trim():s;(l=a==null?void 0:a.descriptions)==null||l.push(K.sanitizeText(i,P()))}cleanupLabel(t){return t.startsWith(":")?t.slice(2).trim():t.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(t,s=""){this.classes.has(t)||this.classes.set(t,{id:t,styles:[],textStyles:[]});let a=this.classes.get(t);s&&a&&s.split($.STYLECLASS_SEP).forEach(i=>{let l=i.replace(/([^;]*);/,"$1").trim();if(RegExp($.COLOR_KEYWORD).exec(i)){let c=l.replace($.FILL_KEYWORD,$.BG_FILL).replace($.COLOR_KEYWORD,$.FILL_KEYWORD);a.textStyles.push(c)}a.styles.push(l)})}getClasses(){return this.classes}setCssClass(t,s){t.split(",").forEach(a=>{var l;let i=this.getState(a);if(!i){let c=a.trim();this.addState(c),i=this.getState(c)}(l=i==null?void 0:i.classes)==null||l.push(s)})}setStyle(t,s){var a,i;(i=(a=this.getState(t))==null?void 0:a.styles)==null||i.push(s)}setTextStyle(t,s){var a,i;(i=(a=this.getState(t))==null?void 0:a.textStyles)==null||i.push(s)}getDirectionStatement(){return this.rootDoc.find(t=>t.stmt==="dir")}getDirection(){var t,s;return(s=(t=this.getDirectionStatement())==null?void 0:t.value)!=null?s:"TB"}setDirection(t){let s=this.getDirectionStatement();s?s.value=t:this.rootDoc.unshift({stmt:"dir",value:t})}trimColon(t){return t.startsWith(":")?t.slice(1).trim():t.trim()}getData(){let t=P();return{nodes:this.nodes,edges:this.edges,other:{},config:t,direction:Kt(this.getRootDocV2())}}getConfig(){return P().state}},y(J,"StateDB"),J.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3},J),Re=y(e=>`
defs #statediagram-barbEnd {
    fill: ${e.transitionColor};
    stroke: ${e.transitionColor};
  }
g.stateGroup text {
  fill: ${e.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${e.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${e.stateLabelColor};
}

g.stateGroup rect {
  fill: ${e.mainBkg};
  stroke: ${e.nodeBorder};
}

g.stateGroup line {
  stroke: ${e.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${e.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${e.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${e.noteBorderColor};
  fill: ${e.noteBkgColor};

  text {
    fill: ${e.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${e.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${e.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${e.edgeLabelBackground};
  p {
    background-color: ${e.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${e.edgeLabelBackground};
    fill: ${e.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${e.transitionLabelColor||e.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${e.transitionLabelColor||e.tertiaryTextColor};
}

.stateLabel text {
  fill: ${e.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${e.specialStateColor};
  stroke: ${e.specialStateColor};
}

.node .fork-join {
  fill: ${e.specialStateColor};
  stroke: ${e.specialStateColor};
}

.node circle.state-end {
  fill: ${e.innerEndBackground};
  stroke: ${e.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${e.compositeBackground||e.background};
  // stroke: ${e.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${e.stateBkg||e.mainBkg};
  stroke: ${e.stateBorder||e.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${e.mainBkg};
  stroke: ${e.stateBorder||e.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${e.lineColor};
}

.statediagram-cluster rect {
  fill: ${e.compositeTitleBackground};
  stroke: ${e.stateBorder||e.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${e.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${e.stateBorder||e.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${e.compositeBackground||e.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${e.altBackground?e.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${e.altBackground?e.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${e.noteBkgColor};
  stroke: ${e.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${e.noteBkgColor};
  stroke: ${e.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${e.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${e.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${e.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${e.lineColor};
  stroke: ${e.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${e.textColor};
}
`,"getStyles"),ze=Re;export{Ge as B,Ue as _,ze as g,je as q};
