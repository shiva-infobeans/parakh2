/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmodel', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtabs', 'ojs/ojfilmstrip', 'ojs/ojpagingcontrol'
], function (oj, ko, $) {
    
    function loginContentViewModel(){
    	var self = this;
    	self.video_image = ko.observable("");
    	self.video_image("../../images/video.jpg");
    	self.openVideo = function(){
    		$("#modalVideo").ojDialog("open"); 
		    var video = '<video class="video" id="parakh_video" controls="" loop="" ><source type="video/ogg" src="Parakh_Teaser.mp4"><source type="video/mp4" src="Parakh_Teaser.mp4"><object  type="application/x-shockwave-flash" data="Parakh_Teaser.mp4" wmode="transparent"><param name="movie" value="Parakh_Teaser.mp4"><param name="wmode" value="transparent"><param name="autostart" value="false"></object></video>';
            $('.oj-dialog-body').html(video);
            
    	}

    	$(function(){
            var bg = $('#login-background').css('background-image');
            bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
            if(bg==document.location.href+'images/parakh.jpg')
            {
                $('#top-image').show();
                $('#bottom-image').hide();
            }else if(bg==document.location.href+'images/parakh2.jpg')
            {
                $('#top-image').hide();
                $('#bottom-image').show();
            }
        })
    }

    return loginContentViewModel;
});

