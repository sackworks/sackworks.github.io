window.URL = window.URL || window.webkitURL;
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
	$shareEl = $("#share").length > 0 ? $("#share") : null;	

	var moveGoodie = function(e){
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
		Attach all behaviors 
	**/	
	var setListeners = function() {		
		$(sreejeeGoodies).each(function(i, thing){		
			triggies.push(false);
			$(thing).on("click", function(e) {
				if(!triggies[i]) {
					$(d).bind('mousemove', thing, moveGoodie);
				} else {					
					$(d).unbind('mousemove', moveGoodie);
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
		$(".js-buttons-for-save-share").on("click", "button", function(e){
			e.preventDefault();
			$(e.target).index() === 0 ? makeCanvasSnapshot() : sharePanel(e); 
		});
		$("#fileElem").on("change", this.files, function(event) { setFileObjectURL(createURLFromFileObject(event)); });
	};
	var saveAs = function(data) {
		console.log("saveAs::", data);		                                        
        document.location.href = data;        
	};
	var sharePanel = function(e) {
		console.log("sharePanel::", e);
		triggerChangeOnFileObject(e);
		//setFileObjectURL(createURLFromFileObject(event));
		openShare(getFileObjectUrl());		
	};
	/**
	**/
	var setSocialListeners = function() {
		debugger;
		console.log(w);
		$(".social-list a").each(function(i, link) {
			$(link).on("click", function(e) {
			console.log("LINK", link);				
				e.preventDefault();				
				if(link.href.indexOf("twitter") > 0) {						
					TwitterPopup = Popup(link.href, null, w);
				}
				if(link.href.indexOf("facebook") > 0) {
					//FacebookPopup = Popup(link.href+"?u="+"http%3A%2F%2Fwww.badukoos.com", null, w);
					//console.log(w);
					FB.ui(
					  {
					    method: 'feed',
					    name: 'Facebook Dialogs',
					    link: 'https://developers.facebook.com/docs/dialogs/',
					    picture: getFileObjectUrl(),
					    caption: 'Reference Documentation',
					    description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
					  },
					  function(response) {
					    if (response && response.post_id) {
					      alert('Post was published.');
					    } else {
					      alert('Post was not published.');
					    }
					  }
					);

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
				saveAs(convertCanvasToData(canvas));
  			},
  			width: 1500,
  			height: 1500
		});		
	};
	var getShareElement = function(el) {
		if($(el).length > 0) {
			return $(el);
		} else {
			setTimeout(getShareElement("#share"), 100);
		}
	};
	var injectIframeContent = function(metaImgSrc, injectEl) {		
		var	html = "<iframe id='social-iframe' frameborder='no' scrolling='no'></iframe>",
		doc;			
		injectEl.append(html);
		doc = document.getElementById('social-iframe').contentWindow.document;
		doc.open();
		doc.write("<!DOCTYPE html><html><head><meta property='og:title' content='Oh Haloooooo!'><meta property='og:description' content='It started one afternoon, with a devilish grin, and the facial hair to match'><meta property='og:type' content='badukoos'><meta property='og:image' content='"+metaImgSrc+"'><meta property='og:site_name' content='badukoos'><meta property='og:url' content='http://www.badukoos.com'><script src='js/jquery-2.1.0.min.js'></script></head><body style='margin: 0;'><ul class='social-list' style='list-style: none; margin: 0; padding: 0;'><li class='facebook' style='display: inline-block'><a href='https://www.facebook.com/sharer/sharer.php'><img src='imgs/icons/facebook.png' style='max-width: 75%' /></a></li><li class='twitter' style='display: inline-block'><a href='https://twitter.com/share'><img src='imgs/icons/twitter.png' style='max-width: 75%' /></a></li><li class='googleplus' style='display: inline-block'><a href='https://plus.google.com/share'><img src='imgs/icons/googleplus.png' style='max-width: 75%' /></a></li></ul><script src='js/badukoos.js'></script></body></html>");
		doc.close();
	};
	var convertCanvasToImage = function(canvas) {
		// Converts canvas to an image
		var image = new Image(),
		imageUrl = canvas.toDataURL("image/png");		
		image.src = imageUrl;

		return image;

	};
	var convertCanvasToData = function(canvas) {		
		// Converts canvas data		
		var imageData = canvas.toDataURL("image/png");
		
		imageData = imageData.replace("image/png", "image/octet-stream");		
		console.log("convertCanvasToData::", imageData);
		return imageData;				

	};
	var triggerChangeOnFileObject = function(e) {
		var fileElem = $("#fileElem");		
  		if (fileElem) {
    		fileElem.click();
    		console.log("triggerChangeOnFileObject::", fileElem);
  		}  				
	};
	var createURLFromFileObject = function(event) {		
		console.log("createURLFromFileObject::", arguments);
		if(event.target.files) {
			var imgs = [], files = event.target.files;
			for (var i = 0; i < files.length; i++) {
				imgs[0] = document.createElement("img");
	      		imgs[0].src = window.URL.createObjectURL(files[i]);      		
	      		imgs[0].onload = function(event) {
	        		window.URL.revokeObjectURL(this.src);
	      		}	
			}	
		} else {
			throw Error("Sorry Badukoos, but you must provide a file to share");
		}		
		console.log("createURLFromFileObject::", imgs);
		console.log("createURLFromFileObject::", files);		
		return imgs[0].src;
	};
	var setFileObjectURL = function(value) {
		console.log("setFileObjectURL::", arguments);		
		this.fileObjectUrl = value;
	};
	var getFileObjectUrl = function() {		
		return this.fileObjectUrl;
	};
	var openShare = function(url) {
		
		//injectIframeContent(url, $shareEl);
		$shareEl.show();
		
	};	

	this.fileObjectUrl = null;
	return {
		init 						: init,
		attachSocialToolsListeners  : setSocialListeners
	}	
})(window, document);
setTimeout(Badukoos.init, 1000);