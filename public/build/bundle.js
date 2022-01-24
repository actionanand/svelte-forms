var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function o(e){e.forEach(t)}function u(e){return"function"==typeof e}function c(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function i(e){return null==e?"":e}function l(e,t){e.appendChild(t)}function a(e,t,n){e.insertBefore(t,n||null)}function r(e){e.parentNode.removeChild(e)}function s(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function d(){return p(" ")}function f(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function h(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function _(e,t,n){const o=new Set;for(let t=0;t<e.length;t+=1)e[t].checked&&o.add(e[t].__value);return n||o.delete(t),Array.from(o)}function $(e){return""===e?null:+e}function v(e,t){e.value=null==t?"":t}function g(e,t){for(let n=0;n<e.options.length;n+=1){const o=e.options[n];if(o.__value===t)return void(o.selected=!0)}e.selectedIndex=-1}let m;function b(e){m=e}function y(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach((e=>e.call(this,t)))}const x=[],k=[],O=[],w=[],C=Promise.resolve();let E=!1;function N(e){O.push(e)}function A(e){w.push(e)}const V=new Set;let I=0;function S(){const e=m;do{for(;I<x.length;){const e=x[I];I++,b(e),M(e.$$)}for(b(null),x.length=0,I=0;k.length;)k.pop()();for(let e=0;e<O.length;e+=1){const t=O[e];V.has(t)||(V.add(t),t())}O.length=0}while(x.length);for(;w.length;)w.pop()();E=!1,V.clear(),b(e)}function M(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(N)}}const L=new Set;function j(e,t){e&&e.i&&(L.delete(e),e.i(t))}function B(e,t,n,o){if(e&&e.o){if(L.has(e))return;L.add(e),undefined.c.push((()=>{L.delete(e),o&&(n&&e.d(1),o())})),e.o(t)}}function F(e,t,n){const o=e.$$.props[t];void 0!==o&&(e.$$.bound[o]=n,n(e.$$.ctx[o]))}function T(e){e&&e.c()}function q(e,n,c,i){const{fragment:l,on_mount:a,on_destroy:r,after_update:s}=e.$$;l&&l.m(n,c),i||N((()=>{const n=a.map(t).filter(u);r?r.push(...n):o(n),e.$$.on_mount=[]})),s.forEach(N)}function G(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function H(e,t){-1===e.$$.dirty[0]&&(x.push(e),E||(E=!0,C.then(S)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function K(t,u,c,i,l,a,s,p=[-1]){const d=m;b(t);const f=t.$$={fragment:null,ctx:null,props:a,update:e,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(u.context||(d?d.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:u.target||d.$$.root};s&&s(f.root);let h=!1;if(f.ctx=c?c(t,u.props||{},((e,n,...o)=>{const u=o.length?o[0]:n;return f.ctx&&l(f.ctx[e],f.ctx[e]=u)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](u),h&&H(t,e)),n})):[],f.update(),h=!0,o(f.before_update),f.fragment=!!i&&i(f.ctx),u.target){if(u.hydrate){const e=function(e){return Array.from(e.childNodes)}(u.target);f.fragment&&f.fragment.l(e),e.forEach(r)}else f.fragment&&f.fragment.c();u.intro&&j(t.$$.fragment),q(t,u.target,u.anchor,u.customElement),S()}b(d)}class P{$destroy(){G(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function W(t){let n,o,u;return{c(){n=s("input"),h(n,"type","text")},m(e,c){a(e,n,c),v(n,t[0]),o||(u=f(n,"input",t[2]),o=!0)},p(e,[t]){1&t&&n.value!==e[0]&&v(n,e[0])},i:e,o:e,d(e){e&&r(n),o=!1,u()}}}function z(e,t,n){let{inputVal:o}=t;return e.$$set=e=>{"inputVal"in e&&n(0,o=e.inputVal)},e.$$.update=()=>{1&e.$$.dirty&&console.log(o)},[o,function(){n(0,o="")},function(){o=this.value,n(0,o)}]}class D extends P{constructor(e){super(),K(this,e,z,W,c,{inputVal:0,emptyMyInput:1})}get emptyMyInput(){return this.$$.ctx[1]}}function R(t){let n,u,c,i,h,_,$,v,g;return{c(){n=s("button"),u=p("option 1"),i=d(),h=s("button"),_=p("option 2"),n.disabled=c=1===t[0],h.disabled=$=2===t[0]},m(e,o){a(e,n,o),l(n,u),a(e,i,o),a(e,h,o),l(h,_),v||(g=[f(n,"click",t[1]),f(h,"click",t[2])],v=!0)},p(e,[t]){1&t&&c!==(c=1===e[0])&&(n.disabled=c),1&t&&$!==($=2===e[0])&&(h.disabled=$)},i:e,o:e,d(e){e&&r(n),e&&r(i),e&&r(h),v=!1,o(g)}}}function U(e,t,n){let{chosenOption:o=1}=t;return e.$$set=e=>{"chosenOption"in e&&n(0,o=e.chosenOption)},[o,()=>n(0,o=1),()=>n(0,o=2)]}class J extends P{constructor(e){super(),K(this,e,U,R,c,{chosenOption:0})}}function Q(e){return e.includes("@")}function X(e){let t,n,u,c,_,m,b,y,x,O,w,C,E,V,I,S,M,L,H,K,P,W,z,R,U,X,Y,Z,ee,te,ne,oe,ue,ce,ie,le,ae,re,se,pe,de,fe,he,_e,$e,ve,ge,me,be,ye,xe,ke,Oe,we,Ce,Ee,Ne,Ae,Ve,Ie,Se,Me,Le,je,Be,Fe,Te,qe,Ge,He;function Ke(t){e[14](t)}let Pe={};function We(t){e[16](t)}void 0!==e[9]&&(Pe.inputVal=e[9]),_=new D({props:Pe}),k.push((()=>F(_,"inputVal",Ke))),e[15](_);let ze={};return void 0!==e[1]&&(ze.chosenOption=e[1]),y=new J({props:ze}),k.push((()=>F(y,"chosenOption",We))),{c(){t=s("h1"),n=p(e[0]),u=p("!"),c=d(),T(_.$$.fragment),b=d(),T(y.$$.fragment),O=d(),w=s("input"),C=d(),E=s("label"),V=s("input"),I=p("\n  Agree to term?"),S=d(),M=s("h2"),M.textContent="Favorite color?",L=d(),H=s("label"),K=s("input"),P=p("\n  Red"),W=d(),z=s("label"),R=s("input"),U=p("\n  Green"),X=d(),Y=s("label"),Z=s("input"),ee=p("\n  White"),te=d(),ne=s("h2"),ne.textContent="Known Languages?",oe=d(),ue=s("label"),ce=s("input"),ie=p("\n  Tamil"),le=d(),ae=s("label"),re=s("input"),se=p("\n  English"),pe=d(),de=s("label"),fe=s("input"),he=p("\n  Urdu"),_e=d(),$e=s("h2"),$e.textContent="How you know about us?",ve=d(),ge=s("select"),me=s("option"),me.textContent="WhatsApp Group",be=s("option"),be.textContent="Newspaper",ye=s("option"),ye.textContent="Some website / Blog",xe=s("option"),xe.textContent="My friend",ke=d(),Oe=s("hr"),we=d(),Ce=s("input"),Ee=d(),Ne=s("button"),Ne.textContent="Save",Ae=d(),Ve=s("h2"),Ve.textContent="Form Validation",Ie=d(),Se=s("form"),Me=s("input"),je=d(),Be=s("button"),Fe=p("Submit"),h(t,"class","capitalize-it svelte-f3bt21"),h(w,"type","number"),h(V,"type","checkbox"),h(K,"type","radio"),h(K,"name","color"),K.__value="red",K.value=K.__value,e[20][1].push(K),h(R,"type","radio"),h(R,"name","color"),R.__value="green",R.value=R.__value,e[20][1].push(R),h(Z,"type","radio"),h(Z,"name","color"),Z.__value="white",Z.value=Z.__value,e[20][1].push(Z),h(ce,"type","checkbox"),h(ce,"name","lang"),ce.__value="tamil",ce.value=ce.__value,e[20][0].push(ce),h(re,"type","checkbox"),h(re,"name","lang"),re.__value="english",re.value=re.__value,e[20][0].push(re),h(fe,"type","checkbox"),h(fe,"name","lang"),fe.__value="urdu",fe.value=fe.__value,e[20][0].push(fe),me.__value="whatsapp",me.value=me.__value,be.__value="newspaper",be.value=be.__value,ye.__value="internet",ye.value=ye.__value,xe.__value="frind",xe.value=xe.__value,void 0===e[6]&&N((()=>e[26].call(ge))),h(Ce,"type","text"),h(Ce,"id","username"),h(Me,"type","email"),h(Me,"class",Le=i(Q(e[8])?"":"invalid")+" svelte-f3bt21"),h(Be,"type","submit"),Be.disabled=Te=!e[11]},m(o,i){var r;a(o,t,i),l(t,n),l(t,u),a(o,c,i),q(_,o,i),a(o,b,i),q(y,o,i),a(o,O,i),a(o,w,i),v(w,e[2]),a(o,C,i),a(o,E,i),l(E,V),V.checked=e[3],l(E,I),a(o,S,i),a(o,M,i),a(o,L,i),a(o,H,i),l(H,K),K.checked=K.__value===e[4],l(H,P),a(o,W,i),a(o,z,i),l(z,R),R.checked=R.__value===e[4],l(z,U),a(o,X,i),a(o,Y,i),l(Y,Z),Z.checked=Z.__value===e[4],l(Y,ee),a(o,te,i),a(o,ne,i),a(o,oe,i),a(o,ue,i),l(ue,ce),ce.checked=~e[5].indexOf(ce.__value),l(ue,ie),a(o,le,i),a(o,ae,i),l(ae,re),re.checked=~e[5].indexOf(re.__value),l(ae,se),a(o,pe,i),a(o,de,i),l(de,fe),fe.checked=~e[5].indexOf(fe.__value),l(de,he),a(o,_e,i),a(o,$e,i),a(o,ve,i),a(o,ge,i),l(ge,me),l(ge,be),l(ge,ye),l(ge,xe),g(ge,e[6]),a(o,ke,i),a(o,Oe,i),a(o,we,i),a(o,Ce,i),e[27](Ce),a(o,Ee,i),a(o,Ne,i),a(o,Ae,i),a(o,Ve,i),a(o,Ie,i),a(o,Se,i),l(Se,Me),v(Me,e[8]),l(Se,je),l(Se,Be),l(Be,Fe),qe=!0,Ge||(He=[f(w,"input",e[17]),f(V,"change",e[18]),f(K,"change",e[19]),f(R,"change",e[21]),f(Z,"change",e[22]),f(ce,"change",e[23]),f(re,"change",e[24]),f(fe,"change",e[25]),f(ge,"change",e[26]),f(Ne,"click",e[12]),f(Me,"input",e[28]),f(Se,"submit",(r=e[13],function(e){return e.preventDefault(),r.call(this,e)}))],Ge=!0)},p(e,[t]){(!qe||1&t)&&function(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}(n,e[0]);const o={};!m&&512&t&&(m=!0,o.inputVal=e[9],A((()=>m=!1))),_.$set(o);const u={};!x&&2&t&&(x=!0,u.chosenOption=e[1],A((()=>x=!1))),y.$set(u),4&t&&$(w.value)!==e[2]&&v(w,e[2]),8&t&&(V.checked=e[3]),16&t&&(K.checked=K.__value===e[4]),16&t&&(R.checked=R.__value===e[4]),16&t&&(Z.checked=Z.__value===e[4]),32&t&&(ce.checked=~e[5].indexOf(ce.__value)),32&t&&(re.checked=~e[5].indexOf(re.__value)),32&t&&(fe.checked=~e[5].indexOf(fe.__value)),64&t&&g(ge,e[6]),(!qe||256&t&&Le!==(Le=i(Q(e[8])?"":"invalid")+" svelte-f3bt21"))&&h(Me,"class",Le),256&t&&Me.value!==e[8]&&v(Me,e[8]),(!qe||2048&t&&Te!==(Te=!e[11]))&&(Be.disabled=Te)},i(e){qe||(j(_.$$.fragment,e),j(y.$$.fragment,e),qe=!0)},o(e){B(_.$$.fragment,e),B(y.$$.fragment,e),qe=!1},d(n){n&&r(t),n&&r(c),e[15](null),G(_,n),n&&r(b),G(y,n),n&&r(O),n&&r(w),n&&r(C),n&&r(E),n&&r(S),n&&r(M),n&&r(L),n&&r(H),e[20][1].splice(e[20][1].indexOf(K),1),n&&r(W),n&&r(z),e[20][1].splice(e[20][1].indexOf(R),1),n&&r(X),n&&r(Y),e[20][1].splice(e[20][1].indexOf(Z),1),n&&r(te),n&&r(ne),n&&r(oe),n&&r(ue),e[20][0].splice(e[20][0].indexOf(ce),1),n&&r(le),n&&r(ae),e[20][0].splice(e[20][0].indexOf(re),1),n&&r(pe),n&&r(de),e[20][0].splice(e[20][0].indexOf(fe),1),n&&r(_e),n&&r($e),n&&r(ve),n&&r(ge),n&&r(ke),n&&r(Oe),n&&r(we),n&&r(Ce),e[27](null),n&&r(Ee),n&&r(Ne),n&&r(Ae),n&&r(Ve),n&&r(Ie),n&&r(Se),Ge=!1,o(He)}}}function Y(e,t,n){let o,u,c,{appName:i}=t,l='If u click "save", input will be cleared!',a=2,r=0,s="green",p=["tamil"],d="internet",f="",h=!1;const v=[[],[]];return e.$$set=e=>{"appName"in e&&n(0,i=e.appName)},e.$$.update=()=>{2&e.$$.dirty&&console.log(a),4&e.$$.dirty&&console.log("Price :",r),8&e.$$.dirty&&console.log("Agree? ",o),16&e.$$.dirty&&console.log("Fav. color :",s),32&e.$$.dirty&&console.log("Known Languages :",p),64&e.$$.dirty&&console.log("How I know you? ",d),128&e.$$.dirty&&console.log(c),256&e.$$.dirty&&(Q(f)?n(11,h=!0):n(11,h=!1))},[i,a,r,o,s,p,d,c,f,l,u,h,function(){console.log(u.value),c.emptyMyInput()},function(t){y.call(this,e,t)},function(e){l=e,n(9,l)},function(e){k[e?"unshift":"push"]((()=>{c=e,n(7,c)}))},function(e){a=e,n(1,a)},function(){r=$(this.value),n(2,r)},function(){o=this.checked,n(3,o)},function(){s=this.__value,n(4,s)},v,function(){s=this.__value,n(4,s)},function(){s=this.__value,n(4,s)},function(){p=_(v[0],this.__value,this.checked),n(5,p)},function(){p=_(v[0],this.__value,this.checked),n(5,p)},function(){p=_(v[0],this.__value,this.checked),n(5,p)},function(){d=function(e){const t=e.querySelector(":checked")||e.options[0];return t&&t.__value}(this),n(6,d)},function(e){k[e?"unshift":"push"]((()=>{u=e,n(10,u)}))},function(){f=this.value,n(8,f)}]}return new class extends P{constructor(e){super(),K(this,e,Y,X,c,{appName:0})}}({target:document.getElementById("app"),props:{appName:"svelte form"}})}();
//# sourceMappingURL=bundle.js.map