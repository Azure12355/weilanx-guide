import{m as c,$ as ue,G as de,e as he,j as fe,U as ye,H as me,a as ct,i as xt,aq as ke,ar as pe,as as ge,W as be,at as ve,au as Te,q as nt,p as st,av as xe,aw as Vt,ax as jt,ay as $e,az as we,aA as _e,aB as De,aC as Se,aD as Me,aE as Ce,aF as Ut,aG as qt,aH as Qt,aI as Jt,aJ as Xt,aK as Ye,h as Ee,N as Ae,aL as ee,f as Le,d as Ie,aM as St}from"./mermaid.esm.min-CW8jLCKK.js";import"./app-CjbR9_B3.js";var Fe=St((t,a)=>{(function(r,e){typeof t=="object"&&typeof a<"u"?a.exports=e():typeof define=="function"&&define.amd?define(e):(r=typeof globalThis<"u"?globalThis:r||self).dayjs_plugin_isoWeek=e()})(t,(function(){var r="day";return function(e,o,h){var b=c(function(C){return C.add(4-C.isoWeekday(),r)},"a"),M=o.prototype;M.isoWeekYear=function(){return b(this).year()},M.isoWeek=function(C){if(!this.$utils().u(C))return this.add(7*(C-this.isoWeek()),r);var _,L,O,N,H=b(this),D=(_=this.isoWeekYear(),L=this.$u,O=(L?h.utc:h)().year(_).startOf("year"),N=4-O.isoWeekday(),O.isoWeekday()>4&&(N+=7),O.add(N,r));return H.diff(D,"week")+1},M.isoWeekday=function(C){return this.$utils().u(C)?this.day()||7:this.day(this.day()%7?C:C-7)};var W=M.startOf;M.startOf=function(C,_){var L=this.$utils(),O=!!L.u(_)||_;return L.p(C)==="isoweek"?O?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):W.bind(this)(C,_)}}}))}),We=St((t,a)=>{(function(r,e){typeof t=="object"&&typeof a<"u"?a.exports=e():typeof define=="function"&&define.amd?define(e):(r=typeof globalThis<"u"?globalThis:r||self).dayjs_plugin_customParseFormat=e()})(t,(function(){var r={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},e=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,o=/\d/,h=/\d\d/,b=/\d\d?/,M=/\d*[^-_:/,()\s\d]+/,W={},C=c(function($){return($=+$)+($>68?1900:2e3)},"a"),_=c(function($){return function(S){this[$]=+S}},"f"),L=[/[+-]\d\d:?(\d\d)?|Z/,function($){(this.zone||(this.zone={})).offset=(function(S){if(!S||S==="Z")return 0;var F=S.match(/([+-]|\d\d)/g),E=60*F[1]+(+F[2]||0);return E===0?0:F[0]==="+"?-E:E})($)}],O=c(function($){var S=W[$];return S&&(S.indexOf?S:S.s.concat(S.f))},"u"),N=c(function($,S){var F,E=W.meridiem;if(E){for(var G=1;G<=24;G+=1)if($.indexOf(E(G,0,S))>-1){F=G>12;break}}else F=$===(S?"pm":"PM");return F},"d"),H={A:[M,function($){this.afternoon=N($,!1)}],a:[M,function($){this.afternoon=N($,!0)}],Q:[o,function($){this.month=3*($-1)+1}],S:[o,function($){this.milliseconds=100*+$}],SS:[h,function($){this.milliseconds=10*+$}],SSS:[/\d{3}/,function($){this.milliseconds=+$}],s:[b,_("seconds")],ss:[b,_("seconds")],m:[b,_("minutes")],mm:[b,_("minutes")],H:[b,_("hours")],h:[b,_("hours")],HH:[b,_("hours")],hh:[b,_("hours")],D:[b,_("day")],DD:[h,_("day")],Do:[M,function($){var S=W.ordinal,F=$.match(/\d+/);if(this.day=F[0],S)for(var E=1;E<=31;E+=1)S(E).replace(/\[|\]/g,"")===$&&(this.day=E)}],w:[b,_("week")],ww:[h,_("week")],M:[b,_("month")],MM:[h,_("month")],MMM:[M,function($){var S=O("months"),F=(O("monthsShort")||S.map((function(E){return E.slice(0,3)}))).indexOf($)+1;if(F<1)throw new Error;this.month=F%12||F}],MMMM:[M,function($){var S=O("months").indexOf($)+1;if(S<1)throw new Error;this.month=S%12||S}],Y:[/[+-]?\d+/,_("year")],YY:[h,function($){this.year=C($)}],YYYY:[/\d{4}/,_("year")],Z:L,ZZ:L};function D($){var S,F;S=$,F=W&&W.formats;for(var E=($=S.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(g,p,k){var m=k&&k.toUpperCase();return p||F[k]||r[k]||F[m].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(l,d,u){return d||u.slice(1)}))}))).match(e),G=E.length,V=0;V<G;V+=1){var Y=E[V],v=H[Y],y=v&&v[0],f=v&&v[1];E[V]=f?{regex:y,parser:f}:Y.replace(/^\[|\]$/g,"")}return function(g){for(var p={},k=0,m=0;k<G;k+=1){var l=E[k];if(typeof l=="string")m+=l.length;else{var d=l.regex,u=l.parser,T=g.slice(m),i=d.exec(T)[0];u.call(p,i),g=g.replace(i,"")}}return(function(s){var n=s.afternoon;if(n!==void 0){var x=s.hours;n?x<12&&(s.hours+=12):x===12&&(s.hours=0),delete s.afternoon}})(p),p}}return c(D,"l"),function($,S,F){F.p.customParseFormat=!0,$&&$.parseTwoDigitYear&&(C=$.parseTwoDigitYear);var E=S.prototype,G=E.parse;E.parse=function(V){var Y=V.date,v=V.utc,y=V.args;this.$u=v;var f=y[1];if(typeof f=="string"){var g=y[2]===!0,p=y[3]===!0,k=g||p,m=y[2];p&&(m=y[2]),W=this.$locale(),!g&&m&&(W=F.Ls[m]),this.$d=(function(T,i,s,n){try{if(["x","X"].indexOf(i)>-1)return new Date((i==="X"?1e3:1)*T);var x=D(i)(T),A=x.year,w=x.month,P=x.day,I=x.hours,ht=x.minutes,z=x.seconds,X=x.milliseconds,at=x.zone,ot=x.week,ft=new Date,yt=P||(A||w?1:ft.getDate()),lt=A||ft.getFullYear(),B=0;A&&!w||(B=w>0?w-1:ft.getMonth());var tt,Q=I||0,j=ht||0,bt=z||0,et=X||0;return at?new Date(Date.UTC(lt,B,yt,Q,j,bt,et+60*at.offset*1e3)):s?new Date(Date.UTC(lt,B,yt,Q,j,bt,et)):(tt=new Date(lt,B,yt,Q,j,bt,et),ot&&(tt=n(tt).week(ot).toDate()),tt)}catch(it){return new Date("")}})(Y,f,v,F),this.init(),m&&m!==!0&&(this.$L=this.locale(m).$L),k&&Y!=this.format(f)&&(this.$d=new Date("")),W={}}else if(f instanceof Array)for(var l=f.length,d=1;d<=l;d+=1){y[1]=f[d-1];var u=F.apply(this,y);if(u.isValid()){this.$d=u.$d,this.$L=u.$L,this.init();break}d===l&&(this.$d=new Date(""))}else G.call(this,V)}}}))}),Oe=St((t,a)=>{(function(r,e){typeof t=="object"&&typeof a<"u"?a.exports=e():typeof define=="function"&&define.amd?define(e):(r=typeof globalThis<"u"?globalThis:r||self).dayjs_plugin_advancedFormat=e()})(t,(function(){return function(r,e){var o=e.prototype,h=o.format;o.format=function(b){var M=this,W=this.$locale();if(!this.isValid())return h.bind(this)(b);var C=this.$utils(),_=(b||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(L){switch(L){case"Q":return Math.ceil((M.$M+1)/3);case"Do":return W.ordinal(M.$D);case"gggg":return M.weekYear();case"GGGG":return M.isoWeekYear();case"wo":return W.ordinal(M.week(),"W");case"w":case"ww":return C.s(M.week(),L==="w"?1:2,"0");case"W":case"WW":return C.s(M.isoWeek(),L==="W"?1:2,"0");case"k":case"kk":return C.s(String(M.$H===0?24:M.$H),L==="k"?1:2,"0");case"X":return Math.floor(M.$d.getTime()/1e3);case"x":return M.$d.getTime();case"z":return"["+M.offsetName()+"]";case"zzz":return"["+M.offsetName("long")+"]";default:return L}}));return h.bind(this)(_)}}}))}),Pe=St((t,a)=>{(function(r,e){typeof t=="object"&&typeof a<"u"?a.exports=e():typeof define=="function"&&define.amd?define(e):(r=typeof globalThis<"u"?globalThis:r||self).dayjs_plugin_duration=e()})(t,(function(){var r,e,o=1e3,h=6e4,b=36e5,M=864e5,W=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,C=31536e6,_=2628e6,L=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,O={years:C,months:_,days:M,hours:b,minutes:h,seconds:o,milliseconds:1,weeks:6048e5},N=c(function(Y){return Y instanceof G},"c"),H=c(function(Y,v,y){return new G(Y,y,v.$l)},"f"),D=c(function(Y){return e.p(Y)+"s"},"m"),$=c(function(Y){return Y<0},"l"),S=c(function(Y){return $(Y)?Math.ceil(Y):Math.floor(Y)},"$"),F=c(function(Y){return Math.abs(Y)},"y"),E=c(function(Y,v){return Y?$(Y)?{negative:!0,format:""+F(Y)+v}:{negative:!1,format:""+Y+v}:{negative:!1,format:""}},"v"),G=(function(){function Y(y,f,g){var p=this;if(this.$d={},this.$l=g,y===void 0&&(this.$ms=0,this.parseFromMilliseconds()),f)return H(y*O[D(f)],this);if(typeof y=="number")return this.$ms=y,this.parseFromMilliseconds(),this;if(typeof y=="object")return Object.keys(y).forEach((function(l){p.$d[D(l)]=y[l]})),this.calMilliseconds(),this;if(typeof y=="string"){var k=y.match(L);if(k){var m=k.slice(2).map((function(l){return l!=null?Number(l):0}));return this.$d.years=m[0],this.$d.months=m[1],this.$d.weeks=m[2],this.$d.days=m[3],this.$d.hours=m[4],this.$d.minutes=m[5],this.$d.seconds=m[6],this.calMilliseconds(),this}}return this}c(Y,"l");var v=Y.prototype;return v.calMilliseconds=function(){var y=this;this.$ms=Object.keys(this.$d).reduce((function(f,g){return f+(y.$d[g]||0)*O[g]}),0)},v.parseFromMilliseconds=function(){var y=this.$ms;this.$d.years=S(y/C),y%=C,this.$d.months=S(y/_),y%=_,this.$d.days=S(y/M),y%=M,this.$d.hours=S(y/b),y%=b,this.$d.minutes=S(y/h),y%=h,this.$d.seconds=S(y/o),y%=o,this.$d.milliseconds=y},v.toISOString=function(){var y=E(this.$d.years,"Y"),f=E(this.$d.months,"M"),g=+this.$d.days||0;this.$d.weeks&&(g+=7*this.$d.weeks);var p=E(g,"D"),k=E(this.$d.hours,"H"),m=E(this.$d.minutes,"M"),l=this.$d.seconds||0;this.$d.milliseconds&&(l+=this.$d.milliseconds/1e3,l=Math.round(1e3*l)/1e3);var d=E(l,"S"),u=y.negative||f.negative||p.negative||k.negative||m.negative||d.negative,T=k.format||m.format||d.format?"T":"",i=(u?"-":"")+"P"+y.format+f.format+p.format+T+k.format+m.format+d.format;return i==="P"||i==="-P"?"P0D":i},v.toJSON=function(){return this.toISOString()},v.format=function(y){var f=y||"YYYY-MM-DDTHH:mm:ss",g={Y:this.$d.years,YY:e.s(this.$d.years,2,"0"),YYYY:e.s(this.$d.years,4,"0"),M:this.$d.months,MM:e.s(this.$d.months,2,"0"),D:this.$d.days,DD:e.s(this.$d.days,2,"0"),H:this.$d.hours,HH:e.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:e.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:e.s(this.$d.seconds,2,"0"),SSS:e.s(this.$d.milliseconds,3,"0")};return f.replace(W,(function(p,k){return k||String(g[p])}))},v.as=function(y){return this.$ms/O[D(y)]},v.get=function(y){var f=this.$ms,g=D(y);return g==="milliseconds"?f%=1e3:f=g==="weeks"?S(f/O[g]):this.$d[g],f||0},v.add=function(y,f,g){var p;return p=f?y*O[D(f)]:N(y)?y.$ms:H(y,this).$ms,H(this.$ms+p*(g?-1:1),this)},v.subtract=function(y,f){return this.add(y,f,!0)},v.locale=function(y){var f=this.clone();return f.$l=y,f},v.clone=function(){return H(this.$ms,this)},v.humanize=function(y){return r().add(this.$ms,"ms").locale(this.$l).fromNow(!y)},v.valueOf=function(){return this.asMilliseconds()},v.milliseconds=function(){return this.get("milliseconds")},v.asMilliseconds=function(){return this.as("milliseconds")},v.seconds=function(){return this.get("seconds")},v.asSeconds=function(){return this.as("seconds")},v.minutes=function(){return this.get("minutes")},v.asMinutes=function(){return this.as("minutes")},v.hours=function(){return this.get("hours")},v.asHours=function(){return this.as("hours")},v.days=function(){return this.get("days")},v.asDays=function(){return this.as("days")},v.weeks=function(){return this.get("weeks")},v.asWeeks=function(){return this.as("weeks")},v.months=function(){return this.get("months")},v.asMonths=function(){return this.as("months")},v.years=function(){return this.get("years")},v.asYears=function(){return this.as("years")},Y})(),V=c(function(Y,v,y){return Y.add(v.years()*y,"y").add(v.months()*y,"M").add(v.days()*y,"d").add(v.hours()*y,"h").add(v.minutes()*y,"m").add(v.seconds()*y,"s").add(v.milliseconds()*y,"ms")},"p");return function(Y,v,y){r=y,e=y().$utils(),y.duration=function(p,k){var m=y.locale();return H(p,{$l:m},k)},y.isDuration=N;var f=v.prototype.add,g=v.prototype.subtract;v.prototype.add=function(p,k){return N(p)?V(this,p,1):f.bind(this)(p,k)},v.prototype.subtract=function(p,k){return N(p)?V(this,p,-1):g.bind(this)(p,k)}}}))}),Yt=(function(){var t=c(function(m,l,d,u){for(d=d||{},u=m.length;u--;d[m[u]]=l);return d},"o"),a=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],r=[1,26],e=[1,27],o=[1,28],h=[1,29],b=[1,30],M=[1,31],W=[1,32],C=[1,33],_=[1,34],L=[1,9],O=[1,10],N=[1,11],H=[1,12],D=[1,13],$=[1,14],S=[1,15],F=[1,16],E=[1,19],G=[1,20],V=[1,21],Y=[1,22],v=[1,23],y=[1,25],f=[1,35],g={trace:c(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:c(function(m,l,d,u,T,i,s){var n=i.length-1;switch(T){case 1:return i[n-1];case 2:this.$=[];break;case 3:i[n-1].push(i[n]),this.$=i[n-1];break;case 4:case 5:this.$=i[n];break;case 6:case 7:this.$=[];break;case 8:u.setWeekday("monday");break;case 9:u.setWeekday("tuesday");break;case 10:u.setWeekday("wednesday");break;case 11:u.setWeekday("thursday");break;case 12:u.setWeekday("friday");break;case 13:u.setWeekday("saturday");break;case 14:u.setWeekday("sunday");break;case 15:u.setWeekend("friday");break;case 16:u.setWeekend("saturday");break;case 17:u.setDateFormat(i[n].substr(11)),this.$=i[n].substr(11);break;case 18:u.enableInclusiveEndDates(),this.$=i[n].substr(18);break;case 19:u.TopAxis(),this.$=i[n].substr(8);break;case 20:u.setAxisFormat(i[n].substr(11)),this.$=i[n].substr(11);break;case 21:u.setTickInterval(i[n].substr(13)),this.$=i[n].substr(13);break;case 22:u.setExcludes(i[n].substr(9)),this.$=i[n].substr(9);break;case 23:u.setIncludes(i[n].substr(9)),this.$=i[n].substr(9);break;case 24:u.setTodayMarker(i[n].substr(12)),this.$=i[n].substr(12);break;case 27:u.setDiagramTitle(i[n].substr(6)),this.$=i[n].substr(6);break;case 28:this.$=i[n].trim(),u.setAccTitle(this.$);break;case 29:case 30:this.$=i[n].trim(),u.setAccDescription(this.$);break;case 31:u.addSection(i[n].substr(8)),this.$=i[n].substr(8);break;case 33:u.addTask(i[n-1],i[n]),this.$="task";break;case 34:this.$=i[n-1],u.setClickEvent(i[n-1],i[n],null);break;case 35:this.$=i[n-2],u.setClickEvent(i[n-2],i[n-1],i[n]);break;case 36:this.$=i[n-2],u.setClickEvent(i[n-2],i[n-1],null),u.setLink(i[n-2],i[n]);break;case 37:this.$=i[n-3],u.setClickEvent(i[n-3],i[n-2],i[n-1]),u.setLink(i[n-3],i[n]);break;case 38:this.$=i[n-2],u.setClickEvent(i[n-2],i[n],null),u.setLink(i[n-2],i[n-1]);break;case 39:this.$=i[n-3],u.setClickEvent(i[n-3],i[n-1],i[n]),u.setLink(i[n-3],i[n-2]);break;case 40:this.$=i[n-1],u.setLink(i[n-1],i[n]);break;case 41:case 47:this.$=i[n-1]+" "+i[n];break;case 42:case 43:case 45:this.$=i[n-2]+" "+i[n-1]+" "+i[n];break;case 44:case 46:this.$=i[n-3]+" "+i[n-2]+" "+i[n-1]+" "+i[n];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(a,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:r,13:e,14:o,15:h,16:b,17:M,18:W,19:18,20:C,21:_,22:L,23:O,24:N,25:H,26:D,27:$,28:S,29:F,30:E,31:G,33:V,35:Y,36:v,37:24,38:y,40:f},t(a,[2,7],{1:[2,1]}),t(a,[2,3]),{9:36,11:17,12:r,13:e,14:o,15:h,16:b,17:M,18:W,19:18,20:C,21:_,22:L,23:O,24:N,25:H,26:D,27:$,28:S,29:F,30:E,31:G,33:V,35:Y,36:v,37:24,38:y,40:f},t(a,[2,5]),t(a,[2,6]),t(a,[2,17]),t(a,[2,18]),t(a,[2,19]),t(a,[2,20]),t(a,[2,21]),t(a,[2,22]),t(a,[2,23]),t(a,[2,24]),t(a,[2,25]),t(a,[2,26]),t(a,[2,27]),{32:[1,37]},{34:[1,38]},t(a,[2,30]),t(a,[2,31]),t(a,[2,32]),{39:[1,39]},t(a,[2,8]),t(a,[2,9]),t(a,[2,10]),t(a,[2,11]),t(a,[2,12]),t(a,[2,13]),t(a,[2,14]),t(a,[2,15]),t(a,[2,16]),{41:[1,40],43:[1,41]},t(a,[2,4]),t(a,[2,28]),t(a,[2,29]),t(a,[2,33]),t(a,[2,34],{42:[1,42],43:[1,43]}),t(a,[2,40],{41:[1,44]}),t(a,[2,35],{43:[1,45]}),t(a,[2,36]),t(a,[2,38],{42:[1,46]}),t(a,[2,37]),t(a,[2,39])],defaultActions:{},parseError:c(function(m,l){if(l.recoverable)this.trace(m);else{var d=new Error(m);throw d.hash=l,d}},"parseError"),parse:c(function(m){var l=this,d=[0],u=[],T=[null],i=[],s=this.table,n="",x=0,A=0,w=0,P=2,I=1,ht=i.slice.call(arguments,1),z=Object.create(this.lexer),X={yy:{}};for(var at in this.yy)Object.prototype.hasOwnProperty.call(this.yy,at)&&(X.yy[at]=this.yy[at]);z.setInput(m,X.yy),X.yy.lexer=z,X.yy.parser=this,typeof z.yylloc>"u"&&(z.yylloc={});var ot=z.yylloc;i.push(ot);var ft=z.options&&z.options.ranges;typeof X.yy.parseError=="function"?this.parseError=X.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function yt(U){d.length=d.length-2*U,T.length=T.length-U,i.length=i.length-U}c(yt,"popStack");function lt(){var U;return U=u.pop()||z.lex()||I,typeof U!="number"&&(U instanceof Array&&(u=U,U=u.pop()),U=l.symbols_[U]||U),U}c(lt,"lex");for(var B,tt,Q,j,bt,et,it={},vt,Z,Rt,Tt;;){if(Q=d[d.length-1],this.defaultActions[Q]?j=this.defaultActions[Q]:((B===null||typeof B>"u")&&(B=lt()),j=s[Q]&&s[Q][B]),typeof j>"u"||!j.length||!j[0]){var Mt="";Tt=[];for(vt in s[Q])this.terminals_[vt]&&vt>P&&Tt.push("'"+this.terminals_[vt]+"'");z.showPosition?Mt="Parse error on line "+(x+1)+`:
`+z.showPosition()+`
Expecting `+Tt.join(", ")+", got '"+(this.terminals_[B]||B)+"'":Mt="Parse error on line "+(x+1)+": Unexpected "+(B==I?"end of input":"'"+(this.terminals_[B]||B)+"'"),this.parseError(Mt,{text:z.match,token:this.terminals_[B]||B,line:z.yylineno,loc:ot,expected:Tt})}if(j[0]instanceof Array&&j.length>1)throw new Error("Parse Error: multiple actions possible at state: "+Q+", token: "+B);switch(j[0]){case 1:d.push(B),T.push(z.yytext),i.push(z.yylloc),d.push(j[1]),B=null,tt?(B=tt,tt=null):(A=z.yyleng,n=z.yytext,x=z.yylineno,ot=z.yylloc,w>0);break;case 2:if(Z=this.productions_[j[1]][1],it.$=T[T.length-Z],it._$={first_line:i[i.length-(Z||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(Z||1)].first_column,last_column:i[i.length-1].last_column},ft&&(it._$.range=[i[i.length-(Z||1)].range[0],i[i.length-1].range[1]]),et=this.performAction.apply(it,[n,A,x,X.yy,j[1],T,i].concat(ht)),typeof et<"u")return et;Z&&(d=d.slice(0,-1*Z*2),T=T.slice(0,-1*Z),i=i.slice(0,-1*Z)),d.push(this.productions_[j[1]][0]),T.push(it.$),i.push(it._$),Rt=s[d[d.length-2]][d[d.length-1]],d.push(Rt);break;case 3:return!0}}return!0},"parse")},p=(function(){var m={EOF:1,parseError:c(function(l,d){if(this.yy.parser)this.yy.parser.parseError(l,d);else throw new Error(l)},"parseError"),setInput:c(function(l,d){return this.yy=d||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:c(function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var d=l.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},"input"),unput:c(function(l){var d=l.length,u=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var T=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),u.length-1&&(this.yylineno-=u.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:u?(u.length===T.length?this.yylloc.first_column:0)+T[T.length-u.length].length-u[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},"unput"),more:c(function(){return this._more=!0,this},"more"),reject:c(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:c(function(l){this.unput(this.match.slice(l))},"less"),pastInput:c(function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:c(function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:c(function(){var l=this.pastInput(),d=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+d+"^"},"showPosition"),test_match:c(function(l,d){var u,T,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),T=l[0].match(/(?:\r\n?|\n).*/g),T&&(this.yylineno+=T.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:T?T[T.length-1].length-T[T.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],u=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),u)return u;if(this._backtrack){for(var s in i)this[s]=i[s];return!1}return!1},"test_match"),next:c(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,d,u,T;this._more||(this.yytext="",this.match="");for(var i=this._currentRules(),s=0;s<i.length;s++)if(u=this._input.match(this.rules[i[s]]),u&&(!d||u[0].length>d[0].length)){if(d=u,T=s,this.options.backtrack_lexer){if(l=this.test_match(u,i[s]),l!==!1)return l;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(l=this.test_match(d,i[T]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:c(function(){var l=this.next();return l||this.lex()},"lex"),begin:c(function(l){this.conditionStack.push(l)},"begin"),popState:c(function(){var l=this.conditionStack.length-1;return l>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:c(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:c(function(l){return l=this.conditionStack.length-1-Math.abs(l||0),l>=0?this.conditionStack[l]:"INITIAL"},"topState"),pushState:c(function(l){this.begin(l)},"pushState"),stateStackSize:c(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:c(function(l,d,u,T){switch(u){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return m})();g.lexer=p;function k(){this.yy={}}return c(k,"Parser"),k.prototype=g,g.Parser=k,new k})();Yt.parser=Yt;var He=Yt,ze=nt(Le()),q=nt(ee()),Ne=nt(Fe()),Be=nt(We()),Ge=nt(Oe());q.default.extend(Ne.default);q.default.extend(Be.default);q.default.extend(Ge.default);var Zt={friday:5,saturday:6},J="",It="",Ft,Wt="",kt=[],pt=[],Ot=new Map,Pt=[],_t=[],dt="",Ht="",ie=["active","done","crit","milestone","vert"],zt=[],gt=!1,Nt=!1,Bt="sunday",Dt="saturday",Et=0,Re=c(function(){Pt=[],_t=[],dt="",zt=[],$t=0,Lt=void 0,wt=void 0,R=[],J="",It="",Ht="",Ft=void 0,Wt="",kt=[],pt=[],gt=!1,Nt=!1,Et=0,Ot=new Map,Ae(),Bt="sunday",Dt="saturday"},"clear"),Ve=c(function(t){It=t},"setAxisFormat"),je=c(function(){return It},"getAxisFormat"),Ue=c(function(t){Ft=t},"setTickInterval"),qe=c(function(){return Ft},"getTickInterval"),Qe=c(function(t){Wt=t},"setTodayMarker"),Je=c(function(){return Wt},"getTodayMarker"),Xe=c(function(t){J=t},"setDateFormat"),Ze=c(function(){gt=!0},"enableInclusiveEndDates"),Ke=c(function(){return gt},"endDatesAreInclusive"),ti=c(function(){Nt=!0},"enableTopAxis"),ei=c(function(){return Nt},"topAxisEnabled"),ii=c(function(t){Ht=t},"setDisplayMode"),si=c(function(){return Ht},"getDisplayMode"),ni=c(function(){return J},"getDateFormat"),ri=c(function(t){kt=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),ai=c(function(){return kt},"getIncludes"),oi=c(function(t){pt=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),li=c(function(){return pt},"getExcludes"),ci=c(function(){return Ot},"getLinks"),ui=c(function(t){dt=t,Pt.push(t)},"addSection"),di=c(function(){return Pt},"getSections"),hi=c(function(){let t=Kt(),a=10,r=0;for(;!t&&r<a;)t=Kt(),r++;return _t=R,_t},"getTasks"),se=c(function(t,a,r,e){let o=t.format(a.trim()),h=t.format("YYYY-MM-DD");return e.includes(o)||e.includes(h)?!1:r.includes("weekends")&&(t.isoWeekday()===Zt[Dt]||t.isoWeekday()===Zt[Dt]+1)||r.includes(t.format("dddd").toLowerCase())?!0:r.includes(o)||r.includes(h)},"isInvalidDate"),fi=c(function(t){Bt=t},"setWeekday"),yi=c(function(){return Bt},"getWeekday"),mi=c(function(t){Dt=t},"setWeekend"),ne=c(function(t,a,r,e){if(!r.length||t.manualEndTime)return;let o;t.startTime instanceof Date?o=(0,q.default)(t.startTime):o=(0,q.default)(t.startTime,a,!0),o=o.add(1,"d");let h;t.endTime instanceof Date?h=(0,q.default)(t.endTime):h=(0,q.default)(t.endTime,a,!0);let[b,M]=ki(o,h,a,r,e);t.endTime=b.toDate(),t.renderEndTime=M},"checkTaskDates"),ki=c(function(t,a,r,e,o){let h=!1,b=null;for(;t<=a;)h||(b=a.toDate()),h=se(t,r,e,o),h&&(a=a.add(1,"d")),t=t.add(1,"d");return[a,b]},"fixTaskDates"),At=c(function(t,a,r){if(r=r.trim(),c(h=>{let b=h.trim();return b==="x"||b==="X"},"isTimestampFormat")(a)&&/^\d+$/.test(r))return new Date(Number(r));let e=new RegExp("^after\\s+(?<ids>[\\d\\w- ]+)").exec(r);if(e!==null){let h=null;for(let M of e.groups.ids.split(" ")){let W=rt(M);W!==void 0&&(!h||W.endTime>h.endTime)&&(h=W)}if(h)return h.endTime;let b=new Date;return b.setHours(0,0,0,0),b}let o=(0,q.default)(r,a.trim(),!0);if(o.isValid())return o.toDate();{st.debug("Invalid date:"+r),st.debug("With date format:"+a.trim());let h=new Date(r);if(h===void 0||isNaN(h.getTime())||h.getFullYear()<-1e4||h.getFullYear()>1e4)throw new Error("Invalid date:"+r);return h}},"getStartDate"),re=c(function(t){let a=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return a!==null?[Number.parseFloat(a[1]),a[2]]:[NaN,"ms"]},"parseDuration"),ae=c(function(t,a,r,e=!1){r=r.trim();let o=new RegExp("^until\\s+(?<ids>[\\d\\w- ]+)").exec(r);if(o!==null){let C=null;for(let L of o.groups.ids.split(" ")){let O=rt(L);O!==void 0&&(!C||O.startTime<C.startTime)&&(C=O)}if(C)return C.startTime;let _=new Date;return _.setHours(0,0,0,0),_}let h=(0,q.default)(r,a.trim(),!0);if(h.isValid())return e&&(h=h.add(1,"d")),h.toDate();let b=(0,q.default)(t),[M,W]=re(r);if(!Number.isNaN(M)){let C=b.add(M,W);C.isValid()&&(b=C)}return b.toDate()},"getEndDate"),$t=0,ut=c(function(t){return t===void 0?($t=$t+1,"task"+$t):t},"parseId"),pi=c(function(t,a){let r;a.substr(0,1)===":"?r=a.substr(1,a.length):r=a;let e=r.split(","),o={};Gt(e,o,ie);for(let b=0;b<e.length;b++)e[b]=e[b].trim();let h="";switch(e.length){case 1:o.id=ut(),o.startTime=t.endTime,h=e[0];break;case 2:o.id=ut(),o.startTime=At(void 0,J,e[0]),h=e[1];break;case 3:o.id=ut(e[0]),o.startTime=At(void 0,J,e[1]),h=e[2];break}return h&&(o.endTime=ae(o.startTime,J,h,gt),o.manualEndTime=(0,q.default)(h,"YYYY-MM-DD",!0).isValid(),ne(o,J,pt,kt)),o},"compileData"),gi=c(function(t,a){let r;a.substr(0,1)===":"?r=a.substr(1,a.length):r=a;let e=r.split(","),o={};Gt(e,o,ie);for(let h=0;h<e.length;h++)e[h]=e[h].trim();switch(e.length){case 1:o.id=ut(),o.startTime={type:"prevTaskEnd",id:t},o.endTime={data:e[0]};break;case 2:o.id=ut(),o.startTime={type:"getStartDate",startData:e[0]},o.endTime={data:e[1]};break;case 3:o.id=ut(e[0]),o.startTime={type:"getStartDate",startData:e[1]},o.endTime={data:e[2]};break}return o},"parseData"),Lt,wt,R=[],oe={},bi=c(function(t,a){let r={section:dt,type:dt,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:a},task:t,classes:[]},e=gi(wt,a);r.raw.startTime=e.startTime,r.raw.endTime=e.endTime,r.id=e.id,r.prevTaskId=wt,r.active=e.active,r.done=e.done,r.crit=e.crit,r.milestone=e.milestone,r.vert=e.vert,r.order=Et,Et++;let o=R.push(r);wt=r.id,oe[r.id]=o-1},"addTask"),rt=c(function(t){let a=oe[t];return R[a]},"findTaskById"),vi=c(function(t,a){let r={section:dt,type:dt,description:t,task:t,classes:[]},e=pi(Lt,a);r.startTime=e.startTime,r.endTime=e.endTime,r.id=e.id,r.active=e.active,r.done=e.done,r.crit=e.crit,r.milestone=e.milestone,r.vert=e.vert,Lt=r,_t.push(r)},"addTaskOrg"),Kt=c(function(){let t=c(function(r){let e=R[r],o="";switch(R[r].raw.startTime.type){case"prevTaskEnd":{let h=rt(e.prevTaskId);e.startTime=h.endTime;break}case"getStartDate":o=At(void 0,J,R[r].raw.startTime.startData),o&&(R[r].startTime=o);break}return R[r].startTime&&(R[r].endTime=ae(R[r].startTime,J,R[r].raw.endTime.data,gt),R[r].endTime&&(R[r].processed=!0,R[r].manualEndTime=(0,q.default)(R[r].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),ne(R[r],J,pt,kt))),R[r].processed},"compileTask"),a=!0;for(let[r,e]of R.entries())t(r),a=a&&e.processed;return a},"compileTasks"),Ti=c(function(t,a){let r=a;ct().securityLevel!=="loose"&&(r=(0,ze.sanitizeUrl)(a)),t.split(",").forEach(function(e){rt(e)!==void 0&&(ce(e,()=>{window.open(r,"_self")}),Ot.set(e,r))}),le(t,"clickable")},"setLink"),le=c(function(t,a){t.split(",").forEach(function(r){let e=rt(r);e!==void 0&&e.classes.push(a)})},"setClass"),xi=c(function(t,a,r){if(ct().securityLevel!=="loose"||a===void 0)return;let e=[];if(typeof r=="string"){e=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let o=0;o<e.length;o++){let h=e[o].trim();h.startsWith('"')&&h.endsWith('"')&&(h=h.substr(1,h.length-2)),e[o]=h}}e.length===0&&e.push(t),rt(t)!==void 0&&ce(t,()=>{Ie.runFunc(a,...e)})},"setClickFun"),ce=c(function(t,a){zt.push(function(){let r=document.querySelector(`[id="${t}"]`);r!==null&&r.addEventListener("click",function(){a()})},function(){let r=document.querySelector(`[id="${t}-text"]`);r!==null&&r.addEventListener("click",function(){a()})})},"pushFun"),$i=c(function(t,a,r){t.split(",").forEach(function(e){xi(e,a,r)}),le(t,"clickable")},"setClickEvent"),wi=c(function(t){zt.forEach(function(a){a(t)})},"bindFunctions"),_i={getConfig:c(()=>ct().gantt,"getConfig"),clear:Re,setDateFormat:Xe,getDateFormat:ni,enableInclusiveEndDates:Ze,endDatesAreInclusive:Ke,enableTopAxis:ti,topAxisEnabled:ei,setAxisFormat:Ve,getAxisFormat:je,setTickInterval:Ue,getTickInterval:qe,setTodayMarker:Qe,getTodayMarker:Je,setAccTitle:me,getAccTitle:ye,setDiagramTitle:fe,getDiagramTitle:he,setDisplayMode:ii,getDisplayMode:si,setAccDescription:de,getAccDescription:ue,addSection:ui,getSections:di,getTasks:hi,addTask:bi,findTaskById:rt,addTaskOrg:vi,setIncludes:ri,getIncludes:ai,setExcludes:oi,getExcludes:li,setClickEvent:$i,setLink:Ti,getLinks:ci,bindFunctions:wi,parseDuration:re,isInvalidDate:se,setWeekday:fi,getWeekday:yi,setWeekend:mi};function Gt(t,a,r){let e=!0;for(;e;)e=!1,r.forEach(function(o){let h="^\\s*"+o+"\\s*$",b=new RegExp(h);t[0].match(b)&&(a[o]=!0,t.shift(1),e=!0)})}c(Gt,"getTaskTags");var mt=nt(ee()),Di=nt(Pe());mt.default.extend(Di.default);var Si=c(function(){st.debug("Something is calling, setConf, remove the call")},"setConf"),te={monday:Ce,tuesday:Me,wednesday:Se,thursday:De,friday:_e,saturday:we,sunday:$e},Mi=c((t,a)=>{let r=[...t].map(()=>-1/0),e=[...t].sort((h,b)=>h.startTime-b.startTime||h.order-b.order),o=0;for(let h of e)for(let b=0;b<r.length;b++)if(h.startTime>=r[b]){r[b]=h.endTime,h.order=b+a,b>o&&(o=b);break}return o},"getMaxIntersections"),K,Ct=1e4,Ci=c(function(t,a,r,e){let o=ct().gantt,h=ct().securityLevel,b;h==="sandbox"&&(b=xt("#i"+a));let M=h==="sandbox"?xt(b.nodes()[0].contentDocument.body):xt("body"),W=h==="sandbox"?b.nodes()[0].contentDocument:document,C=W.getElementById(a);K=C.parentElement.offsetWidth,K===void 0&&(K=1200),o.useWidth!==void 0&&(K=o.useWidth);let _=e.db.getTasks(),L=[];for(let f of _)L.push(f.type);L=y(L);let O={},N=2*o.topPadding;if(e.db.getDisplayMode()==="compact"||o.displayMode==="compact"){let f={};for(let p of _)f[p.section]===void 0?f[p.section]=[p]:f[p.section].push(p);let g=0;for(let p of Object.keys(f)){let k=Mi(f[p],g)+1;g+=k,N+=k*(o.barHeight+o.barGap),O[p]=k}}else{N+=_.length*(o.barHeight+o.barGap);for(let f of L)O[f]=_.filter(g=>g.type===f).length}C.setAttribute("viewBox","0 0 "+K+" "+N);let H=M.select(`[id="${a}"]`),D=ke().domain([pe(_,function(f){return f.startTime}),ge(_,function(f){return f.endTime})]).rangeRound([0,K-o.leftPadding-o.rightPadding]);function $(f,g){let p=f.startTime,k=g.startTime,m=0;return p>k?m=1:p<k&&(m=-1),m}c($,"taskCompare"),_.sort($),S(_,K,N),be(H,N,K,o.useMaxWidth),H.append("text").text(e.db.getDiagramTitle()).attr("x",K/2).attr("y",o.titleTopMargin).attr("class","titleText");function S(f,g,p){let k=o.barHeight,m=k+o.barGap,l=o.topPadding,d=o.leftPadding,u=ve().domain([0,L.length]).range(["#00B9FA","#F95002"]).interpolate(Te);E(m,l,d,g,p,f,e.db.getExcludes(),e.db.getIncludes()),V(d,l,g,p),F(f,m,l,d,k,u,g),Y(m,l),v(d,l,g,p)}c(S,"makeGantt");function F(f,g,p,k,m,l,d){f.sort((s,n)=>s.vert===n.vert?0:s.vert?1:-1);let u=[...new Set(f.map(s=>s.order))].map(s=>f.find(n=>n.order===s));H.append("g").selectAll("rect").data(u).enter().append("rect").attr("x",0).attr("y",function(s,n){return n=s.order,n*g+p-2}).attr("width",function(){return d-o.rightPadding/2}).attr("height",g).attr("class",function(s){for(let[n,x]of L.entries())if(s.type===x)return"section section"+n%o.numberSectionStyles;return"section section0"}).enter();let T=H.append("g").selectAll("rect").data(f).enter(),i=e.db.getLinks();if(T.append("rect").attr("id",function(s){return s.id}).attr("rx",3).attr("ry",3).attr("x",function(s){return s.milestone?D(s.startTime)+k+.5*(D(s.endTime)-D(s.startTime))-.5*m:D(s.startTime)+k}).attr("y",function(s,n){return n=s.order,s.vert?o.gridLineStartPadding:n*g+p}).attr("width",function(s){return s.milestone?m:s.vert?.08*m:D(s.renderEndTime||s.endTime)-D(s.startTime)}).attr("height",function(s){return s.vert?_.length*(o.barHeight+o.barGap)+o.barHeight*2:m}).attr("transform-origin",function(s,n){return n=s.order,(D(s.startTime)+k+.5*(D(s.endTime)-D(s.startTime))).toString()+"px "+(n*g+p+.5*m).toString()+"px"}).attr("class",function(s){let n="task",x="";s.classes.length>0&&(x=s.classes.join(" "));let A=0;for(let[P,I]of L.entries())s.type===I&&(A=P%o.numberSectionStyles);let w="";return s.active?s.crit?w+=" activeCrit":w=" active":s.done?s.crit?w=" doneCrit":w=" done":s.crit&&(w+=" crit"),w.length===0&&(w=" task"),s.milestone&&(w=" milestone "+w),s.vert&&(w=" vert "+w),w+=A,w+=" "+x,n+w}),T.append("text").attr("id",function(s){return s.id+"-text"}).text(function(s){return s.task}).attr("font-size",o.fontSize).attr("x",function(s){let n=D(s.startTime),x=D(s.renderEndTime||s.endTime);if(s.milestone&&(n+=.5*(D(s.endTime)-D(s.startTime))-.5*m,x=n+m),s.vert)return D(s.startTime)+k;let A=this.getBBox().width;return A>x-n?x+A+1.5*o.leftPadding>d?n+k-5:x+k+5:(x-n)/2+n+k}).attr("y",function(s,n){return s.vert?o.gridLineStartPadding+_.length*(o.barHeight+o.barGap)+60:(n=s.order,n*g+o.barHeight/2+(o.fontSize/2-2)+p)}).attr("text-height",m).attr("class",function(s){let n=D(s.startTime),x=D(s.endTime);s.milestone&&(x=n+m);let A=this.getBBox().width,w="";s.classes.length>0&&(w=s.classes.join(" "));let P=0;for(let[ht,z]of L.entries())s.type===z&&(P=ht%o.numberSectionStyles);let I="";return s.active&&(s.crit?I="activeCritText"+P:I="activeText"+P),s.done?s.crit?I=I+" doneCritText"+P:I=I+" doneText"+P:s.crit&&(I=I+" critText"+P),s.milestone&&(I+=" milestoneText"),s.vert&&(I+=" vertText"),A>x-n?x+A+1.5*o.leftPadding>d?w+" taskTextOutsideLeft taskTextOutside"+P+" "+I:w+" taskTextOutsideRight taskTextOutside"+P+" "+I+" width-"+A:w+" taskText taskText"+P+" "+I+" width-"+A}),ct().securityLevel==="sandbox"){let s;s=xt("#i"+a);let n=s.nodes()[0].contentDocument;T.filter(function(x){return i.has(x.id)}).each(function(x){var A=n.querySelector("#"+x.id),w=n.querySelector("#"+x.id+"-text");let P=A.parentNode;var I=n.createElement("a");I.setAttribute("xlink:href",i.get(x.id)),I.setAttribute("target","_top"),P.appendChild(I),I.appendChild(A),I.appendChild(w)})}}c(F,"drawRects");function E(f,g,p,k,m,l,d,u){if(d.length===0&&u.length===0)return;let T,i;for(let{startTime:w,endTime:P}of l)(T===void 0||w<T)&&(T=w),(i===void 0||P>i)&&(i=P);if(!T||!i)return;if((0,mt.default)(i).diff((0,mt.default)(T),"year")>5){st.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}let s=e.db.getDateFormat(),n=[],x=null,A=(0,mt.default)(T);for(;A.valueOf()<=i;)e.db.isInvalidDate(A,s,d,u)?x?x.end=A:x={start:A,end:A}:x&&(n.push(x),x=null),A=A.add(1,"d");H.append("g").selectAll("rect").data(n).enter().append("rect").attr("id",w=>"exclude-"+w.start.format("YYYY-MM-DD")).attr("x",w=>D(w.start.startOf("day"))+p).attr("y",o.gridLineStartPadding).attr("width",w=>D(w.end.endOf("day"))-D(w.start.startOf("day"))).attr("height",m-g-o.gridLineStartPadding).attr("transform-origin",function(w,P){return(D(w.start)+p+.5*(D(w.end)-D(w.start))).toString()+"px "+(P*f+.5*m).toString()+"px"}).attr("class","exclude-range")}c(E,"drawExcludeDays");function G(f,g,p,k){if(p<=0||f>g)return 1/0;let m=g-f,l=mt.default.duration({[k!=null?k:"day"]:p}).asMilliseconds();return l<=0?1/0:Math.ceil(m/l)}c(G,"getEstimatedTickCount");function V(f,g,p,k){var i;let m=e.db.getDateFormat(),l=e.db.getAxisFormat(),d;l?d=l:m==="D"?d="%d":d=(i=o.axisFormat)!=null?i:"%Y-%m-%d";let u=xe(D).tickSize(-k+g+o.gridLineStartPadding).tickFormat(Vt(d)),T=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(e.db.getTickInterval()||o.tickInterval);if(T!==null){let s=parseInt(T[1],10);if(isNaN(s)||s<=0)st.warn(`Invalid tick interval value: "${T[1]}". Skipping custom tick interval.`);else{let n=T[2],x=e.db.getWeekday()||o.weekday,A=D.domain(),w=A[0],P=A[1],I=G(w,P,s,n);if(I>Ct)st.warn(`The tick interval "${s}${n}" would generate ${I} ticks, which exceeds the maximum allowed (${Ct}). This may indicate an invalid date or time range. Skipping custom tick interval.`);else switch(n){case"millisecond":u.ticks(Xt.every(s));break;case"second":u.ticks(Jt.every(s));break;case"minute":u.ticks(Qt.every(s));break;case"hour":u.ticks(qt.every(s));break;case"day":u.ticks(Ut.every(s));break;case"week":u.ticks(te[x].every(s));break;case"month":u.ticks(jt.every(s));break}}}if(H.append("g").attr("class","grid").attr("transform","translate("+f+", "+(k-50)+")").call(u).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),e.db.topAxisEnabled()||o.topAxis){let s=Ye(D).tickSize(-k+g+o.gridLineStartPadding).tickFormat(Vt(d));if(T!==null){let n=parseInt(T[1],10);if(isNaN(n)||n<=0)st.warn(`Invalid tick interval value: "${T[1]}". Skipping custom tick interval.`);else{let x=T[2],A=e.db.getWeekday()||o.weekday,w=D.domain(),P=w[0],I=w[1];if(G(P,I,n,x)<=Ct)switch(x){case"millisecond":s.ticks(Xt.every(n));break;case"second":s.ticks(Jt.every(n));break;case"minute":s.ticks(Qt.every(n));break;case"hour":s.ticks(qt.every(n));break;case"day":s.ticks(Ut.every(n));break;case"week":s.ticks(te[A].every(n));break;case"month":s.ticks(jt.every(n));break}}}H.append("g").attr("class","grid").attr("transform","translate("+f+", "+g+")").call(s).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}c(V,"makeGrid");function Y(f,g){let p=0,k=Object.keys(O).map(m=>[m,O[m]]);H.append("g").selectAll("text").data(k).enter().append(function(m){let l=m[0].split(Ee.lineBreakRegex),d=-(l.length-1)/2,u=W.createElementNS("http://www.w3.org/2000/svg","text");u.setAttribute("dy",d+"em");for(let[T,i]of l.entries()){let s=W.createElementNS("http://www.w3.org/2000/svg","tspan");s.setAttribute("alignment-baseline","central"),s.setAttribute("x","10"),T>0&&s.setAttribute("dy","1em"),s.textContent=i,u.appendChild(s)}return u}).attr("x",10).attr("y",function(m,l){if(l>0)for(let d=0;d<l;d++)return p+=k[l-1][1],m[1]*f/2+p*f+g;else return m[1]*f/2+g}).attr("font-size",o.sectionFontSize).attr("class",function(m){for(let[l,d]of L.entries())if(m[0]===d)return"sectionTitle sectionTitle"+l%o.numberSectionStyles;return"sectionTitle"})}c(Y,"vertLabels");function v(f,g,p,k){let m=e.db.getTodayMarker();if(m==="off")return;let l=H.append("g").attr("class","today"),d=new Date,u=l.append("line");u.attr("x1",D(d)+f).attr("x2",D(d)+f).attr("y1",o.titleTopMargin).attr("y2",k-o.titleTopMargin).attr("class","today"),m!==""&&u.attr("style",m.replace(/,/g,";"))}c(v,"drawToday");function y(f){let g={},p=[];for(let k=0,m=f.length;k<m;++k)Object.prototype.hasOwnProperty.call(g,f[k])||(g[f[k]]=!0,p.push(f[k]));return p}c(y,"checkUnique")},"draw"),Yi={setConf:Si,draw:Ci},Ei=c(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .vert {
    stroke: ${t.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${t.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles"),Ai=Ei,Fi={parser:He,db:_i,renderer:Yi,styles:Ai};export{Fi as diagram};
