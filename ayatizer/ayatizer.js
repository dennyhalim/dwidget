/*
 * Version: 1.0
 * Function: Ayatizer will make a link for verse pattern that this XP found. When you hover on this link, popup with Bible texts included will show.
 * 
 * Developer: SABDA
 * Copyright (C) 2011 by YLSA
 * www.sabda.org
 *
 * The verse texts data get from http://alkitab.sabda.org/
 * The Initial Developer. All Rights Reserved.
 * 
 */
 
var _sal = new sabdaAlkitabLinker();

function escapeHTML(str) {
	return str.replace(/[&"<>]/g, function (m) "&" + ({ "&": "amp", '"': "quot", "<": "lt", ">": "gt" })[m] + ";");
}

function sabdaAlkitabLinker() {
  var createSearchingSpan = function () { //searching span, display when the data is loading
    var searchingSpan = '<span class="searching" >' + document.getElementById("ayatizer_stringbundle").getString("popup.searching") + "</span>"; //hanya span dalamnya ada text searching
    return (createSearchingSpan = function () {
      return searchingSpan
    })()
  },
  timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer),
  nativeJSON = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON),
  xhtml = [null, null, 0, null, null, 0, 0, null, 0, null, null],
  global_regex = [/[\w\'\-]/, /\s/, /[^\w\s\'\-]/g, /[^\w\'\-]/],
  b = [[0, 0, ""], [0, 0, ""], [0, 0, ""]],
  parameter = [""],
  attr = ["ayatizer-css", "ayatizer-window", "visibility:hidden;top:0px;left:0px;", "width:400px;height:140px;visibility:visible;top:", "px;left:", "px;", "alkitab-sabda"],
  popupContent = [null, null, "", "", null],
  mousePointer = [0, 0],
  links = ["http://alkitab.sabda.org/", "", "http://alkitab.sabda.org/json/ayatizer.php?passage="], 
  A, dragObj = new Object(),
  w = function () {
    var B = b[0][2];
    var C = B;
    var D;
    var E;
    var F = parameter[0];
    return F;
  };
  
  dragObj.zIndex = 0;

  function addEvent() {
    xhtml[0] = new XMLHttpRequest();
    gBrowser.addEventListener("mouseover", getMouseOver, false);
    gBrowser.addEventListener("keydown", getKeyCode, false);
    createXHTML("", 0, 0);
    hidePopup();
    document.getElementById("ayatizer_togglePopup").setAttribute("checked", "true");
  }

  function removeEvent() {
    var thisBrowser, xHtmlElement, xHtmlAttr;
    hidePopup();
    xhtml[0] = null;
    if ((xHtmlElement = (thisBrowser = gBrowser).contentDocument.getElementById((xHtmlAttr = attr)[0]))) { //ayatizer-css
      xHtmlElement.parentNode.removeChild(xHtmlElement)
    }
    if ((xHtmlElement = thisBrowser.contentDocument.getElementById(xHtmlAttr[1]))) { //ayatizer-window
      xHtmlElement.parentNode.removeChild(xHtmlElement)
    }
    thisBrowser.removeEventListener("mouseover", getMouseOver, false);
    thisBrowser.removeEventListener("keydown", getKeyCode, false);
    document.getElementById("ayatizer_togglePopup").setAttribute("checked", "");
  }

  function changeClass(input) {
    var statusBarTooltip, statusBarClass, toolBar;
    if (input) {
      statusBarTooltip = document.getElementById("ayatizer_stringbundle").getString("tooltip.disabled");
      statusBarClass = "ayatizer_off"
      toogleLinkChecked = ""
    } else {
      statusBarTooltip = document.getElementById("ayatizer_stringbundle").getString("tooltip.enabled");
      statusBarClass = "ayatizer_on"
      toogleLinkChecked = "true"
    }
    if ((toolBar = document.getElementById("aytizer_tbb"))) {
      toolBar.setAttribute("class", statusBarClass);
      toolBar.setAttribute("tooltiptext", statusBarTooltip)
    }
    document.getElementById("ayatizer_cm").setAttribute("class", "menuitem-iconic " + statusBarClass);
    document.getElementById("ayatizer_tm").setAttribute("class", "menuitem-iconic " + statusBarClass);
    document.getElementById("ayatizer_sbp").setAttribute("class", "statusbarpanel-iconic " + statusBarClass);
    document.getElementById("ayatizer_sbp").setAttribute("tooltiptext", statusBarTooltip);
    document.getElementById("ayatizer_toggleLink").setAttribute("checked", toogleLinkChecked);
  }
  
  function getPrefsBranch() {
	return Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.config.");
  }
  
  function pageProcess(doc) {
    var prefs = getPrefsBranch();
	// Get all text nodes in document
	(function () {
		var cand;
		var indexL = 0;
		reg = new RegExp();		
		function patternParse(input) {
			//this array contains books that start with number, ex: 1 Kor
			nofollow = "ch|chr|chron|chronicles|co|cor|corinthians|jhn|jn|jo|joh|john|kgs|ki|kin|kings|kor|korintus|pe|pet|peter|petrus|ptr|raj|raja|raja-raja|sa|sam|samuel|taw|tawarikh|tes|tesalonika|th|the|thes|thess|thessalonians|ti|tim|timothy|timotius|yoh|yohanes";
			//this array contains all of book names, english and indonesian
			EnBookNames = "genesis|gen|ge|exodus|exod|exo|ex|leviticus|lev|lv|le|numbers|num|nmb|nu|deuteronomy|deut|deu|dt|de|joshua|josh|jos|judges|judg|jdg|ruth|rut|rth|ru|1 samuel|1samuel|1 sam|1sam|1 sa|1sa|i samuel|i sam|i sa|2 samuel|2samuel|2 sam|2sam|2 sa|2sa|ii samuel|ii sam|ii sa|1 kings|1kings|1 kin|1kin|1 kgs|1kgs|1 ki|1ki|i kings|i kin|i kgs|i ki|2 kings|2kings|2 kin|2kin|2 kgs|2kgs|2 ki|2ki|ii kings|ii kin|ii kgs|ii ki|1 chronicles|1chronicles|1 chron|1chron|1 chr|1chr|1 ch|1ch|i chronicles|i chron|i chr|i ch|2 chronicles|2chronicles|2 chron|2chron|2 chr|2chr|2 ch|2ch|ii chronicles|ii chron|ii chr|ii ch|ezra|ezr|nehemiah|neh|nh|ne|nehemia|esther|esth|est|es|ester|job|jb|psalms|psalm|psa|pss|ps|proverbs|proverb|prov|pro|pr|ecclesiastes|eccl|ecc|ec|songs of solomon|songsofsolomon|song of solomon|songofsolomon|song of songs|songofsongs|songs|song|son|sos|so|isaiah|isa|is|jeremiah|jer|je|lamentations|lam|la|ezekiel|ezek|eze|daniel|dan|dn|da|hosea|hos|ho|joel|joe|yl|amos|amo|am|obadiah|oba|ob|jonah|jon|micah|mikha|mic|mi|nahum|nah|na|habakkuk|habakuk|hab|zephaniah|zeph|zep|haggai|hagai|hag|zechariah|zech|zec|za|malachi|mal|matthew|mathew|matt|mat|mt|markus|mark|mar|mrk|mr|mk|luke|luk|lu|lk|john|joh|jhn|jn|acts of the apostles|actsoftheapostles|acts|act|ac|romans|rom|rm|ro|1 corinthians|1corinthians|1 cor|1cor|1 co|1co|i corinthians|i cor|i co|2 corinthians|2corinthians|2 cor|2cor|2 co|2co|ii corinthians|ii cor|ii co|galatians|galatia|gal|ga|ephesians|eph|ep|phillippians|philippians|phill|phil|phi|php|ph|colossians|col|co|1 thessalonians|1thessalonians|1 thess|1thess|1 thes|1thes|1 the|1the|1 th|1th|i thessalonians|i thess|i thes|i the|i th|2 thessalonians|2thessalonians|2 thess|2thess|2 thes|2thes|2 the|2the|2 th|2th|ii thessalonians|ii thess|ii thes|ii the|ii th|1 timothy|1timothy|1 tim|1tim|1 ti|1ti|i timothy|i tim|i ti|2 timothy|2timothy|2 tim|2tim|2 ti|2ti|ii timothy|ii tim|ii ti|titus|tit|philemon|phile|phm|hebrews|heb|he|james|jam|jas|jms|ja|jm|1 peter|1peter|1 pet|1pet|1 pe|1pe|i peter|i pet|i pe|1 ptr|1ptr|2 peter|2peter|2 pet|2pet|2 pe|2pe|ii peter|ii pet|ii pe|2 ptr|2ptr|1 john|1john|1 joh|1joh|1 jhn|1jhn|1 jo|1jo|1 jn|1jn|i john|i joh|i jhn|i jo|i jn|2 john|2john|2 joh|2joh|2 jhn|2jhn|2 jo|2jo|2 jn|2jn|ii john|ii joh|ii jhn|ii jo|ii jn|3 john|3john|3 joh|3joh|3 jhn|3jhn|3 jo|3jo|3 jn|3jn|iii john|iii joh|iii jhn|iii jo|iii jn|jude|jud|ju|revelations|revelation|rev|re|rv";
			IdBookNames = "kejadian|kej|kel|keluaran|im|imamat|bil|bilangan|ul|ulangan|yos|yosua|hak|hakim-hakim|rut|ru|1 samuel|1samuel|1 sam|1sam|1 sa|1sa|i samuel|i sam|i sa|2 samuel|2samuel|2 sam|2sam|2 sa|2sa|ii samuel|ii sam|ii sa|1 raj|1 raja|1raj|1raja|1 raja-raja|1raja-raja|2 raj|2 raja|2raj|2raja|2 raja-raja|2raja-raja|i raj|i raja|iraj|iraja|i raja-raja|iraja-raja|ii raj|ii raja|iiraj|iiraja|ii raja-raja|iiraja-raja|1 tawarikh|1tawarikh|1 taw|1taw|i tawarikh|i taw|2 tawarikh|2tawarikh|2 taw|2taw|ii tawarikh|ii taw|ezra|ezr|neh|nh|ne|nehemia|est|es|ester|ayub|ayb|ay|mazmur|maz|mzm|amsal|ams|pengkhotbah|pkh|kidung agung|kidungagung|kid|yesaya|yes|yeremia|yer|ratapan|rat|yehezkiel|yeh|hosea|hos|ho|yoel|yl|amos|amo|am|obaja|oba|ob|yunus|yun|mikha|mik|mi|nahum|nah|na|habakkuk|habakuk|hab|zefanya|zef|haggai|hagai|hag|zakharia|za|maleakhi|mal|matius|mat|mt|markus|mark|mar|mrk|mr|mk|lukas|luk|lu|lk|yohanes|yoh|kisah para rasul|kisah rasul|kis|roma|rom|rm|ro|1 korintus|1korintus|1 kor|1kor|2 korintus|2korintus|2 kor|2kor|i korintus|ikorintus|i kor|ikor|ii korintus|iikorintus|ii kor|iikor|galatia|gal|ga|efesus|ef|filipi|flp|fil|kolose|kol|1 tesalonika|1tesalonika|1 tes|1tes|i tesalonika|i tes|2 tesalonika|2tesalonika|2 tes|2tes|ii tesalonika|ii tes|1timotius|1 timotius|1 tim|1tim|1 ti|1ti|i tim|i ti	|i timotius|i tim|i ti|2timotius|2 timotius|2 tim|2tim|2 ti|2ti|ii timotius|ii tim|ii ti|titus|tit|filemon|flm|ibrani|ibr|yakobus|yak|1 pet|1pet|1 pe|1pe|1 petrus|1petrus|1 ptr|1ptr|2 pet|2pet|2 pe|2pe|ii peter|ii pet|ii pe|2 petrus|2petrus|2 ptr|2ptr|1 yohanes|1yohanes|1yoh|1 yoh|i yohanes|i yoh|2 yohanes|2yohanes|ii yohanes|ii yoh|2yoh|2 yoh|3 yohanes|3yohanes|3yoh|3 yoh|iii yohanes|iii yoh|yudas|yud|wahyu|why";
			EnBookNames = EnBookNames.replace(/ /g, "\\s+");
			IdBookNames = IdBookNames.replace(/ /g, "\\s+");
			bookNames = EnBookNames + "|" + IdBookNames;
			found = false;
			match_1 = new Array();
			node3 = cand;
			//this regex to find verse pattern
			reg.compile(('^([\\w\\W\\s]*?\\b)??(((' + bookNames + ')\\.?\\s+)(\\d+(?:(?:-|:|(?:;\\s*\\d+:\\s*)|,|\\.|\\d|dan|\\s)+\\d+)?)(?!\\s*(?:' + nofollow + ')\\.?\\s))((?:.*\\s*)*)'),"im");
			if (match_1 = reg.exec(input)) {
			    found = true;
			}
			while (found == true) {
				//to solve the problem of "Dan" book
				var firstLetter = String(match_1[3]).substring(0,1);
				if((firstLetter == "d") && (/d/.test(firstLetter))){
					input = match_1[6];
				} else{
					//pola yang tertangkap akan di split nodenya untuk disisip tag "a"
					node2 = node3.splitText(node3.length - (match_1[6].length + match_1[2].length));
					node3 = node2.splitText(match_1[2].length);
					//newPattern to replace Kej.5:4 pattern become Kej 5:4
					var newPattern = match_1[2].replace(/\./, " ");
					//if there is word "dan" in pattern, "dan" will remove
					if (/dan/.test(newPattern))
						if(/dan\s*\d*:.*/.test(newPattern))
						    newPattern = newPattern.replace(/dan/, ";");
						else
						    newPattern = newPattern.replace(/dan/, ",");
					//to repair false pattern
					newPattern = newPattern.replace(/,\s*;/g, ";");
					newPattern = newPattern.replace(/\s+/g, " ");
					newPattern = newPattern.replace(/\n+/g, " ");
					
					a = doc.createElement("a");
					a.setAttribute("href", prefs.getCharPref("alkitabSabdaUrl") + newPattern  + "&dari_url=" + doc.location.href);
					a.setAttribute("class", attr[6]);
					a.appendChild(doc.createTextNode(match_1[2]));
					cand.parentNode.replaceChild(a, node2);
					a.target = "_blank";
					a.normalize();	indexL++;
					input = node3.nodeValue;
				}
				found = false;
				//to catch next pattern
				if(match_1 = reg.exec(input))
				    found = true;
			}
		}
		
		function simpleMatch() { //to catch each element in the document, per tag
			//Ayatizer exception for 3 sites: http://alkitab.sabda.org, http://net.bible.org, http://dev.bible.org
			if(String(doc.location.href).substring(0,24) != "http://alkitab.sabda.org" && String(doc.location.href).substring(0,20) != "http://net.bible.org" && String(doc.location.href).substring(0,20) != "http://dev.bible.org"){
			    var allowedParents = ["abbr", "acronym", "address", "applet", "b", "bdo", "big", "blockquote", "body", "caption", "center", "cite", "code", "dd", "del", "div", "dfn", "dt", "em", "fieldset", "font", "form", "h1", "h2", "h3", "h4", "h5", "h6", "i", "iframe", "ins", "kdb", "li", "object", "pre", "p", "q", "samp", "small", "span", "strike", "s", "strong", "sub", "sup", "td", "th", "tt", "u", "var"];
			    var xpath = "//text()[(parent::" + allowedParents.join(" or parent::") + ")" + "]";
			    var candidates = doc.evaluate(xpath, doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				if (candidates)	{
					for (cand = null, z = 0; (cand = candidates.snapshotItem(z)); z++) {
			            var source = cand.nodeValue;
						if (source) hasil = patternParse(source);
					}
				}
			}
		}
		simpleMatch();
	})();
  }
  
  this.tabSelected = function () {
    var D;
    var prefs = getPrefsBranch();
	var enabled = prefs.getBoolPref("enabled");
    D = content.document.getElementById(attr[1]); //check if xhtml still there
    if (enabled && !D) { //State is enabled
      pageProcess(content.document);
      changeClass(0);
      addEvent();
    } else if (!enabled && D){ //state is disabled
      gBrowser.reload();
      changeClass(1);
      removeEvent();
    }
  };
  
  this.pageLoad = function () {
    var prefs = getPrefsBranch();
	var enabled = prefs.getBoolPref("enabled");
	var enabledPopup = prefs.getBoolPref("enabledPopup");
    if (enabled) { //if state is enabled
      pageProcess(content.document);
      changeClass(0);
      if (enabledPopup) addEvent();
    }
  };
  
  this.toogle = function () {
    var prefs = getPrefsBranch();
	var enabled = prefs.getBoolPref("enabled");
	prefs.setBoolPref("enabled", enabled = !enabled);
	prefs.setBoolPref("enabledPopup", enabled);
    if (enabled) { //Object XMLhtmlRequest => berarti ini kondisi dinonAKTIFkan
      pageProcess(content.document);
      changeClass(0);
      addEvent();
    } else { //NULL => berarti ini kondisi diAKTIFkan
      gBrowser.reload();
      changeClass(1);
      removeEvent();
    }
  };
  
  this.toogleLink = function () {
    var prefs = getPrefsBranch();
	var enabled = prefs.getBoolPref("enabled");
	var enabledPopup = prefs.getBoolPref("enabledPopup");
	prefs.setBoolPref("enabled", enabled = !enabled);
    if (enabled) { //Object XMLhtmlRequest => berarti ini kondisi dinonAKTIFkan
      pageProcess(content.document);
      changeClass(0);
      removeEvent();
    } else { //nonAktif
      gBrowser.reload();
      changeClass(1);
      if (enabledPopup) {
        removeEvent();
	    prefs.setBoolPref("enabledPopup", enabledPopup = !enabledPopup);
      }
      //alert(document.getElementById("ayatizer_togglePopup").getAttribute("disabled"));
      //document.getElementById("ayatizer_togglePopup").setAttribute("disabled", "true");
    }
  };
  
  this.tooglePopup = function () {
    var prefs = getPrefsBranch();
    var enabled = prefs.getBoolPref("enabled");
	var enabledPopup = prefs.getBoolPref("enabledPopup");
    if (enabled) {
	  prefs.setBoolPref("enabledPopup", enabled = !enabledPopup);
      if (enabledPopup) {
        removeEvent();
      } else {
        addEvent();
      }
    } else {
      document.getElementById("ayatizer_togglePopup").setAttribute("checked", "");
    }
  };

  function analyzeText() {    
    var D = mousePointer[0],
    G = mousePointer[1];
    createXHTML(createSearchingSpan(), D, G);
    getPopupContent(w(), D, G)
  }

  function getPopupContent(E, D, F) { //word
    var C, B;
    (B = xhtml)[0].abort();
    B[0].open("GET", (C = links[2] + E), true);
    B[0].send(null);
    B[0].onreadystatechange = function () {

      if (B[0] && B[0].readyState == 4 && B[0].status == 200) {
        var G;
        if ((G = formatData(B[0].responseText, D, F))) {
          B[0].abort();
          createXHTML(G, D, F);
          A = C
        }
      } else {
        if (B[0].status > 200) {
          createXHTML(document.getElementById("ayatizer_stringbundle").getString("error"), D, F) //error
        }
      }

    }
  }

  function formatData(E, C, F) {
    var B = xhtml,
    G = E,
    D = i; //i = [0: /<span class=\"midashi\"><font class=\'searchwordfont\' color=\'#BF0000\'>(\w[\w'-]+)<\/font><\/span>\W+(.+?)\W<\/li>\W+<li><span class="midashi">/g, 1: /<strong><span class=\"hklabel\">\u5909\u5316\u5F62<\/span> : (?:<span class=\'singular\'>\u300A\u5358\u300B<\/span>)?<a href=\'javascript:goGradable\(\"(\w+)\"\)\'>\1<\/a>/gi, 2: /(?:\u25C6|(?:<br \/>\u30FB)).+?[?:(\u3002|\uff1f|\uff01|(?:\u25C6.+?))]*<\/(li|ol|div)>/g, 3: /<span class=\"label\">\u3010(\u30EC\u30D9\u30EB|\uFF20)\u3011<\/span>[^<]+/g, 4: /<span class="midashi">(?:<font class='searchwordfont' color='#BF0000'>(?:\w+|\w*)<\/font>(?:[dry\'s ])?){2}<\/span>\W+.+\W/gi, 5: /<br \/>(?:\uFF1D|\u2192)<span class="refvocab">([\w\'\-]+)<\/span>/g]
    B[0].abort();
    var headText = "",
    content = "";
    G = G.replace(/^\(/, "");
    G = G.replace(/\);$/, "");
    var json = nativeJSON.decode(G); 
    var a = 0;
    var book_write = "";
    var id_cur = 0;
    var id_prev = 0;
    for (var y in json){
		for (var i in json[y]['res']){
			a++;
        	id_cur = json[y]['res'][i]['texts']['id'];        	
    	    if ((id_cur-1) != id_prev && id_prev != 0) {
    			if (a == 1) {
    				book_write = " ";
    			} else {
    				book_write = "<br>" + " ";
    			}
    		}
    		else {
    			book_write = "";
    		}
        	id_prev = id_cur;
			
			content += "<b><span title=\"" + escapeHTML(json[y]['res'][i]['texts']['abbr']) + " " + escapeHTML(json[y]['res'][i]['texts']['chapter']) + ":" + escapeHTML(json[y]['res'][i]['texts']['verse']) + "\">" + book_write + escapeHTML(json[y]['res'][i]['texts']['chapter']) + ":" + escapeHTML(json[y]['res'][i]['texts']['verse']) + "</span></b> " + escapeHTML(json[y]['res'][i]['texts']['text']) + " ";
		}
		if (headText == "") {
		    headText += escapeHTML(json[y]['ref']);
		} else
		    headText += "; " + escapeHTML(json[y]['ref'].replace(/.*[a-z|A-Z]+/, ""));
	}
	headText = "<b><a style=\"text-decoration: none;\" href=\"" + "http://alkitab.sabda.org/ayatizer.php?p=" + headText  + "&dari_url=" + window.content.document.location.href + "\">" + headText + "</a></b> (TB)";

	popupContent[0] = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
	popupContent[0].setAttribute("id", "SAPopupHeader");	
	popupContent[0].setAttribute("style", "background: #C0C0C0; padding: 0 4px; cursor: move;");	
	popupContent[0].addEventListener("mousedown", popupMouseDown, false);
	popupContent[1] = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
	popupContent[1].setAttribute("id", "SAPopupContent");
	popupContent[1].setAttribute("style", "height: 100px; overflow:auto; padding: 0 4px;");
	popupContent[2] = headText;
	popupContent[3] = content;
	popupContent[4] = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
	popupContent[4].setAttribute("id", "SAPopupFooter");	
	popupContent[4].setAttribute("style", "padding: 0 4px; height: 20px;");		
	//popupContent[4] = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
	//popupContent[4].setAttribute("id", "SAButtonClose");
	//popupContent[4].setAttribute("title", "close");
	//popupContent[4].setAttribute("style", "background-image:url(chrome://ayatizer/skin/closePopup.png); background-repeat:no-repeat; cursor:pointer; height:10px; position:absolute; right:5px; top:5px; width:10px;");
	return popupContent;
  }

  function checkParent(E, targetParent){  
	while (E != null) {
	    E = E.parentNode;
	    if (E != null) {
		    if (E.id == targetParent) {
		        return "true";
		    }
		    if (E.nodeName == "HTML") {
		        return "false";
		    }
		 }
	}
  }

  function getMouseOver(E) {
     var D = E.rangeOffset,
      F = E.target,
      B, C;
    if (((B = xhtml)[8] && (F == B[3]) && D >= B[5] && D <= B[6])) {
      return
    }
    B[0].abort();
    C = E.rangeParent;
    if ((E.explicitOriginalTarget.nodeType != 3) && !("form" in F)) {
      C = null;
      D = -1
    }
    
    var stats = "false";
    stats = checkParent(E.target, attr[1]);
    if (F.className == attr[6] && stats == "false") { //cek apakah link ke alkitab.sabda.org
      parameter[0] = F.text; //tambahan sendiri
      if (B[7]) {
        timer.cancel(B[7]);
        B[7] = 0
      }
      B[3] = F;
      B[1] = C;
      B[2] = D;
      timer.cancel(B[10]);
      B[10] = 0;
      mousePointer[0] = E.pageX;
      mousePointer[1] = E.pageY;
      B[7] = timer.initWithCallback(analyzeText, 400, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
    } else {
        if (stats == "false") { // cursor outside of the popup
          if (B[7]) {
            timer.cancel(B[7]);
            B[7] = 0;
          }
          timer.cancel(B[10]);
          B[10] = 0;
          B[10] = timer.initWithCallback(hidePopup, 800, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
        } else { //cursor on the popup
            timer.cancel(B[7]);
            B[7] = 0;
            timer.cancel(B[10]);
            B[10] = 0;
        }
    }
  }

  function popupMouseDown(event) {
	var x, y;
    dragObj.elNode = content.document.getElementById(attr[1]);
	// If this is a text node, use its parent element.
    if (dragObj.elNode.nodeType == 3)
        dragObj.elNode = dragObj.elNode.parentNode;
	// Get cursor position with respect to the page.
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
	// Save starting positions of cursor and element.
	dragObj.cursorStartX = x;
	dragObj.cursorStartY = y;
	dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
	dragObj.elStartTop = parseInt(dragObj.elNode.style.top, 10);
	if (isNaN(dragObj.elStartLeft))
	    dragObj.elStartLeft = 0;
	if (isNaN(dragObj.elStartTop))
	    dragObj.elStartTop  = 0;
	// Update element's z-index.
	dragObj.elNode.style.zIndex = ++dragObj.zIndex;
	// Capture mousemove and mouseup events on the page.
    document.addEventListener("mousemove", dragGo, true);
	document.addEventListener("mouseup", dragStop, true);
    event.preventDefault();
  };
  
  function dragGo(event) { //function if the cursor has pressed and moved
	var x, y, E;
	// Get cursor position with respect to the page
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
    E = content.document.getElementById(attr[1]);
	// Move drag element by the same amount the cursor has moved
	dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
	dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";
    event.preventDefault();
  }
    
  function dragStop(event) { //function if the cursor has unpressed
	// Stop capturing mousemove and mouseup events.
    document.removeEventListener("mousemove", dragGo, true);
    document.removeEventListener("mouseup", dragStop, true);
  }
  
  function createXHTML(L, K, J) {
    var xHtmlAttr, F, B, T, G, P, O, S, R, leftPosition, topPosition, I = 8,
      H = 14;
    if (! (B = (F = content.document).getElementById((xHtmlAttr = attr)[1]))) {
      try {
        var M, C = "chrome://ayatizer/skin/ALC.css";
        //embed css
        (M = F.getElementsByTagName("head")[0]).innerHTML = M.innerHTML + '<link id="ayatizer-css" href="' + C + '" type="text/css" rel="stylesheet">'
      } catch(Q) {}
      B = F.createElementNS("http://www.w3.org/1999/xhtml", "XHTML");
      B.setAttribute("id", xHtmlAttr[1]);
    }
    if (L[0] == "<" || typeof(L[0]) == "undefined") {
        B.innerHTML = L;
    } 
    else {
        B.innerHTML = "";
        B.appendChild(L[0]);
        B.appendChild(L[1]);
        B.appendChild(L[4]);
        content.document.getElementById("SAPopupHeader").innerHTML = L[2];
        content.document.getElementById("SAPopupContent").innerHTML = L[3];
        content.document.getElementById("SAPopupFooter").innerHTML = "<b>" + document.getElementById("ayatizer_stringbundle").getString("powered.by") + " <a href=\"http://www.ylsa.org\" target=\"_blank\" style=\"text-decoration:none\">YLSA</a></b>";
    }
    //to arrange popup position
    if ((leftPosition = K + I) > (S = content.innerWidth + (P = content.scrollX) - (T = B.offsetWidth) - I)) {
      leftPosition = S
    }
    if (leftPosition < P) {
      leftPosition = P
    }
    if ((topPosition = J + H) > (R = content.innerHeight + (O = content.scrollY) - (G = B.offsetHeight) - H)) {
      topPosition -= (G + H);
      if (topPosition < 0) {
        topPosition = 1
      }
    }
    if (topPosition < O) {
      topPosition = O
    }
    B.style.cssText = xHtmlAttr[3] + topPosition + xHtmlAttr[4] + leftPosition + xHtmlAttr[5];
    F.documentElement.appendChild(B)
  }

  function hidePopup() {
    var C, D, B;
    if ((D = window.content.document.getElementById((C = attr)[1]))) { //there is xhtml in the document
      D.style.cssText = C[2] //C[2] = "visibility:hidden;top:0px;left:0px;"
    } (B = xhtml)[0].abort(); //B = xhtml
    if (B[7]) {
      timer.cancel(B[7]);
      B[7] = 0
    }
    if (B[4] && !B[4].closed) {
      B[4].getSelection().removeAllRanges();
      B[4] = null
    }
    B[5] = -1;
    B[6] = -1;
    B[8] = 0;
    A = ""
  }

  function getKeyCode(C) {
    switch (C.keyCode) {
    case 115: //F4
      if (links[1]) {
        var B = links[0] + links[1];
        hidePopup();
        gBrowser.selectedTab = gBrowser.addTab(B) //open to a new tab
      }
    case 27: //Esc
      hidePopup();
    }
  }
};

function Ayatizer_onPageLoad(event) {
    _sal.pageLoad();
}
function Ayatizer_tabSelected(event) {
    _sal.tabSelected();
}
    
gBrowser.addEventListener("DOMContentLoaded", Ayatizer_onPageLoad, false);

gBrowser.tabContainer.addEventListener("TabSelect", Ayatizer_tabSelected, false);