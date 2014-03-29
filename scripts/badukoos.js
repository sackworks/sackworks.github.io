window.URL = window.URL || window.webkitURL;
var Popup = function(url, size, w) {	
	return w.open(url, 'popup', "width=500,height=500,menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,status=yes"); 
};
var Badukoos = (function(w, d) {

	//private methods, members
	var init = function () {
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
		$(".js-buttons-for-save-share").on("click", "button", function(e){
			e.preventDefault();
			sharePanel(e); 
		});	
	};
	/**
		Reveal Share 
	**/	
	var sharePanel = function(e) {
		console.log("sharePanel::", e);			
		openShare();		
	};
	
	/**
		Attach Social Tools listener
	**/
	var setSocialListeners = function() {		
		
		$(".social-list a").each(function(i, link) {
			$(link).on("click", function(e) {			
				e.preventDefault();				
				if(link.href.indexOf("twitter") > 0) {						
					TwitterPopup = Popup(link.href, null, w);
				}
				if(link.href.indexOf("facebook") > 0) {					
					//FacebookPopup = Popup(link.href+"?u="+"http%3A%2F%2Fwww.badukoos.com", null, w);
					console.log("setSocialListeners::", this.image);
					FB.ui(
					  {
					    method: 'feed',
					    name: 'Facebook Dialogs',
					    link: 'https://developers.facebook.com/docs/dialogs/',
					    picture: 'http://ancient-lake-9185.herokuapp.com/assets',
					    caption: 'Reference Documentation',
					    description: 'testing'
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
	/**
		Method which uses html2canvas api to snapshot the DOM
	**/	
	var makeCanvasSnapshot = function() {				
		html2canvas(document.body, {
  			onrendered: function(canvas) {
  				convertCanvasToImage(canvas);				
  			},
  			width: 1500,
  			height: 1500
		});		

	};
	/**
		Takes a canvas object and converts it to a data URI
	**/	
	var convertCanvasToImage = function(canvas) {
		// Converts canvas to an image
		var image = new Image(),
		imageData = canvas.toDataURL("image/png");
		postDataUrlImageToServer({name: "image", value: imageData});	
		
	};
	/**
		post the new data uri (png) to the heroku server
	**/	
	var postDataUrlImageToServer = function(data) {
		$.ajax({
			url: 'http://ancient-lake-9185.herokuapp.com/',
			type: "POST",
			crossDomain: true,
			data: data, 
			success: function(data) {				
				this.image = $.ajax({
					url: 'http://ancient-lake-9185.herokuapp.com/assets',
					type: "GET",
					crossDomain: true,			
					success: function(data) {			
						return data.responseText;
					},
					error : function(e) {
						console.log(e);
						return null;
					}
				});		
			},
			error : function(e) {
				console.log(e);
			}
		});
	};

	var openShare = function() {				
		$shareEl.show();		
	};			
	return {
		init 						: init,
		attachSocialToolsListeners  : setSocialListeners
	}	
})(window, document);
setTimeout(Badukoos.init, 1000);