// ==UserScript==
// @name           SafeSearch
// @description    SafeSearch: is a greasemonkey script allowing Google, Bing and Yahoo! to automatically search safe without saving cookies (by default).
// @include        *images.google.*/images?*
// @include        *google.*/microsoft*&q=*
// @include        *google.*/linux*&q=*
// @include        *video.google.*/videosearch?*
// @include        *youtube.*/results?*
// @include        *video.google.*/videosearch?*
// @include        *google.*/microsoft
// @include        *search.yahoo.com/search;*
// @include        *www.bing.com/search?*
// @include        *www.bing.com/*/search?*
// @exclude        *google.*/*&safe=on
// @exclude        *youtube.*/*&safe=on
// @exclude        *search.yahoo.com/search;*&vm=r
// @exclude        *bing.com/*&adlt=strict
// @exclude        */*&safe=on
// @exclude        */*&vm=r
// @exclude        */*&adlt=strict
// @author      dennyhalim.com
// @copyright   dennyhalim.com
// @version     1.7.2
// ==/UserScript==

var f, safeon, homeTest,bing,yahoo;

homeTest = /(^http\:\/\/www\.google\.\w+\.?\w*\/webhp)|(^http\:\/\/www\.google\.\w+\.?\w*\/$)/i;
bing = /(^http\:\/\/www\.bing\.com)/i;
yahoo = /(^http\:\/\/search\.yahoo\.com)/i; 
google = /(^http\:\/\/*\.google)/i; 
youtube = /(^http\:\/\/*\.youtube)/i; 

if(bing) {location.replace(location.href+'&adlt=strict');}
if(yahoo) {location.replace(location.href+'&vm=r');}
if(google) {location.replace(location.href+'&safe=on');} 
if(youtube) {location.replace(location.href+'&safe=on');} 


/*
if(!homeTest.test(location.href)) {location.replace(location.href+'&safe=on');}
else {
f = document.evaluate("//form[@name='f']",document,null,9,null).singleNodeValue;
safeon = document.createElement('input');
with(safeon) {
type='hidden';
name='safe';
value='on';
}
f.appendChild(safeon);
*/

}