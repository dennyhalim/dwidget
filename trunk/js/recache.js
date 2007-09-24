// recache.js v.0.1.b.1 (c) 2007 DennyHalim.com
// automatically redirect visitor coming from slashdot/digg/fark to coral cache
//
// use this script only by pasting this one line into your html:
// <script language="text/javascript" src="http://askdenny.googlepages.com.nyud.net/recache.js"></script>

var ini = top.location.href;
var ref = document.referrer;
var redir = 'http://redirect.nyud.net/?url='+ini
var pass = '7';
var ref_slashdotted = ref.indexOf("slashdot.org");
var ref_dugg = ref.indexOf("digg.com");
var ref_farked = ref.indexOf("fark.com");
var ini_cdn = ini.indexOf("nyud.net");

// remove the comment below for debugging
//document.write(redir);
//if (ref) {
//document.write('<br/><small>coming from ');
//document.write(ref);
//document.write('<br/>script (c) <a href="http://dennyhalim.com">DennyHalim.com</a></small>');
//}

if (ref_slashdotted >= pass || ref_dugg >= pass || ref_farked >= pass || ref == ini){
// document.write('<a href="'+redir+'">redirecting to coral cache</a>');
top.location.href=redir;
}

if (ini_cdn > pass){
document.write('this is <a href="http://www.coralcdn.org/">Coral CDN</a> cached version. script (c) <a href="http://dennyhalim.com">DennyHalim.com</a><br/>');
document.write('<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/80x15.png" /></a><br />');
//document.write('This <span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/Text" rel="dc:type">work</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-Noncommercial-Share Alike 3.0 License</a>.');
}
