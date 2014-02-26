var Popup = function(url, size, w) {
	return w.open(url, 'popup', "width=500,height=500,menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,status=yes"); 
};
var Badukoos = (function(w, d) {
	//private methods, members
	var init = function () {
		setListeners();
		bobbleHead();
	},
	triggies = [],
	sreejeeGoodies = ["#moe", "#devil", "#smooth"],
	moveGoodie = function(e){
		$(e.data).css("margin", 0);								
		$(e.data).css({left:e.pageX, top:e.pageY});			
	};
	/**
		Shake the sreejee
	**/			
	var bobbleHead = function() {
		$("#sreej").on('mousedown', function(e){
			$(e.target).removeClass("off").addClass("on");
		});
		$("#sreej").on('mouseup', function(e){
			$(e.target).removeClass("on").addClass("off");
			setTimeout(function() {$(e.target).removeClass("off").removeClass("on");}, 100);
		});			
	};
	/**
		Attach all behaviors for moes
	**/	
	var setListeners = function() {
		$(".social a").each(function(i, link) {
			$(link).on("click", function(e) {				
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
	};
	return {
		init : init
	}	
})(window, document);
Badukoos.init();