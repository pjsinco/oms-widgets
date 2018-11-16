/* * * * * * * * * * * * * * * * * * * *
<-<--<---< solarBox v2.0.0 <----<-------<
* * * * * * * * * * * * * * * * * * * * */
/*
Brian Bass / Orbit Media Studios / 2014
*/

(function($) {

jQuery.fn.solarBox = function(opts) {

    var addThisHtml = '\
    <div class="addthis_toolbox addthis_default_style addthis_20x20_style">\
    <a class="addthis_button_facebook"></a>\
    <a class="addthis_button_google_plusone_share"></a>\
    <a class="addthis_button_twitter"></a>\
    <a class="addthis_button_linkedin"></a>\
    </div>';
    //FULL LIST OF SERVICES HERE: http://www.addthis.com/services

    //HTML FOR THE BOTTOM OF POPUP BOX
    var htmlBottom = '\
    <div id="solarBoxBottom">\
        <a class="solarBoxClose" href="#"></a>\
        <div id="solarBoxTitle"></div>\
        <div id="solarBoxCounter">\
            <span id="solarBoxCount"></span>\
            <span id="solarBoxSeparator"></span>\
            <span id="solarBoxTotal"></span>\
        </div>\
        <div id="solarSocial"></div>\
    </div>';

    //HTML FOR THE ENTIRE BOX
    var htmlLayout = '\
    <div id="solarBoxContainer">\
        <a id="solarBoxPrev" href="#"></a>\
        <a id="solarBoxNext" href="#"></a>\
        <div id="solarBoxOuter">\
            <div id="solarBoxTop">\
                <a class="solarBoxClose" href="#"></a>\
            </div>\
            <div id="solarBoxInner">\
                <div id="solarBoxLoading">\
                    <div id="solarBoxContent"></div>\
                </div>\
                '+htmlBottom+'\
            </div>\
        </div>\
    </div>';
    var galleryData = []; //GALLERY INFORMATION ARRAY
    var galIndex = 0; //CURENT INDEX OF GALLERY
    var contentBaseWidth = 0;
    var contentBaseHeight = 0;
    var scrWidth = window.innerWidth  ? window.innerWidth  : $(window).width();
    var scrHeight = window.innerHeight ? window.innerHeight : $(window).height();
    var opened = false;
    var contentBaseHeight = 0;

    //VARABLES FOR SWIPPING
    var touchPos = 0;
    var swipePos = 0;
    var isSwipping =false;

    opts = $.extend({
            countSeparator:"/",
            mobileBreak:768,
            fullscreen:false,
            closeInBottom:false,
            addThis:false,
            addThisHtml:addThisHtml,
            changeHash:false,
            fullScreenPadding:42,
            videoDefaultWidth:560,
            vidDefaultHeight:314,
            swipeThreshold:200,
            onSolarOpen:false,
            onSolarClose:false,
            onSolarChange:false
        },
    opts || {});

    //ADDS TRIGGER TO SELECTED ELEMENTS
    this.off("click.solarOpen");
    this.on("click.solarOpen",function(){
        if(opened != true){
            createGalData($(this)); //CREATE ARRAY OF ALL ELEMENTS
            createBox();  //CREATE BOX

            //Callback
            if (typeof opts.onSolarOpen === 'function') {
                opts.onSolarOpen();
            }
            transition(); //START WITH FIRST ITEM OF ARRAY FIRST ITEM
        }
        opened = true;
        return false;
    });
    //AUTO-OPEN FROM HASH
    hashStr = window.location.hash;
    $(document).bind("ready.solarOpen",function() {
        if(hashStr && opts.changeHash) {
            if(hashStr.indexOf("sb=") != -1){ //PARSE SOLARBOX HASH
                targetHref = hashStr.replace('#sb=','');
                targetElem = $("[data-solarbox]").filter("[href='"+targetHref+"']:first");
                if(targetElem.length > 0){
                    createGalData(targetElem); //CREATE ARRAY OF ALL ELEMENTS
                    createBox();  //CREATE BOX
                    //Callback
                    if (typeof opts.onSolarOpen === 'function') {
                        opts.onSolarOpen();
                    }
                    transition(); //START WITH FIRST ITEM OF ARRAY FIRST ITEM
                }else{
                    window.location.replace("#");
                }
            }
        }
    });

    //REISIZE BOX IF WINDOW IS RESIZED
    $(window).on("resize.solarOpen",function(){
        scrWidth = window.innerWidth ? window.innerWidth : $(window).width();
        scrHeight = window.innerHeight ? window.innerHeight : $(window).height();
        resizeContainer();
        animBox();
    });

    //CREATE ARRAY OF ALL ELEMENTS
    function createGalData(obj){
        gallery = $("[data-solarbox='"+obj.attr("data-solarbox")+"']");
        galIndex = gallery.index(obj);
        galleryData = [];

        gallery.each(function(){
            galleryData.push( {
            "href":$(this).attr("href"),
            "width":$(this).attr("data-solarwidth"),
            "height":$(this).attr("data-solarheight"),
            "title":$(this).attr("data-solartitle")
            });
        });

    }
    //LOAD UP NEXT ELEMENT IN ARRAY
    function transition(){
        setPrevNext();
        addContent();
    }
    //FIND OUT WHAT TYPE OF CONTENT TO OPEN
    function addContent(){
        href = galleryData[galIndex]["href"];
        boxContent = $("#solarBoxContent");
        container = $("#solarBoxContainer");
        container.removeClass("imageMedia").removeClass("videoMedia").removeClass("inlineMedia");

        if (href.match(/youtube\.com\/watch/i)) { //YOUTUBE CONTENT
            loadYoutube();
            container.addClass("videoMedia");
        }else if(href.match(/http(s?):\/\/(www\.)?vimeo.com\/(\d+)/)){ //VIMEO CONTENT
            loadVimeo();
            container.addClass("videoMedia");
        }else if(href.match(/http(s?):\/\/(www\.)?viddler.com\/v\/([a-zA-Z0-9]+)/)){ //INLINE CONTENT
            loadViddler();
            container.addClass("videoMedia");
        } else if(href.charAt(0) == "#"){ //INLINE CONTENT
            loadInline();
            container.addClass("inlineMedia");
        } else { //IMAGE
            loadImg();
            container.addClass("imageMedia");
        }

        //SET HASHTAG
        if(opts.changeHash){
            window.location.replace("#sb="+href);
        }
    }
    //YOUTUBE CONTENT
    function loadYoutube() {
        if(galleryData[galIndex]["width"] && galleryData[galIndex]["height"]){
            contentBaseWidth = parseInt(galleryData[galIndex]["width"]);
            contentBaseHeight = parseInt(galleryData[galIndex]["height"]);
        }else{
            contentBaseWidth = opts.videoDefaultWidth;
            contentBaseHeight = opts.vidDefaultHeight;
        }
        var youtubeUrl = getQueryVar(galleryData[galIndex]["href"],"v");
        content = '<iframe id="solarBoxIframe" src="//www.youtube.com/embed/'+youtubeUrl+'" frameborder="0" allowfullscreen></iframe>';
        boxContent.html(content);
        addCaptions();
        animBox();
    }
    //VIMEO CONTENT
    function loadVimeo() {
        if(galleryData[galIndex]["width"] && galleryData[galIndex]["height"]){
            contentBaseWidth = parseInt(galleryData[galIndex]["width"]);
            contentBaseHeight = parseInt(galleryData[galIndex]["height"]);
        }else{
            contentBaseWidth = opts.videoDefaultWidth;
            contentBaseHeight = opts.vidDefaultHeight;
        }

        var video_id = galleryData[galIndex]["href"].match(/http(s?):\/\/(www\.)?vimeo.com\/(\d+)/);
        content = '<iframe id="solarBoxIframe" src="//player.vimeo.com/video/'+ video_id[3] +'?title=0&amp;byline=0&amp;portrait=0" frameborder="0" allowfullscreen></iframe>';
        boxContent.html(content);
        addCaptions();
        animBox();
    }
    //VIDDLER CONTENT
    function loadViddler() {
        if(galleryData[galIndex]["width"] && galleryData[galIndex]["height"]){
            contentBaseWidth = parseInt(galleryData[galIndex]["width"]);
            contentBaseHeight = parseInt(galleryData[galIndex]["height"]);
        }else{
            contentBaseWidth = opts.videoDefaultWidth;
            contentBaseHeight = opts.vidDefaultHeight;
        }

        var video_id = galleryData[galIndex]["href"].match(/http(s?):\/\/(www\.)?viddler.com\/v\/([a-zA-Z0-9]+)/);
        content = '<iframe id="solarBoxIframe" src="//www.viddler.com/embed/'+video_id[3]+'/?f=1&offset=0&autoplay=0&disablebranding=0" frameborder="0" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>';
        boxContent.html(content);
        addCaptions();
        animBox();
    }
    //INLINE CONTENT
    function loadInline() {
        if(galleryData[galIndex]["width"] && galleryData[galIndex]["height"]){
            contentBaseWidth = parseInt(galleryData[galIndex]["width"]);
            contentBaseHeight = parseInt(galleryData[galIndex]["height"]);
        }else{
            contentBaseWidth = opts.videoDefaultWidth;
            contentBaseHeight = opts.vidDefaultHeight;
        }

        content = $(href).html();
        boxContent.html(content);
        addCaptions();
        currType = "Inline";
        animBox();
    }
    //IMAGE CONTENT
    function loadImg(obj) {
        var newImg = new Image();
        newImg.onload = function() {
            boxContent = $("#solarBoxContent");
            boxHtml = '<img id="solarBoxImage" src="'+galleryData[galIndex]["href"]+'" />';
            boxContent.html(boxHtml);
            addCaptions();

            contentBaseWidth = newImg.width;
            contentBaseHeight = newImg.height;
            currType = "Image";
            animBox();
            $("#solarBoxImage").css("opacity",1);
        }
        newImg.src = galleryData[galIndex]["href"];
    }
    //ADDS CAPTION DATA
    function addCaptions() {
        $("#solarBoxTitle").html(galleryData[galIndex]["title"]);
    }
    //CONTROLS THE WHOLE ANIMATION
    function animBox(){

        //DEFINE VARIABLES
        contentWidth = contentBaseWidth;
        contentHeight = contentBaseHeight;
        container = $("#solarBoxContainer");
        container.height(scrHeight);
        outer = $("#solarBoxOuter");
        inner = $("#solarBoxInner");
        boxTop = $("#solarBoxTop");
        boxBottom = $("#solarBoxBottom");

        //SET FULLSCREEN
        if(opts.mobileBreak >= scrWidth) { //SET FULLSCREEN IF MOBILE
                useFullScreen = true;
        }else{
            if(opts.fullscreen == true){ //SET DEFUALT FULLSCREN USAGE
                useFullScreen = true;
            }else{
                useFullScreen = false;
            }
        }


        //ADD CLASSES FOR SIZES
        if(useFullScreen == false){
            container.removeClass("viewFull").addClass("viewBox");
        }else{
            container.removeClass("viewBox").addClass("viewFull");
        }

        paddingWidth = parseInt(inner.css("padding-right"))+parseInt(inner.css("padding-left"));
        paddingHeight = parseInt(inner.css("padding-top"))+parseInt(inner.css("padding-bottom"));

        //SET WIDTH/HEIGHT FOR ANIMATION
        if(useFullScreen == false){
            //LARGE SCREEN BOX SIZE

            //CAPTION ASSUME A WIDTH LARGE CAPTIONS
            //MAKE NECESSARY COORECTIONS LATER ON
            /*
            boxBottom.height("auto").width(50);
            if(boxBottom.height() > parseInt(boxBottom.css("max-height"))){
                boxBottom.height(boxBottom.css("max-height"));
            };*/

            //SCREEN DIMENSIONS
            innerScrWidth = scrWidth-opts.fullScreenPadding*2;
            innerScrHeight = scrHeight-opts.fullScreenPadding*2;
            screenRatio = innerScrWidth/innerScrHeight;

            //BOX DIMENSIONS
            boxWidth = contentWidth+paddingWidth;
            boxHeight = contentHeight+paddingHeight+boxTop.height()+boxBottom.height();
            boxRatio = contentWidth/contentHeight;
            //IF CONTENT IS SMALLER THAN SCREEN
            newWidth = contentWidth;
            newHeight = contentHeight;

            //IF CONTENT IS LARGER THAN SCREEN
            if(boxRatio < screenRatio && boxHeight > innerScrHeight){
                //IF CONTENT IS LESS WIDE THAN SCREEN
                newHeight = contentHeight-(boxHeight-innerScrHeight);
                newWidth = contentWidth*newHeight/contentHeight;
            }else if(boxRatio > screenRatio && boxWidth > innerScrWidth){
                //IF CONTENT IS WIDER THAN SCREEN
                newWidth = contentWidth-(boxWidth-innerScrWidth);
                newHeight = contentHeight*newWidth/contentWidth;
            }

            //DO ANIMATION
            outer.width(newWidth+paddingWidth).height(newHeight+paddingHeight+boxTop.height()+boxBottom.height());
            $("#solarBoxContent, #solarBoxIframe").width(newWidth).height(newHeight);
            boxBottom.width("100%");


        }else{
            //MOBILE / FULLSCEEN SIZE

            //SCREEN DIMENSIONS
            screenRatio = scrWidth/scrHeight;

            //BOX DIMENSIONS
            boxWidth = contentWidth;
            boxHeight = contentHeight;
            boxRatio = contentWidth/contentHeight;

            if(boxRatio < screenRatio){
                //IF CONTENT IS LESS WIDE THAN SCREEN
                newHeight = contentHeight-(boxHeight-scrHeight);
                newWidth = contentWidth*newHeight/contentHeight;
            }else{
                //IF CONTENT IS WIDER THAN SCREEN
                newWidth = contentWidth-(boxWidth-scrWidth);
                newHeight = contentHeight*newWidth/contentWidth;
            }

            //DO ANIMATION
            outer.width("auto").height("auto");
            $("#solarBoxContent, #solarBoxIframe").width(newWidth).height(newHeight);

        }
        //SHOWS AFTER FIRST SLIDE TO AVOID FLICKERING
        container.css("visibility","visible");

    }

    function setPrevNext(){
        if(galleryData.length == 1){ //REMOVE IF NOT MULTIPLE
            $("#solarBoxPrev, #solarBoxNext, #solarBoxCounter").hide();
        }else{ //SET
            $("#solarBoxPrev, #solarBoxNext, #solarBoxCounter").show();
        }

    }
    function triggerPrevNext(step){
        //SET NEXT IMAGE TO LOAD
        index = galIndex+step;
        if(index < 0){
            index = galleryData.length-1; //CYCLE IF AT BEGINNING
        }else if(index > galleryData.length-1){
            index = 0; //CYCLE IF AT END
        }

        galIndex = index;

        //Callback
        if (typeof opts.onSolarChange === 'function') {
            opts.onSolarChange();
        }

        setCount();
        transition();
        return false;
    }
    function setCount(total){
         $("#solarBoxCount").html(galIndex+1);
         $("#solarBoxSeparator").html(opts.countSeparator);
         $("#solarBoxTotal").html(galleryData.length);
    }
    function createBox(){
        //CREATE
        $("body").append(htmlLayout);
        $("#solarBoxContainer").on("click.solarBoxClose",function(e){
            var target = $(e.target);
            if(typeof target.context.id !== "undefined"){
                if (target.context.id == "solarBoxOuter" || target.context.id == "solarBoxContainer") {
                    destroy();
                }
            }
        });

        //ADD CLASSES
        if(opts.closeInBottom){
            $("#solarBoxContainer").addClass("closeInBottom");
        }
        if(opts.addThis){
            $("#solarBoxContainer").addClass("useAddThis");
        }


        //ADD CLOSE BUTTON ACTION
        $(".solarBoxClose").on("click.solarClose",function(){
            destroy();
            return false;
        });

        //ADD PREV / NEXT ACTIONS
        $("#solarBoxPrev").on("click.solarNext",function(){
            triggerPrevNext(-1);
            return false;
        });
        $("#solarBoxNext").on("click.solarPrev",function(){
            triggerPrevNext(1);
            return false;
        });
        $(document).on("keydown.solarKey",function(e){
            if (e.keyCode == 37) {
                triggerPrevNext(-1);
            }
            if (e.keyCode == 39) {
                triggerPrevNext(1);
            }
        });

        //SWIPPING
        if('ontouchstart' in window){ //TOUCH SWIPPING
            $(document).on("touchstart.solarTouch",function(event){
                touchPos = event.originalEvent.touches[0].pageX;
            }).on("touchmove.solarTouch",function(event){
                swipePos = event.originalEvent.touches[0].pageX;
            }).on("touchend.solarTouch",function(){
                detectSwipe();
            });
        }else{ //MOUSE SWIPPING
            $(document).on("mousedown.solarTouch",function(event){
                touchPos = event.pageX;
            }).on("mousemove.solarTouch",function(event){
                swipePos = event.pageX;
            }).on("mouseup.solarTouch",function(){
                detectSwipe();
            });
        }

        //INITIALIZE ADDTHIS
        $("#solarSocial").html(opts.addThisHtml);
        $.getScript("//s7.addthis.com/js/300/addthis_widget.js#async=1", function(){
            addthis.toolbox('.addthis_toolbox')
        });

        //STYLE
        setCount();
        resizeContainer();

    }
    //DETECT SWIPE
    function detectSwipe(){
        //SWIPE LEFT
        if(swipePos + opts.swipeThreshold < touchPos){
            triggerPrevNext(-1);
            isSwipping = true;
        }
        //SWIPE RIGHT
        if(swipePos - opts.swipeThreshold > touchPos){
            triggerPrevNext(1);
            isSwipping = true;
        }
    }
    function resizeContainer(){
        var oStyles = {height: scrHeight};
        overlay = $("#solarBoxContainer");
        overlay.css(oStyles);
    }
    //CLOSE BOX
    function destroy(){
        if(!isSwipping){
            //REMOVE DOM
            $('#solarBoxContainer').remove();

            //REMOVE TRIGGERS
            $(".solarBoxClose").off("click.solarClose");
            $("#solarBoxPrev").off("click.solarNext");
            $("#solarBoxNext").off("click.solarPrev");
            $(document).off("keydown.solarKey touchstart.solarTouch touchmove.solarTouch touchend.solarTouch mousedown.solarTouch mousemove.solarTouch mouseup.solarTouch");

            //Callback
            if (typeof opts.onSolarClose === 'function') {
                opts.onSolarClose();
            }
            //RESET HASHTAG
            if(opts.changeHash){
                var scrollPos = $(window).scrollTop();
                window.location.replace("#");
                $(window).scrollTop(scrollPos);
            }
            opened = false;
        }else{
            isSwipping = false;
        }
    }
    //GET VARIABLE FROM URL
    function getQueryVar(str,name){
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( str );
      return ( results == null ) ? "" : results[1];
    }

    //PUBLIC FUNCTIONS OBJECT
    publicFuncs = {};
    publicFuncs.openJsGallery = function(data,optsData){
            //REMOVE AUTO OPENING TO PREVENT CONFLICTS
            $(document).unbind("ready.solarOpen");
            //OPEN GALLERY WITH JS ARRAY
            opts = $.extend(opts,optsData || {});
            galleryData = data;
            createBox();
            transition();
    }
    return {
        publicFuncs: publicFuncs
    }

};
//CREATE NICE LOOKING OBJECT TO CALL PUBLIC FUNCTIONS
$.solarBox = $().solarBox();
$.solarBox.openJsGallery = function(galleryData,opts){
    $.solarBox.publicFuncs.openJsGallery(galleryData,opts);
}

})(jQuery);
