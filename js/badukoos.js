var Popup = function(url, size, w) {	
	return w.open(url, 'popup', "width=500,height=500,menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,status=yes"); 
};
var Badukoos = (function(w, d) {
	//private methods, members
	var init = function () {
		console.log("INIT");		
		setListeners();
		setSocialListeners();
		bobbleHead();		
	},
	triggies = [],
	sreejeeGoodies = ["#moe", "#devil", "#smooth"],
	sreejHead = "#sreej",
	$socialcontainer = $(".social"),
	generatedimage;

	moveGoodie = function(e){
		$(e.data).css("margin", 0);								
		$(e.data).css({left:e.pageX, top:e.pageY});			
	};
	/**
		Shake the sreejee
	**/			
	var bobbleHead = function() {
		var $sreejHead = $(sreejHead);
		$sreejHead.on('mousedown', function(e){
			$(e.target).removeClass("off").addClass("on");
		});
		$sreejHead.on('mouseup', function(e){
			$(e.target).removeClass("on").addClass("off");
			setTimeout(function() {$(e.target).removeClass("off").removeClass("on");}, 100);
		});	
		
	};
	/**
		Attach all behaviors for moes
	**/	
	var setListeners = function() {
	console.log("SET LISTENERS");		
		$(sreejeeGoodies).each(function(i, thing){		
			triggies.push(false);
			$(thing).on("click", function(e) {
				if(!triggies[i]) {
					$(d).bind('mousemove', thing, moveGoodie);
				} else {					
					$(d).unbind('mousemove', moveGoodie);
					makeCanvasSnapshot();
					
				}			
				triggies[i] = !triggies[i];
			});
		});
		$(w).on("resize", function() {	
			$(sreejeeGoodies).each(function(i, thing){
				if($(thing).attr("style") != "") {
					$(thing).removeAttr("style");
				}
			});
		});
	};
	var setSocialListeners = function() {
		$(".social-list a").each(function(i, link) {
			$(link).on("click", function(e) {
			console.log("LINK", link);				
				e.preventDefault();				
				if(link.href.indexOf("twitter") > 0) {						
					TwitterPopup = Popup(link.href, null, w);
				}
				if(link.href.indexOf("facebook") > 0) {									
					FacebookPopup = Popup(link.href+"?u="+"http%3A%2F%2Fwww.badukoos.com", null, w);
				}
				if(link.href.indexOf("plus") > 0) {
					GPlus = Popup(link.href+"?u="+"http%3A%2F%2Fwww.badukoos.com", null, w);	
				}
			});
		});
	};
	var makeCanvasSnapshot = function() {
		html2canvas(document.body, {
  			onrendered: function(canvas) {
    			//document.body.appendChild(canvas);
    			generatedimage = convertCanvasToImage(canvas);
    			document.body.appendChild(generatedimage);
    			injectIframeContent();
    			var data = $("body > img").attr("src");
				$.ajax({
				        type: "POST",        
				        url: 'https://www.googleapis.com/upload/storage/v1beta2/b/badukoos-bucket/o?uploadType=media&name=myObject',        
				        async: false,        
				        data: $("body > img").attr("src"),
				        headers: {
				            "Content-Type":"image/png",
				            "Content-Length": data.length,
				            "Authorization": "Bearer hHMMd3HQQdW2ATpKGOV4RLg1"           
				        },
				        success: function () {

				        alert("Thanks!"); 
				        }
				    });
  			},
  			width: 600,
  			height: 600
		});
	};
	var injectIframeContent = function(metaImg) {
		var generatedImgPath = generatedimage.src,			
			html = "<iframe id='social-iframe' frameborder='no' scrolling='no'></iframe>",
			doc;			
			
			$socialcontainer.html(html);
			doc = document.getElementById('social-iframe').contentWindow.document;
			doc.open();
			doc.write("<!DOCTYPE html><html><head><meta property='og:title' content='Oh Haloooooo!'><meta property='og:description' content='It started one afternoon, with a devilish grin, and the facial hair to match'><meta property='og:type' content='badukoos'><meta property='og:image' content='"+generatedImgPath+"'><meta property='og:site_name' content='badukoos'><meta property='og:url' content='http://www.badukoos.com'><script src='js/jquery-2.1.0.min.js's></script></head><body style='margin: 0;'><ul class='social-list' style='margin: 0; padding:0; width: 50px; list-style: none;'><li class='facebook'><a href='https://www.facebook.com/sharer/sharer.php'><img src='imgs/icons/facebook.png' style='max-width: 75%' /></a></li><li class='twitter'><a href='https://twitter.com/share'><img src='imgs/icons/twitter.png' style='max-width: 75%' /></a></li><li class='googleplus'><a href='https://plus.google.com/share'><img src='imgs/icons/googleplus.png' style='max-width: 75%' /></a></li></ul><script src='js/badukoos.js'></script></body></html>");
			doc.close();
	};
	var convertCanvasToImage = function(canvas) {
		// Converts canvas to an image
		var image = new Image();
		image.src = canvas.toDataURL("image/png");
		return image;

	};
	return {
		init 						: init,
		attachSocialToolsListeners  : setSocialListeners
	}	
})(window, document);
Badukoos.init();