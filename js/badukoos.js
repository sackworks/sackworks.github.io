var Popup = function(url, size, w) {
	return w.open(url, 'popup', "width=500,menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes"); 
};
var Badukoos = (function(w, d) {
	
	var triggies = [],
		sreejeeGoodies = ["#moe", "#devil"],
		moveGoodie = function(e){
			$(e.data).css("margin", 0);								
    		$(e.data).css({left:e.pageX, top:e.pageY});			
		};		
	
	
	$("#sreej").on('click', function(e){
		$(e.target).css("transform", "translateX(10)");
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
	
	$(".social a").each(function(i, link) {
		$(link).on("click", function(e) {
			
			e.preventDefault();
			w.open(link.href, 'popup', "width=500,height=500,scrollbars=yes,status=yes"); 
			if(link.href.indexOf("twitter") > 0) {						
				TwitterPopup = Popup(link.href, null, w);
			}
			if(link.href.indexOf("facebook") > 0) {									
				FacebookPopup = Popup(link.href+"?u="+"http%3A%2F%2Fwww.badukoos.com", null, w);
			}
		});
	});
	

})(window, document);
