/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * achievementsPage module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojmodel', 'ojs/ojinputtext', 'ojs/ojtabs', 'ojs/ojconveyorbelt', 'ojs/ojdialog', 'ojs/ojknockout', 'promise', 'ojs/ojlistview'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function resize() {
        $('a[href*="#"]:not([href="#"])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 500);
                    return false;
                }
            }
        });
    }

    function achievementsPageContentViewModel(person) {
        var self = this;
        var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(
                oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);

        self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable('(min-width: 767px)');

        self.itemOnly = function (context)
        {
            return context['leaf'];
        }


        $(document).ready(function () {
            resize();
            $(window).resize(resize);
        });





    }

    return achievementsPageContentViewModel;
});
