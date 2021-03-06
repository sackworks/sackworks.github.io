window.URL = window.URL || window.webkitURL;
var Popup = function(url, size, w) {	
	return w.open(url, 'popup', "width=500,height=500,menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,status=yes"); 
};
var Badukoos = (function(w, d) {

	//private methods, members
	var triggies = [],
		sreejeeGoodies = ["#moe", "#wwmoe", "#devil", "#smooth"],
		sreejHead = "#sreej",
		$socialcontainer = $(".social"),
		$shareEl = $("#share").length > 0 ? $("#share") : null,
	
	init = function () {
		//setHeights(".sreejithhead, .sreejith-goodies");
		setListeners();
		setSocialListeners();
		bobbleHead("oops");		
	};	

	var moveGoodie = function(e){
		$(e.data).css("margin", 0);								
		$(e.data).css({left:e.pageX, top:e.pageY});			
	};	
	/**
		Shake the sreejee
	**/			
	var bobbleHead = function(type, auto) {		
		var $sreejHead = $(sreejHead);
		if(auto) {

			// don't set a handler, just bobble the head and put it back in place
			document.getElementById(type).play();
			return;
		}					
		$sreejHead.on('mousedown', function(e){			
			$(e.target).removeClass("off").addClass("on");
			document.getElementById(type).play();
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
		$("#moe, #wwmoe, #devil, #smooth").draggable();
		$(sreejHead).droppable({
			drop: function(e) {
				var random = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				console.log(e.toElement);
		    	makeCanvasSnapshot();		    	
				if($(e.toElement).attr("id").indexOf("devil") !== -1) { 						
				 	bobbleHead("yeah", true) 
				 } else {						
					bobbleHead("no"+random, true);
				}
		  }
		});		
		$(w).on("resize", function() {	
			$(sreejeeGoodies).each(function(i, thing){
				if($(thing).attr("style") != "") {
					$(thing).removeAttr("style");
				}
			});
			//setHeights();
		});
		$(".js-buttons-for-save-share").on("click", "button", function(e){
			e.preventDefault();
			sharePanel(e); 
		});
		$(".sreejithhead, .sreejith-goodies").on("click", function() {			
			$shareEl.blur();
		});
		$shareEl.on("blur", function() {			
			$shareEl.hide();		
		});
	};
	/**
		Set Heights for both buckets
	**/
	var setHeights = function(buckets) {
		$(buckets).height($(w).height());
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
				var badukoosCacheBuster = "?"+Math.floor(Math.random()*1000000);
				e.preventDefault();				
				if(link.href.indexOf("twitter") > 0) {						
					TwitterPopup = Popup(link.href, null, w);
				}
				if(link.href.indexOf("facebook") > 0) {					
					//FacebookPopup = Popup(link.href+"?u="+"http%3A%2F%2Fwww.badukoos.com", null, w);
					console.log("setSocialListeners::", badukoosCacheBuster);
					FB.ui(
					  {
					    method: 'feed',
					    name: 'Choose A Beard for Sreejith',
					    link: 'http://www.badukoos.com',
					    picture: 'http://ancient-lake-9185.herokuapp.com/assets'+badukoosCacheBuster,
					    caption: 'Hi-eee! Will you help me dress my chin for spring?',
					    description: 'Sreejith cannot decide on a moe. Will you help him?'
					  },
					  function(response) {
					    if (response && response.post_id) {
					      return;
					    } else {
					      throw Error('Sorry, Post was not published. Please try again later');
					    }
					  }
					);

				}
				if(link.href.indexOf("plus") > 0) {					
					GPlus = Popup(link.href+"?url="+"http%3A%2F%2Fwww.badukoos.com", null, w);	
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
  			width: 600,
  			height: 500
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
		$shareEl.focus();
	};

	return {
		init 						: init,
		attachSocialToolsListeners  : setSocialListeners
	}	
})(window, document);
setTimeout(Badukoos.init, 1000);