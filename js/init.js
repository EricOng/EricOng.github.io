
Number.prototype.mod = function(n) {
            return ((this%n)+n)%n;
        };

function init() {
    $("#darrow #icon-darrow").hide();
    $("#more").hover(function() {
        $("#darrow #icon-darrow").show();
    }, function() {
        $("#darrow #icon-darrow").hide();
    });
};

(function($) {
    
    window.onresize =function() {
      if(this.outerWidth < 880){
          $("#dev").removeClass("undline");
          $("#icon_cc").hide();
          $("#icon_ct").hide();
          $("#resume-arrow").hide();
      }
      else{
          $("#dev").addClass("undline");
          $("#icon_ct").show();
          $("#icon_cc").show();
          $("#resume-arrow").show();
      }
    };
    
    /*
     * Credit to Drew Baker
     * src: http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement  
     *
     *
     * Replace all SVG images with inline SVG
     */
     $('img.svg').each(function(){
        var img = $(this);
        var imgID = img.attr('id');
        var imgClass = img.attr('class');
        var imgURL = img.attr('src');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                svg = svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                svg = svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            svg = svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            img.replaceWith(svg);

         }, 'xml');
     });
    
    /*
     * Auto-scroll to sections.
     */
    var home, rec, cont, projects, darrow, books, games, anim;
    home = $(".btn-home");
    rec = $(".btn-rec");
    cont = $(".btn-cont");
    projects = $(".btn-proj");
    darrow = $("#darrow");
    books = $("#b");
    games = $("#g");
    anim = $("#a");
    
    home.click(function(){
        $("#about").goTo();
    });
    rec.click(function(){
        $("#sec1").goTo();
    });
    projects.click(function(){
        $("#h_projects").goTo();
    });
    cont.click(function(){
        $("#contact").goTo();
    });
    darrow.click(function(){
        $("#sec1").goTo();
    });
    books.click(function(){
        $("#rec-info").goTo();
    });
    games.click(function(){
        $("#sec2").goTo();
    });
    anim.click(function(){
        $("#sec3").goTo();
    });
    (function() {
        $.fn.goTo = function() {
            $('html, body').animate({
                scrollTop: $(this).offset().top  + 'px'
            }, 'slow');
            return this; 
        }
    })();
    
})(jQuery);

