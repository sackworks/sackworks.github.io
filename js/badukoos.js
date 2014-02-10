var Badukoos = (function(w, d) {
	
	var triggies = [],
		sreejeeGoodies = ["#moe", "#devil"],
		moveGoodie = function(e){
			$(e.data).css("margin", 0);								
    		$(e.data).css({left:e.pageX, top:e.pageY});			
		};		
		
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
		
})(window, document);