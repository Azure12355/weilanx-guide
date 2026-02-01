var W=(e,a,p)=>new Promise((l,r)=>{var m=i=>{try{d(p.next(i))}catch(n){r(n)}},h=i=>{try{d(p.throw(i))}catch(n){r(n)}},d=i=>i.done?l(i.value):Promise.resolve(i.value).then(m,h);d((p=p.apply(e,a)).next())});import{c as E}from"./chunk-4KE642ED-k49be82e.js";import{p as Q}from"./treemap-KMMF4GRG-7ORZ52ND-PqQsu5rY.js";import{m as o,$ as X,G as Y,U as q,H as I,e as J,j as K,p as b,a as Z,L as _,aN as ee,aP as te,aQ as M,aR as ae,W as ie,N as le,aS as re,r as se}from"./mermaid.esm.min-C1sZ0LMM.js";import"./chunk-OMTJKCYW-aNhJh7Lu.js";import"./app-CoKNEZDN.js";var oe=se.pie,C={sections:new Map,showData:!1},x=C.sections,k=C.showData,ne=structuredClone(oe),pe=o(()=>structuredClone(ne),"getConfig"),de=o(()=>{x=new Map,k=C.showData,le()},"clear"),ce=o(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);x.has(e)||(x.set(e,a),b.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),ue=o(()=>x,"getSections"),ge=o(e=>{k=e},"setShowData"),me=o(()=>k,"getShowData"),N={getConfig:pe,clear:de,setDiagramTitle:K,getDiagramTitle:J,setAccTitle:I,getAccTitle:q,setAccDescription:Y,getAccDescription:X,addSection:ce,getSections:ue,setShowData:ge,getShowData:me},he=o((e,a)=>{E(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),fe={parse:o(e=>W(null,null,function*(){let a=yield Q("pie",e);b.debug(a),he(a,N)}),"parse")},$e=o(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),xe=$e,Se=o(e=>{let a=[...e.values()].reduce((l,r)=>l+r,0),p=[...e.entries()].map(([l,r])=>({label:l,value:r})).filter(l=>l.value/a*100>=1).sort((l,r)=>r.value-l.value);return re().value(l=>l.value)(p)},"createPieArcs"),we=o((e,a,p,l)=>{b.debug(`rendering pie chart
`+e);let r=l.db,m=Z(),h=_(r.getConfig(),m.pie),d=40,i=18,n=4,g=450,S=g,w=ee(a),c=w.append("g");c.attr("transform","translate("+S/2+","+g/2+")");let{themeVariables:s}=m,[f]=te(s.pieOuterStrokeWidth);f!=null||(f=2);let A=h.textPosition,$=Math.min(S,g)/2-d,P=M().innerRadius(0).outerRadius($),L=M().innerRadius($*A).outerRadius($*A);c.append("circle").attr("cx",0).attr("cy",0).attr("r",$+f/2).attr("class","pieOuterCircle");let v=r.getSections(),G=Se(v),H=[s.pie1,s.pie2,s.pie3,s.pie4,s.pie5,s.pie6,s.pie7,s.pie8,s.pie9,s.pie10,s.pie11,s.pie12],y=0;v.forEach(t=>{y+=t});let O=G.filter(t=>(t.data.value/y*100).toFixed(0)!=="0"),D=ae(H);c.selectAll("mySlices").data(O).enter().append("path").attr("d",P).attr("fill",t=>D(t.data.label)).attr("class","pieCircle"),c.selectAll("mySlices").data(O).enter().append("text").text(t=>(t.data.value/y*100).toFixed(0)+"%").attr("transform",t=>"translate("+L.centroid(t)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(r.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");let R=[...v.entries()].map(([t,u])=>({label:t,value:u})),T=c.selectAll(".legend").data(R).enter().append("g").attr("class","legend").attr("transform",(t,u)=>{let F=i+n,j=F*R.length/2,B=12*i,V=u*F-j;return"translate("+B+","+V+")"});T.append("rect").attr("width",i).attr("height",i).style("fill",t=>D(t.label)).style("stroke",t=>D(t.label)),T.append("text").attr("x",i+n).attr("y",i-n).text(t=>r.getShowData()?`${t.label} [${t.value}]`:t.label);let U=Math.max(...T.selectAll("text").nodes().map(t=>{var u;return(u=t==null?void 0:t.getBoundingClientRect().width)!=null?u:0})),z=S+d+i+n+U;w.attr("viewBox",`0 0 ${z} ${g}`),ie(w,g,z,h.useMaxWidth)},"draw"),ve={draw:we},Ae={parser:fe,db:N,renderer:ve,styles:xe};export{Ae as diagram};
