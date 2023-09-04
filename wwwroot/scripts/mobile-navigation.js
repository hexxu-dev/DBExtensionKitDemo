jQuery(function($) {
    "use strict";
    $(document).on('click', '.nav-toggle', function(){
      $(this).toggleClass('on');
      $('html').toggleClass('nav-on');
    });
 });