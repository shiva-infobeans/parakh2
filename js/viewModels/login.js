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
    	
    	self.openVideo = function(){
    		$("#modalVideo").ojDialog("open"); 
    	}
        self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable('(min-width: 767px)');

        if(self.large())
        {
            self.video_image("../../images/video.jpg");
        }else
        {
            self.video_image("../../images/video-icon.png");
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

