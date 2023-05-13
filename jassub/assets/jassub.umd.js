(function(c,m){typeof exports=="object"&&typeof module<"u"?module.exports=m():typeof define=="function"&&define.amd?define(m):(c=typeof globalThis<"u"?globalThis:c||self,c.JASSUB=m())})(this,function(){"use strict";!("requestVideoFrameCallback"in HTMLVideoElement.prototype)&&"getVideoPlaybackQuality"in HTMLVideoElement.prototype&&(HTMLVideoElement.prototype._rvfcpolyfillmap={},HTMLVideoElement.prototype.requestVideoFrameCallback=function(v){const e=this.getVideoPlaybackQuality(),t=this.mozPresentedFrames||this.mozPaintedFrames||e.totalVideoFrames-e.droppedVideoFrames,s=(n,a)=>{const o=this.getVideoPlaybackQuality(),h=this.mozPresentedFrames||this.mozPaintedFrames||o.totalVideoFrames-o.droppedVideoFrames;if(h>t){const l=this.mozFrameDelay||o.totalFrameDelay-e.totalFrameDelay||0,_=a-n;v(a,{presentationTime:a+l*1e3,expectedDisplayTime:a+_,width:this.videoWidth,height:this.videoHeight,mediaTime:Math.max(0,this.currentTime||0)+_/1e3,presentedFrames:h,processingDuration:l}),delete this._rvfcpolyfillmap[i]}else this._rvfcpolyfillmap[i]=requestAnimationFrame(l=>s(a,l))},i=Date.now(),r=performance.now();return this._rvfcpolyfillmap[i]=requestAnimationFrame(n=>s(r,n)),i},HTMLVideoElement.prototype.cancelVideoFrameCallback=function(v){cancelAnimationFrame(this._rvfcpolyfillmap[v]),delete this._rvfcpolyfillmap[v]});const c={bt709:"BT709",bt470bg:"BT601",smpte170m:"BT601"},m={BT601:{BT709:"1.0863 -0.0723 -0.014 0 0 0.0965 0.8451 0.0584 0 0 -0.0141 -0.0277 1.0418"},BT709:{BT601:"0.9137 0.0784 0.0079 0 0 -0.1049 1.1722 -0.0671 0 0 0.0096 0.0322 0.9582"},FCC:{BT709:"1.0873 -0.0736 -0.0137 0 0 0.0974 0.8494 0.0531 0 0 -0.0127 -0.0251 1.0378",BT601:"1.001 -0.0008 -0.0002 0 0 0.0009 1.005 -0.006 0 0 0.0013 0.0027 0.996"},SMPTE240M:{BT709:"0.9993 0.0006 0.0001 0 0 -0.0004 0.9812 0.0192 0 0 -0.0034 -0.0114 1.0148",BT601:"0.913 0.0774 0.0096 0 0 -0.1051 1.1508 -0.0456 0 0 0.0063 0.0207 0.973"}};class d extends EventTarget{constructor(e={}){super(),globalThis.Worker||this.destroy("Worker not supported"),d._test(),this._onDemandRender="requestVideoFrameCallback"in HTMLVideoElement.prototype&&(e.onDemandRender??!0),this.timeOffset=e.timeOffset||0,this._video=e.video,this._videoHeight=0,this._videoWidth=0,this._videoColorSpace=null,this._canvas=e.canvas,this._video&&!this._canvas?(this._canvasParent=document.createElement("div"),this._canvasParent.className="JASSUB",this._canvasParent.style.position="relative",this._canvas=document.createElement("canvas"),this._canvas.style.display="block",this._canvas.style.position="absolute",this._canvas.style.pointerEvents="none",this._canvasParent.appendChild(this._canvas),this._video.nextSibling?this._video.parentNode.insertBefore(this._canvasParent,this._video.nextSibling):this._video.parentNode.appendChild(this._canvasParent)):this._canvas||this.destroy("Don't know where to render: you should give video or canvas in options."),this._bufferCanvas=document.createElement("canvas"),this._bufferCtx=this._bufferCanvas.getContext("2d"),this._canvasctrl=this._canvas,this._ctx=this._canvasctrl.getContext("2d"),this._lastRenderTime=0,this.debug=!!e.debug,this.prescaleFactor=e.prescaleFactor||1,this.prescaleHeightLimit=e.prescaleHeightLimit||1080,this.maxRenderHeight=e.maxRenderHeight||0,this._worker=new Worker(e.workerUrl||"jassub-worker.js"),this._worker.onmessage=t=>this._onmessage(t),this._worker.onerror=t=>this._error(t),this._loaded=new Promise(t=>{this._init=()=>{this._destroyed||(this._worker.postMessage({target:"init",asyncRender:typeof createImageBitmap<"u"&&(e.asyncRender??!0),onDemandRender:this._onDemandRender,width:this._canvasctrl.width||0,height:this._canvasctrl.height||0,preMain:!0,blendMode:e.blendMode||"js",subUrl:e.subUrl,subContent:e.subContent||null,fonts:e.fonts||[],availableFonts:e.availableFonts||{"liberation sans":"./default.woff2"},fallbackFont:e.fallbackFont||"liberation sans",debug:this.debug,targetFps:e.targetFps||24,dropAllAnimations:e.dropAllAnimations,libassMemoryLimit:e.libassMemoryLimit||0,libassGlyphLimit:e.libassGlyphLimit||0,hasAlphaBug:d._hasAlphaBug,offscreenRender:typeof OffscreenCanvas<"u"&&(e.offscreenRender??!0),useLocalFonts:"queryLocalFonts"in self&&(e.useLocalFonts??!0)}),this._boundResize=this.resize.bind(this),this._boundTimeUpdate=this._timeupdate.bind(this),this._boundSetRate=this.setRate.bind(this),this._boundUpdateColorSpace=this._updateColorSpace.bind(this),this._video&&this.setVideo(e.video),this._onDemandRender&&(this.busy=!1,this._lastDemandTime=null),t())}})}static _supportsWebAssembly=null;static _hasAlphaBug=null;static _test(){if(d._supportsWebAssembly!==null)return null;const e=document.createElement("canvas"),t=e.getContext("2d",{willReadFrequently:!0});if(typeof ImageData.prototype.constructor=="function")try{new ImageData(new Uint8ClampedArray([0,0,0,0]),1,1)}catch{console.log("Detected that ImageData is not constructable despite browser saying so"),self.ImageData=function(o,h,l){const _=t.createImageData(h,l);return o&&_.data.set(o),_}}const s=document.createElement("canvas"),i=s.getContext("2d",{willReadFrequently:!0});e.width=s.width=1,e.height=s.height=1,t.clearRect(0,0,1,1),i.clearRect(0,0,1,1);const r=i.getImageData(0,0,1,1).data;t.putImageData(new ImageData(new Uint8ClampedArray([0,255,0,0]),1,1),0,0),i.drawImage(e,0,0);const n=i.getImageData(0,0,1,1).data;d._hasAlphaBug=r[1]!==n[1],d._hasAlphaBug&&console.log("Detected a browser having issue with transparent pixels, applying workaround"),e.remove(),s.remove()}resize(e=0,t=0,s=0,i=0,r=this._video?.paused){if((!e||!t)&&this._video){const n=this._getVideoPosition();let a=null;if(this._videoWidth){const o=this._video.videoWidth/this._videoWidth,h=this._video.videoHeight/this._videoHeight;a=this._computeCanvasSize((n.width||0)/o,(n.height||0)/h)}else a=this._computeCanvasSize(n.width||0,n.height||0);e=a.width,t=a.height,this._canvasParent&&(s=n.y-(this._canvasParent.getBoundingClientRect().top-this._video.getBoundingClientRect().top),i=n.x),this._canvas.style.width=n.width+"px",this._canvas.style.height=n.height+"px"}this._canvas.style.top=s+"px",this._canvas.style.left=i+"px",this.sendMessage("canvas",{width:e,height:t,force:r&&this.busy===!1})}_getVideoPosition(e=this._video.videoWidth,t=this._video.videoHeight){const s=e/t,{offsetWidth:i,offsetHeight:r}=this._video,n=i/r;e=i,t=r,n>s?e=Math.floor(r*s):t=Math.floor(i/s);const a=(i-e)/2,o=(r-t)/2;return{width:e,height:t,x:a,y:o}}_computeCanvasSize(e=0,t=0){const s=this.prescaleFactor<=0?1:this.prescaleFactor,i=self.devicePixelRatio||1;if(e=e*i,t=t*i,t<=0||e<=0)e=0,t=0;else{const r=s<1?-1:1;let n=t*i;r*n*s<=r*this.prescaleHeightLimit?n*=s:r*n<r*this.prescaleHeightLimit&&(n=this.prescaleHeightLimit),this.maxRenderHeight>0&&n>this.maxRenderHeight&&(n=this.maxRenderHeight),e*=n/t,t=n}return{width:e,height:t}}_timeupdate({type:e}){const s={seeking:!0,waiting:!0,playing:!1}[e];s!=null&&(this._playstate=s),this.setCurrentTime(this._video.paused||this._playstate,this._video.currentTime+this.timeOffset)}_updateColorSpace(){this._video.requestVideoFrameCallback(()=>{try{const e=new VideoFrame(this._video);this._videoColorSpace=c[e.colorSpace.matrix],e.close()}catch(e){console.warn(e)}})}setVideo(e){e instanceof HTMLVideoElement?(this._removeListeners(),this._video=e,this._onDemandRender?this._video.requestVideoFrameCallback(this._handleRVFC.bind(this)):(this._playstate=e.paused,e.addEventListener("timeupdate",this._boundTimeUpdate,!1),e.addEventListener("progress",this._boundTimeUpdate,!1),e.addEventListener("waiting",this._boundTimeUpdate,!1),e.addEventListener("seeking",this._boundTimeUpdate,!1),e.addEventListener("playing",this._boundTimeUpdate,!1),e.addEventListener("ratechange",this._boundSetRate,!1),e.addEventListener("resize",this._boundResize,!1)),"VideoFrame"in window&&(e.addEventListener("loadedmetadata",this._boundUpdateColorSpace,!1),e.readyState>2&&this._updateColorSpace()),e.videoWidth>0&&this.resize(),typeof ResizeObserver<"u"&&(this._ro||(this._ro=new ResizeObserver(()=>this.resize())),this._ro.observe(e))):this._error("Video element invalid!")}runBenchmark(){this.sendMessage("runBenchmark")}setTrackByUrl(e){this.sendMessage("setTrackByUrl",{url:e})}setTrack(e){this.sendMessage("setTrack",{content:e})}freeTrack(){this.sendMessage("freeTrack")}setIsPaused(e){this.sendMessage("video",{isPaused:e})}setRate(e){this.sendMessage("video",{rate:e})}setCurrentTime(e,t,s){this.sendMessage("video",{isPaused:e,currentTime:t,rate:s})}createEvent(e){this.sendMessage("createEvent",{event:e})}setEvent(e,t){this.sendMessage("setEvent",{event:e,index:t})}removeEvent(e){this.sendMessage("removeEvent",{index:e})}getEvents(e){this._fetchFromWorker({target:"getEvents"},(t,{events:s})=>{e(t,s)})}createStyle(e){this.sendMessage("createStyle",{style:e})}setStyle(e,t){this.sendMessage("setStyle",{event:e,index:t})}removeStyle(e){this.sendMessage("removeStyle",{index:e})}getStyles(e){this._fetchFromWorker({target:"getStyles"},(t,{styles:s})=>{e(t,s)})}addFont(e){this.sendMessage("addFont",{font:e})}_sendLocalFont(e){try{queryLocalFonts().then(t=>{const s=t?.find(i=>i.fullName.toLowerCase()===e);s&&s.blob().then(i=>{i.arrayBuffer().then(r=>{this.addFont(new Uint8Array(r))})})})}catch(t){console.warn("Local fonts API:",t)}}_getLocalFont({font:e}){try{navigator?.permissions?.query?navigator.permissions.query({name:"local-fonts"}).then(t=>{t.state==="granted"&&this._sendLocalFont(e)}):this._sendLocalFont(e)}catch(t){console.warn("Local fonts API:",t)}}_unbusy(){this._lastDemandTime?this._demandRender(this._lastDemandTime):this.busy=!1}_handleRVFC(e,{mediaTime:t,width:s,height:i}){if(this._destroyed)return null;this.busy?this._lastDemandTime={mediaTime:t,width:s,height:i}:(this.busy=!0,this._demandRender({mediaTime:t,width:s,height:i})),this._video.requestVideoFrameCallback(this._handleRVFC.bind(this))}_demandRender({mediaTime:e,width:t,height:s}){this._lastDemandTime=null,(t!==this._videoWidth||s!==this._videoHeight)&&(this._videoWidth=t,this._videoHeight=s,this.resize()),this.sendMessage("demand",{time:e+this.timeOffset})}verifyColorSpace(e,t=this._videoColorSpace){!e||!t||e!==t&&(this._ctx.filter=`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='f'><feColorMatrix type='matrix' values='${m[e][t]} 0 0 0 0 0 1 0'/></filter></svg>#f")`)}_render({images:e,asyncRender:t,times:s,width:i,height:r,colorSpace:n}){this._unbusy(),this.debug&&(s.IPCTime=Date.now()-s.JSRenderTime),(this._canvasctrl.width!==i||this._canvasctrl.height!==r)&&(this._canvasctrl.width=i,this._canvasctrl.height=r,this.verifyColorSpace(n)),this._ctx.clearRect(0,0,this._canvasctrl.width,this._canvasctrl.height);for(const a of e)a.image&&(t?(this._ctx.drawImage(a.image,a.x,a.y),a.image.close()):(this._bufferCanvas.width=a.w,this._bufferCanvas.height=a.h,this._bufferCtx.putImageData(new ImageData(this._fixAlpha(new Uint8ClampedArray(a.image)),a.w,a.h),0,0),this._ctx.drawImage(this._bufferCanvas,a.x,a.y)));if(this.debug){s.JSRenderTime=Date.now()-s.JSRenderTime-s.IPCTime;let a=0;const o=s.bitmaps||e.length;delete s.bitmaps;for(const h in s)a+=s[h];console.log("Bitmaps: "+o+" Total: "+(a|0)+"ms",s)}}_fixAlpha(e){if(d._hasAlphaBug)for(let t=3;t<e.length;t+=4)e[t]=e[t]>1?e[t]:1;return e}_ready(){this._init(),this.dispatchEvent(new CustomEvent("ready"))}async sendMessage(e,t={},s){await this._loaded,s?this._worker.postMessage({target:e,transferable:s,...t},[...s]):this._worker.postMessage({target:e,...t})}_fetchFromWorker(e,t){try{const s=e.target,i=setTimeout(()=>{n(new Error("Error: Timeout while try to fetch "+s))},5e3),r=({data:a})=>{a.target===s&&(t(null,a),this._worker.removeEventListener("message",r),this._worker.removeEventListener("error",n),clearTimeout(i))},n=a=>{t(a),this._worker.removeEventListener("message",r),this._worker.removeEventListener("error",n),clearTimeout(i)};this._worker.addEventListener("message",r),this._worker.addEventListener("error",n),this._worker.postMessage(e)}catch(s){this._error(s)}}_console({content:e,command:t}){console[t].apply(console,JSON.parse(e))}_onmessage({data:e}){this["_"+e.target]&&this["_"+e.target](e)}_error(e){const t=e instanceof Error?e:e instanceof ErrorEvent?e.error:new Error(e),s=e instanceof Event?new ErrorEvent(e.type,e):new ErrorEvent("error",{error:t});this.dispatchEvent(s),console.error(t)}_removeListeners(){this._video&&(this._ro&&this._ro.unobserve(this._video),this._ctx.filter="none",this._video.removeEventListener("timeupdate",this._boundTimeUpdate),this._video.removeEventListener("progress",this._boundTimeUpdate),this._video.removeEventListener("waiting",this._boundTimeUpdate),this._video.removeEventListener("seeking",this._boundTimeUpdate),this._video.removeEventListener("playing",this._boundTimeUpdate),this._video.removeEventListener("ratechange",this._boundSetRate),this._video.removeEventListener("resize",this._boundResize),this._video.removeEventListener("loadedmetadata",this._boundUpdateColorSpace))}destroy(e){e&&this._error(e),this._video&&this._canvasParent&&this._video.parentNode.removeChild(this._canvasParent),this._destroyed=!0,this._removeListeners(),this.sendMessage("destroy"),this._worker.terminate()}}return d});
