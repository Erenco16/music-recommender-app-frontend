(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{4110:(e,t,o)=>{Promise.resolve().then(o.bind(o,9809))},6046:(e,t,o)=>{"use strict";var a=o(6658);o.o(a,"useRouter")&&o.d(t,{useRouter:function(){return a.useRouter}})},9084:()=>{},9809:(e,t,o)=>{"use strict";o.r(t),o.d(t,{default:()=>n});var a=o(5155),r=o(2115),s=o(6046);o(9084);let n=()=>{let e=(0,s.useRouter)(),[t,o]=(0,r.useState)(null),[n,c]=(0,r.useState)(!1);return((0,r.useEffect)(()=>{c(!0);let t=localStorage.getItem("spotify_access_token"),a=localStorage.getItem("spotify_token_expiration");if(t&&a){if(Date.now()<parseInt(a)){console.log("Valid token found. Redirecting to /callback..."),e.replace("/callback");return}localStorage.removeItem("spotify_access_token"),localStorage.removeItem("spotify_token_expiration")}let r="aa2fe3a235db42509cdf54ee1a6838b2",s="https://recommend-music-46f57.web.app/callback/";if(!r||!s){console.log("Missing Spotify environment variables");return}let n=Math.random().toString(36).substring(2,15);o("".concat("https://accounts.spotify.com/authorize","?client_id=").concat(r,"&redirect_uri=").concat(s,"&state=").concat(n,"&response_type=").concat("token","&scope=").concat("user-read-private user-read-email user-top-read user-follow-read"))},[e]),n)?(0,a.jsxs)("div",{className:"main-container",children:[(0,a.jsx)("h1",{children:"Display your artists!"}),(0,a.jsx)("h2",{children:"In order to see your artists, you need to click the button below."}),t&&(0,a.jsx)("a",{href:t,children:(0,a.jsx)("button",{className:"spotify-btn",children:"Log into Spotify"})})]}):null}}},e=>{var t=t=>e(e.s=t);e.O(0,[829,441,587,358],()=>t(4110)),_N_E=e.O()}]);