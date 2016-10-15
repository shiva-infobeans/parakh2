/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * floating module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojselectcombobox'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function floatingContentViewModel() {
        var self = this;

        this.value = ko.observable("");
        self.clickedButton = ko.observable("(None clicked yet)");
        self.buttonClick = function (data, event) {
            self.clickedButton(event.currentTarget.id);
            console.log("CLICKED");
        //validations for modal search field and textbox field
            var searchFieldd = document.getElementById("search_field");
            var text = document.getElementById("text");
            var flag = 0;
            if (searchFieldd.value == "" || !(searchFieldd.value.match(/^[a-zA-Z]+$/)))
            {
                document.getElementById("error1").innerHTML = "This field cannot be empty!";
                flag = 1;
                searchFieldd.focus();
                return false;
            } else {
                if (text.value == "")
                {
                    document.getElementById("error1").innerHTML = "";
                    document.getElementById("error2").innerHTML = "This field cannot be empty!";
                    flag = 1;
                    text.focus();
                    return false;
                }
                else{
                    
                    document.getElementById("error2").innerHTML = "";
                }
            }

        }
        this.tags = ko.observableArray([
            {value: ".net", label: ".net"},
            {value: "Accounting", label: "Accounting"},
            {value: "ADE", label: "ADE"},
            {value: "Adf", label: "Adf"},
            {value: "Adfc", label: "Adfc"},
            {value: "Adfm", label: "Adfm"},
            {value: "Android", label: "Android"},
            {value: "Aria", label: "Aria"},
            {value: "C", label: "C"},
            {value: "C#", label: "C#"},
            {value: "C++", label: "C++"},
            {value: "Chrome", label: "Chrome"},
            {value: "Cloud", label: "Cloud"},
            {value: "CSS3", label: "CSS3"},
            {value: "DBA", label: "DBA"},
            {value: "Eclipse", label: "Eclipse"},
            {value: "Firefox", label: "Firefox"},
            {value: "Git", label: "Git"},
            {value: "Hibernate", label: "Hibernate"},
            {value: "HTML", label: "HTML"},
            {value: "HTML5", label: "HTML5"},
            {value: "IE", label: "IE"},
            {value: "IOS", label: "IOS"},
            {value: "Java", label: "Java"},
            {value: "Javascript", label: "Javascript"},
            {value: "JDeveloper", label: "JDeveloper"},
            {value: "Jet", label: "jet"},
            {value: "JQuery", label: "JQuery"},
            {value: "JQueryUI", label: "JQueryUI"},
            {value: "JS", label: "JS"},
            {value: "Knockout", label: "Knockout"},
            {value: "MAF", label: "MAF"},
            {value: "Maven", label: "Maven"},
            {value: "MCS", label: "MCS"},
            {value: "MySql", label: "MySql"},
            {value: "Netbeans", label: "Netbeans"},
            {value: "Oracle", label: "Oracle"},
            {value: "Solaris", label: "solaris"},
            {value: "Spring", label: "spring"},
            {value: "Svn", label: "Svn"},
            {value: "UX", label: "UX"},
            {value: "xhtml", label: "xhtml"},
            {value: "XML", label: "XML"}
        ]);
        this.keyword = ko.observableArray();

    }
    $(function () {

        $('body').on('click', '.btn-float', function (event) {
            event.preventDefault();
            var ele = $(this);
            $(this).parent().addClass('open');
            setTimeout(function () {
                ele.parent().siblings().fadeIn();
                setTimeout(function () {
                    ele.parent().removeClass('open');
                }, 500)
            }, 600);
        });
        $('body').on('click', '.close', function (event) {
            event.preventDefault();
            $("#overlay").fadeOut();
        });
    });

    //autocomplete//
// $( function() {
//    var availableTags = [
//      "ActionScript",
//      "AppleScript",
//      "Asp",
//      "BASIC",
//      "C",
//      "C++",
//      "Clojure",
//      "COBOL",
//      "ColdFusion",
//      "Erlang",
//      "Fortran",
//      "Groovy",
//      "Haskell",
//      "Java",
//      "JavaScript",
//      "Lisp",
//      "Perl",
//      "PHP",
//      "Python",
//      "Ruby",
//      "Scala",
//      "Scheme"
//    ];
//    $( "#tags" ).autocomplete({
//     
//    });
//  } );
//    




    return floatingContentViewModel;
});
