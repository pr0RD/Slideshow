// ==UserScript==
// @name        pr0gramm.com Slideshow by RD
// @author	RD
// @description Verbessert das pr0gramm mit einer Slideshow
// @include     http://pr0gramm.com/*
// @icon http://pr0gramm.com/media/pr0gramm-favicon.png
// @version     1.0.0.0
// @grant       none
// @require	http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js
// @updateURL     https://github.com/pr0RD/Slideshow/raw/master/pr0gramm.com%20Slideshow%20by%20RD.user.js
// ==/UserScript==

$(document).ready(function(){
    var vis = false;
    var visId = 0;
    var lastPicId = "";
    
    function addButton(){
        $("#head-menu").append('<a id="slideshowLink" title="Slideshow" style="">&nbsp&nbsp&nbsp&nbsp&nbsp</a>');
        $("#page").append('<div id="slideshowBg"><center><div id="slideShowContainer"><img id="slideshowImg" src=""></div></center></div>');
    }
    
    function addCss(){        
        $("#slideshowLink").css({
            "background-image" : "url('https://raw.githubusercontent.com/pr0RD/Slideshow/master/icon.png')",
            "background-size" : "inherit",
            "background-position" : "center",
            "background-repeat" : "no-repeat",
            "cursor" : "pointer",
            "margin-left" : "20px"
        });
        
        $("#slideshowBg").css({
            "position" : "fixed",
            "top" : "0",
            "left" : "0",
            "height" : "100%",
            "width" : "100%",
            "background" : "rgba(0, 0, 0, 0.9)",
            "display" : "none",
            "z-index" : "10"
        });
        
        $("#slideShowContainer").css({
            "max-width" : "80%",
            "max-height" : "90%",
            "margin-top": "60px"
        });
    }
    
    function addEvent(){
        $("#slideshowLink").click(function(){
            if(!vis){
                $("#slideshowBg").fadeIn();
                vis = true;
                visId++;
                update(visId);
                $("#slideshowLink").css({"background-image" : "url('https://raw.githubusercontent.com/pr0RD/Slideshow/master/icon_active.png')"});
            }else{
                $("#slideshowBg").fadeOut();
                vis = false;
                $("#slideshowLink").css({"background-image" : "url('https://raw.githubusercontent.com/pr0RD/Slideshow/master/icon.png')"});
            }
        });
    }
    
    function update(newVisId){
        if(vis && newVisId == visId){
            $.ajax({
                url : "http://pr0gramm.com/static/top/",
                success : function(result){
                    var doc = parseHTML(result);
                    var element = doc.getElementsByTagName("a")[5];
                    var link = element.attributes.href.value;
                    var id = link.replace("/static/", "");
                    if(id != lastPicId){
                        lastPicId = id;
                        $.ajax({
                            url : "http://pr0gramm.com" + link,
                            success : function(result2){
                                var doc2 = parseHTML(result2);
                                var content = "";
                                if(doc2.getElementsByTagName("video").length > 0){
                                    content = doc2.getElementsByTagName("video")[0];
                                    content.id = "slideshowVid";
                                }else{
                                    content = doc2.getElementsByTagName("img")[0];
                                    content.id = "slideshowImg";
                                }                                
                                
                                if(content != ""){
                                    $("#slideShowContainer").html(content);
                                    $("#slideshowVid").css({
                                        "width" : "100%"
                                    });
                                }
                            }
                        });
                    }
                },
                complete : function(){
                    setTimeout(function(){
                        update(newVisId)
                    }, 20000);
                }
            });
        }
    }
    
    function parseHTML(markup) {
        var doc = document.implementation.createHTMLDocument("");
        
        if (markup.toLowerCase().indexOf('<!doctype') > -1) {
            doc.documentElement.innerHTML = markup;
        } else {
            doc.body.innerHTML = markup;
        }
        return doc;
    }
    
    function init(){
        addButton();
        addCss();
        addEvent();
    }
    
    init();
});
