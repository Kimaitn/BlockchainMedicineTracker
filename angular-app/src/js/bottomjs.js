function  toload(){
	$(window).on('load',function(){
		height = $(window).height()-130-100;
		$('.fullsize').height(height+"px");
		
		bheight = height/2 - $('#bannertext').height()/2;
		$('#bannertext').css("margin-top", bheight+"px");
		
		var boxes = $('#holdboxes div div');
		var maxheight = 0;
		for(var i = 0; i<boxes.length; i++){
			maxheight = $(boxes[i]).height()>maxheight?$(boxes[i]).height():maxheight;
		}
		maxheight += 40;
		$('#holdboxes div div').height(maxheight+"px"); 
		
		height = $(window).height()-130;
		$('.fullsize').height(height+"px");
		
		bheight = height/2 - $('#signin').height()/2;
		$('#signin').css("margin-top", bheight+"px");
		
		$('#signinleft').height($('#signinform').height());
		

		AOS.init();
	});
}

toload();