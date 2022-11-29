(function(h,n){typeof exports=="object"&&typeof module!="undefined"?module.exports=n():typeof define=="function"&&define.amd?define(n):(h=typeof globalThis!="undefined"?globalThis:h||self,h.JASSUB=n())})(this,function(){"use strict";var p=Object.defineProperty;var g=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var u=(h,n,l)=>n in h?p(h,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):h[n]=l,v=(h,n)=>{for(var l in n||(n={}))y.call(n,l)&&u(h,l,n[l]);if(g)for(var l of g(n))b.call(n,l)&&u(h,l,n[l]);return h};var _=(h,n,l)=>(u(h,typeof n!="symbol"?n+"":n,l),l);!("requestVideoFrameCallback"in HTMLVideoElement.prototype)&&"getVideoPlaybackQuality"in HTMLVideoElement.prototype&&(HTMLVideoElement.prototype._rvfcpolyfillmap={},HTMLVideoElement.prototype.requestVideoFrameCallback=function(l){const e=this.getVideoPlaybackQuality(),t=this.mozPresentedFrames||e.totalVideoFrames-e.droppedVideoFrames,i=(r,o)=>{const d=this.getVideoPlaybackQuality(),f=this.mozPresentedFrames||d.totalVideoFrames-d.droppedVideoFrames;if(f>t){const c=this.mozFrameDelay||d.totalFrameDelay-e.totalFrameDelay||0,m=o-r;l(o,{presentationTime:o+c*1e3,expectedDisplayTime:o+m,width:this.videoWidth,height:this.videoHeight,mediaTime:Math.max(0,this.currentTime||0)+m/1e3,presentedFrames:f,processingDuration:c}),delete this._rvfcpolyfillmap[a]}else this._rvfcpolyfillmap[a]=requestAnimationFrame(c=>i(o,c))},a=Date.now(),s=performance.now();return this._rvfcpolyfillmap[a]=requestAnimationFrame(r=>i(s,r)),a},HTMLVideoElement.prototype.cancelVideoFrameCallback=function(l){cancelAnimationFrame(this._rvfcpolyfillmap[l]),delete this._rvfcpolyfillmap[l]});const n=class extends EventTarget{constructor(e={}){var s,r,o;super(),globalThis.Worker||this.destroy("Worker not supported"),n._test();const t=e.blendMode||"js",i=typeof createImageBitmap!="undefined"&&((s=e.asyncRender)!=null?s:!0),a=typeof OffscreenCanvas!="undefined"&&((r=e.offscreenRender)!=null?r:!0);this._onDemandRender="requestVideoFrameCallback"in HTMLVideoElement.prototype&&((o=e.onDemandRender)!=null?o:!0),this.timeOffset=e.timeOffset||0,this._video=e.video,this._canvasParent=null,this._video?(this._canvasParent=document.createElement("div"),this._canvasParent.className="JASSUB",this._canvasParent.style.position="relative",this._video.nextSibling?this._video.parentNode.insertBefore(this._canvasParent,this._video.nextSibling):this._video.parentNode.appendChild(this._canvasParent)):this._canvas||this.destroy("Don't know where to render: you should give video or canvas in options."),this._canvas=e.canvas||document.createElement("canvas"),this._canvas.style.display="block",this._canvas.style.position="absolute",this._canvas.style.pointerEvents="none",this._canvasParent.appendChild(this._canvas),this._bufferCanvas=document.createElement("canvas"),this._bufferCtx=this._bufferCanvas.getContext("2d"),this._canvasctrl=a?this._canvas.transferControlToOffscreen():this._canvas,this._ctx=!a&&this._canvasctrl.getContext("2d"),this._lastRenderTime=0,this.debug=!!e.debug,this.prescaleFactor=e.prescaleFactor||1,this.prescaleHeightLimit=e.prescaleHeightLimit||1080,this.maxRenderHeight=e.maxRenderHeight||0,this._worker=new Worker(n._supportsWebAssembly?e.workerUrl||"jassub-worker.js":e.legacyWorkerUrl||"jassub-worker-legacy.js"),this._worker.onmessage=d=>this._onmessage(d),this._worker.onerror=d=>this._error(d),this._worker.postMessage({target:"init",asyncRender:i,width:this._canvas.width,height:this._canvas.height,preMain:!0,blendMode:t,subUrl:e.subUrl,subContent:e.subContent||null,fonts:e.fonts||[],availableFonts:e.availableFonts||{"liberation sans":"./default.woff2"},fallbackFont:e.fallbackFont||"liberation sans",debug:this.debug,targetFps:e.targetFps||24,dropAllAnimations:e.dropAllAnimations,libassMemoryLimit:e.libassMemoryLimit||0,libassGlyphLimit:e.libassGlyphLimit||0,hasAlphaBug:n._hasAlphaBug,useLocalFonts:"queryLocalFonts"in self&&!!e.useLocalFonts}),a===!0&&this.sendMessage("offscreenCanvas",null,[this._canvasctrl]),this.setVideo(e.video),this._onDemandRender&&(this.busy=!1,this._video.requestVideoFrameCallback(this._demandRender.bind(this)))}static _test(){if(n._supportsWebAssembly!==null)return null;const e=document.createElement("canvas"),t=e.getContext("2d");if(typeof ImageData.prototype.constructor=="function")try{new ImageData(new Uint8ClampedArray([0,0,0,0]),1,1)}catch{console.log("detected that ImageData is not constructable despite browser saying so"),window.ImageData=function(d,f,c){const m=t.createImageData(f,c);return d&&m.data.set(d),m}}try{if(typeof WebAssembly=="object"&&typeof WebAssembly.instantiate=="function"){const o=new WebAssembly.Module(Uint8Array.of(0,97,115,109,1,0,0,0));o instanceof WebAssembly.Module&&(n._supportsWebAssembly=new WebAssembly.Instance(o)instanceof WebAssembly.Instance)}}catch{n._supportsWebAssembly=!1}const i=document.createElement("canvas"),a=i.getContext("2d");e.width=i.width=1,e.height=i.height=1,t.clearRect(0,0,1,1),a.clearRect(0,0,1,1);const s=a.getImageData(0,0,1,1).data;t.putImageData(new ImageData(new Uint8ClampedArray([0,255,0,0]),1,1),0,0),a.drawImage(e,0,0);const r=a.getImageData(0,0,1,1).data;n._hasAlphaBug=s[1]!==r[1],n._hasAlphaBug&&console.log("Detected a browser having issue with transparent pixels, applying workaround"),i.remove()}resize(e=0,t=0,i=0,a=0){let s=null;if((!e||!t)&&this._video){s=this._getVideoPosition();const r=this._computeCanvasSize((s.width||0)*(window.devicePixelRatio||1),(s.height||0)*(window.devicePixelRatio||1));e=r.width,t=r.height,i=s.y-(this._canvasParent.getBoundingClientRect().top-this._video.getBoundingClientRect().top),a=s.x}s!=null&&(this._canvas.style.top=i+"px",this._canvas.style.left=a+"px",this._canvas.style.width=s.width+"px",this._canvas.style.height=s.height+"px"),this._canvasctrl.width===e&&this._canvasctrl.height===t||(this._resizeTimeoutBuffer?(clearTimeout(this._resizeTimeoutBuffer),this._resizeTimeoutBuffer=setTimeout(()=>{this._resizeTimeoutBuffer=void 0,this._canvasctrl.width=e,this._canvasctrl.height=t,this.sendMessage("canvas",{width:e,height:t})},100)):(this._canvasctrl.width=e,this._canvasctrl.height=t,this.sendMessage("canvas",{width:e,height:t}),this._resizeTimeoutBuffer=setTimeout(()=>{this._resizeTimeoutBuffer=void 0},100)))}_getVideoPosition(){const e=this._video.videoWidth/this._video.videoHeight,{offsetWidth:t,offsetHeight:i}=this._video,a=t/i;let s=t,r=i;a>e?s=Math.floor(i*e):r=Math.floor(t/e);const o=(t-s)/2,d=(i-r)/2;return{width:s,height:r,x:o,y:d}}_computeCanvasSize(e=0,t=0){const i=this.prescaleFactor<=0?1:this.prescaleFactor;if(t<=0||e<=0)e=0,t=0;else{const a=i<1?-1:1;let s=t;a*s*i<=a*this.prescaleHeightLimit?s*=i:a*s<a*this.prescaleHeightLimit&&(s=this.prescaleHeightLimit),this.maxRenderHeight>0&&s>this.maxRenderHeight&&(s=this.maxRenderHeight),e*=s/t,t=s}return{width:e,height:t}}_timeupdate({type:e}){const i={seeking:!0,waiting:!0,playing:!1}[e];i!=null&&(this._playstate=i),this.setCurrentTime(this._video.paused||this._playstate,this._video.currentTime+this.timeOffset)}setVideo(e){e instanceof HTMLVideoElement?(this._removeListeners(),this._video=e,this._onDemandRender!==!0&&(this._playstate=e.paused,e.addEventListener("timeupdate",this._timeupdate.bind(this),!1),e.addEventListener("progress",this._timeupdate.bind(this),!1),e.addEventListener("waiting",this._timeupdate.bind(this),!1),e.addEventListener("seeking",this._timeupdate.bind(this),!1),e.addEventListener("playing",this._timeupdate.bind(this),!1),e.addEventListener("ratechange",this.setRate.bind(this),!1)),e.videoWidth>0&&this.resize(),e.addEventListener("resize",this.resize.bind(this)),typeof ResizeObserver!="undefined"&&(this._ro||(this._ro=new ResizeObserver(()=>this.resize())),this._ro.observe(e))):this._error("Video element invalid!")}runBenchmark(){this.sendMessage("runBenchmark")}setTrackByUrl(e){this.sendMessage("setTrackByUrl",{url:e})}setTrack(e){this.sendMessage("setTrack",{content:e})}freeTrack(){this.sendMessage("freeTrack")}setIsPaused(e){this.sendMessage("video",{isPaused:e})}setRate(e){this.sendMessage("video",{rate:e})}setCurrentTime(e,t,i){this.sendMessage("video",{isPaused:e,currentTime:t,rate:i})}createEvent(e){this.sendMessage("createEvent",{event:e})}setEvent(e,t){this.sendMessage("setEvent",{event:e,index:t})}removeEvent(e){this.sendMessage("removeEvent",{index:e})}getEvents(e){this._fetchFromWorker({target:"getEvents"},(t,{events:i})=>{e(t,i)})}createStyle(e){this.sendMessage("createStyle",{style:e})}setStyle(e,t){this.sendMessage("setStyle",{event:e,index:t})}removeStyle(e){this.sendMessage("removeStyle",{index:e})}getStyles(e){this._fetchFromWorker({target:"getStyles"},(t,{styles:i})=>{e(t,i)})}addFont(e){this.sendMessage("addFont",{font:e})}_sendLocalFont(e){try{queryLocalFonts().then(t=>{const i=t&&t.filter(a=>a.fullName.toLowerCase()===e);i&&i.length&&i[0].blob().then(a=>{a.arrayBuffer().then(s=>{this.addFont(new Uint8Array(s))})})})}catch(t){console.warn("Local fonts API:",t)}}_getLocalFont({font:e}){var t,i;try{const a=((t=navigator==null?void 0:navigator.permissions)==null?void 0:t.request)||((i=navigator==null?void 0:navigator.permissions)==null?void 0:i.query);a?a({name:"local-fonts"}).then(s=>{s.state==="granted"&&this._sendLocalFont(e)}):"queryLocalFonts"in self&&this._sendLocalFont(e)}catch(a){console.warn("Local fonts API:",a)}}_unbusy(){this.busy=!1}_demandRender(e,t){if(this._destroyed)return null;this.busy||(this.busy=!0,this.sendMessage("demand",{time:t.mediaTime+this.timeOffset})),this._video.requestVideoFrameCallback(this._demandRender.bind(this))}_render({images:e,async:t,times:i}){const a=Date.now();this._ctx.clearRect(0,0,this._canvasctrl.width,this._canvasctrl.height);for(const s of e)s.image&&(t?(this._ctx.drawImage(s.image,s.x,s.y),s.image.close()):(this._bufferCanvas.width=s.w,this._bufferCanvas.height=s.h,this._bufferCtx.putImageData(new ImageData(this._fixAlpha(new Uint8ClampedArray(s.image)),s.w,s.h),0,0),this._ctx.drawImage(this._bufferCanvas,s.x,s.y)));if(this.debug){i.drawTime=Date.now()-a;let s=0;for(const r in i)s+=i[r];console.log("Bitmaps: "+e.length+" Total: "+Math.round(s)+"ms",i)}}_fixAlpha(e){if(n._hasAlphaBug)for(let t=3;t<e.length;t+=4)e[t]=e[t]>1?e[t]:1;return e}_ready(){this.dispatchEvent(new CustomEvent("ready"))}sendMessage(e,t={},i){i?this._worker.postMessage(v({target:e,transferable:i},t),[...i]):this._worker.postMessage(v({target:e},t))}_fetchFromWorker(e,t){try{const i=e.target,a=setTimeout(()=>{r(new Error("Error: Timeout while try to fetch "+i))},5e3),s=({data:o})=>{o.target===i&&(t(null,o),this._worker.removeEventListener("message",s),this._worker.removeEventListener("error",r),clearTimeout(a))},r=o=>{t(o),this._worker.removeEventListener("message",s),this._worker.removeEventListener("error",r),clearTimeout(a)};this._worker.addEventListener("message",s),this._worker.addEventListener("error",r),this._worker.postMessage(e)}catch(i){this._error(i)}}_console({content:e,command:t}){console[t].apply(console,JSON.parse(e))}_onmessage({data:e}){this["_"+e.target]&&this["_"+e.target](e)}_error(e){throw e instanceof ErrorEvent||this.dispatchEvent(new ErrorEvent("error",{message:e instanceof Error?e.cause:e})),e instanceof Error?e:new Error(e instanceof ErrorEvent?e.message:"error",{cause:e})}_removeListeners(){this._video&&(this._ro&&this._ro.unobserve(this._video),this._video.removeEventListener("timeupdate",this._timeupdate),this._video.removeEventListener("progress",this._timeupdate),this._video.removeEventListener("waiting",this._timeupdate),this._video.removeEventListener("seeking",this._timeupdate),this._video.removeEventListener("playing",this._timeupdate),this._video.removeEventListener("ratechange",this.setRate),this._video.removeEventListener("resize",this.resize))}destroy(e){e&&this._error(e),this._video&&this._video.parentNode.removeChild(this._canvasParent),this._destroyed=!0,this._removeListeners(),this.sendMessage("destroy"),this._worker.terminate()}};let h=n;return _(h,"_supportsWebAssembly",null),_(h,"_hasAlphaBug",null),h});