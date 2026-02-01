var z=Object.defineProperty;var C=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var M=(a,t,e)=>t in a?z(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e,w=(a,t)=>{for(var e in t||(t={}))P.call(t,e)&&M(a,e,t[e]);if(C)for(var e of C(t))G.call(t,e)&&M(a,e,t[e]);return a};var L=(a,t,e)=>new Promise((r,i)=>{var n=l=>{try{s(e.next(l))}catch(d){i(d)}},o=l=>{try{s(e.throw(l))}catch(d){i(d)}},s=l=>l.done?r(l.value):Promise.resolve(l.value).then(n,o);s((e=e.apply(a,t)).next())});import{c as R}from"./chunk-4KE642ED-k49be82e.js";import{p as D}from"./treemap-KMMF4GRG-7ORZ52ND-PqQsu5rY.js";import{m as c,G as N,$ as j,e as B,j as H,U as V,H as W,aN as U,N as _,L as b,O as T,r as Z,p as q,aT as J}from"./mermaid.esm.min-C1sZ0LMM.js";import"./chunk-OMTJKCYW-aNhJh7Lu.js";import"./app-CoKNEZDN.js";var m={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},k={axes:[],curves:[],options:m},x=structuredClone(k),K=Z.radar,Q=c(()=>b(w(w({},K),T().radar)),"getConfig"),A=c(()=>x.axes,"getAxes"),X=c(()=>x.curves,"getCurves"),Y=c(()=>x.options,"getOptions"),tt=c(a=>{x.axes=a.map(t=>{var e;return{name:t.name,label:(e=t.label)!=null?e:t.name}})},"setAxes"),et=c(a=>{x.curves=a.map(t=>{var e;return{name:t.name,label:(e=t.label)!=null?e:t.name,entries:at(t.entries)}})},"setCurves"),at=c(a=>{if(a[0].axis==null)return a.map(e=>e.value);let t=A();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(e=>{let r=a.find(i=>{var n;return((n=i.axis)==null?void 0:n.$refText)===e.name});if(r===void 0)throw new Error("Missing entry for axis "+e.label);return r.value})},"computeCurveEntries"),rt=c(a=>{var e,r,i,n,o,s,l,d,p,g;let t=a.reduce((h,u)=>(h[u.name]=u,h),{});x.options={showLegend:(r=(e=t.showLegend)==null?void 0:e.value)!=null?r:m.showLegend,ticks:(n=(i=t.ticks)==null?void 0:i.value)!=null?n:m.ticks,max:(s=(o=t.max)==null?void 0:o.value)!=null?s:m.max,min:(d=(l=t.min)==null?void 0:l.value)!=null?d:m.min,graticule:(g=(p=t.graticule)==null?void 0:p.value)!=null?g:m.graticule}},"setOptions"),it=c(()=>{_(),x=structuredClone(k)},"clear"),y={getAxes:A,getCurves:X,getOptions:Y,setAxes:tt,setCurves:et,setOptions:rt,getConfig:Q,clear:it,setAccTitle:W,getAccTitle:V,setDiagramTitle:H,getDiagramTitle:B,getAccDescription:j,setAccDescription:N},st=c(a=>{R(a,y);let{axes:t,curves:e,options:r}=a;y.setAxes(t),y.setCurves(e),y.setOptions(r)},"populate"),nt={parse:c(a=>L(null,null,function*(){let t=yield D("radar",a);q.debug(t),st(t)}),"parse")},lt=c((a,t,e,r)=>{var f;let i=r.db,n=i.getAxes(),o=i.getCurves(),s=i.getOptions(),l=i.getConfig(),d=i.getDiagramTitle(),p=U(t),g=ot(p,l),h=(f=s.max)!=null?f:Math.max(...o.map(v=>Math.max(...v.entries))),u=s.min,$=Math.min(l.width,l.height)/2;ct(g,n,$,s.ticks,s.graticule),dt(g,n,$,l),O(g,n,o,u,h,s.graticule,l),E(g,o,s.showLegend,l),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-l.height/2-l.marginTop)},"draw"),ot=c((a,t)=>{let e=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return a.attr("viewbox",`0 0 ${e} ${r}`).attr("width",e).attr("height",r),a.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),ct=c((a,t,e,r,i)=>{if(i==="circle")for(let n=0;n<r;n++){let o=e*(n+1)/r;a.append("circle").attr("r",o).attr("class","radarGraticule")}else if(i==="polygon"){let n=t.length;for(let o=0;o<r;o++){let s=e*(o+1)/r,l=t.map((d,p)=>{let g=2*p*Math.PI/n-Math.PI/2,h=s*Math.cos(g),u=s*Math.sin(g);return`${h},${u}`}).join(" ");a.append("polygon").attr("points",l).attr("class","radarGraticule")}}},"drawGraticule"),dt=c((a,t,e,r)=>{let i=t.length;for(let n=0;n<i;n++){let o=t[n].label,s=2*n*Math.PI/i-Math.PI/2;a.append("line").attr("x1",0).attr("y1",0).attr("x2",e*r.axisScaleFactor*Math.cos(s)).attr("y2",e*r.axisScaleFactor*Math.sin(s)).attr("class","radarAxisLine"),a.append("text").text(o).attr("x",e*r.axisLabelFactor*Math.cos(s)).attr("y",e*r.axisLabelFactor*Math.sin(s)).attr("class","radarAxisLabel")}},"drawAxes");function O(a,t,e,r,i,n,o){let s=t.length,l=Math.min(o.width,o.height)/2;e.forEach((d,p)=>{if(d.entries.length!==s)return;let g=d.entries.map((h,u)=>{let $=2*Math.PI*u/s-Math.PI/2,f=I(h,r,i,l),v=f*Math.cos($),F=f*Math.sin($);return{x:v,y:F}});n==="circle"?a.append("path").attr("d",S(g,o.curveTension)).attr("class",`radarCurve-${p}`):n==="polygon"&&a.append("polygon").attr("points",g.map(h=>`${h.x},${h.y}`).join(" ")).attr("class",`radarCurve-${p}`)})}c(O,"drawCurves");function I(a,t,e,r){let i=Math.min(Math.max(a,t),e);return r*(i-t)/(e-t)}c(I,"relativeRadius");function S(a,t){let e=a.length,r=`M${a[0].x},${a[0].y}`;for(let i=0;i<e;i++){let n=a[(i-1+e)%e],o=a[i],s=a[(i+1)%e],l=a[(i+2)%e],d={x:o.x+(s.x-n.x)*t,y:o.y+(s.y-n.y)*t},p={x:s.x-(l.x-o.x)*t,y:s.y-(l.y-o.y)*t};r+=` C${d.x},${d.y} ${p.x},${p.y} ${s.x},${s.y}`}return`${r} Z`}c(S,"closedRoundCurve");function E(a,t,e,r){if(!e)return;let i=(r.width/2+r.marginRight)*3/4,n=-(r.height/2+r.marginTop)*3/4,o=20;t.forEach((s,l)=>{let d=a.append("g").attr("transform",`translate(${i}, ${n+l*o})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${l}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(s.label)})}c(E,"drawLegend");var gt={draw:lt},pt=c((a,t)=>{let e="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){let i=a[`cScale${r}`];e+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return e},"genIndexStyles"),ht=c(a=>{let t=J(),e=T(),r=b(t,e.themeVariables),i=b(r.radar,a);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),ut=c(({radar:a}={})=>{let{themeVariables:t,radarOptions:e}=ht(a);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${e.axisColor};
		stroke-width: ${e.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${e.axisLabelFontSize}px;
		color: ${e.axisColor};
	}
	.radarGraticule {
		fill: ${e.graticuleColor};
		fill-opacity: ${e.graticuleOpacity};
		stroke: ${e.graticuleColor};
		stroke-width: ${e.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${e.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${pt(t,e)}
	`},"styles"),wt={parser:nt,db:y,renderer:gt,styles:ut};export{wt as diagram};
