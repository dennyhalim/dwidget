// ==UserScript==
// @name           Google - SafeSearch
// @description    Google - SafeSearch: is a greasemonkey script allowing Google to automatically search safe without saving cookies (by default).
// @include        *images.google.*/images?*
// @include        *google.*/microsoft*&q=*
// @include        *google.*/linux*&q=*
// @include        *video.google.*/videosearch?*
// @include        *youtube.*/results?*
// @include        *video.google.*/videosearch?*
// @include        *google.*/microsoft
// @include        *search.yahoo.com/search;*
// @include        *bing.com/search?*
// @include        *bing.com/*/search?*
// @exclude        *google.*/*&safe=on
// @exclude        *youtube.*/*&safe=on
// @exclude        *search.yahoo.com/search;*&vm=r
// @exclude        *bing.com/*&adlt=strict
// @author      ScriptDeveloper | Function: JoeSimmons
// @copyright   ScriptDeveloper
// @version     1.4
// ==/UserScript==

var f, safeon, homeTest;

homeTest = /(^http\:\/\/www\.google\.\w+\.?\w*\/webhp)|(^http\:\/\/www\.google\.\w+\.?\w*\/$)/i;
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
}