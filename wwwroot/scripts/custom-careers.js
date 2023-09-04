// Mobile togler for job filers

jQuery(function($) { 
    $(".omni-filter-toggle").click(function(e){
        e.preventDefault();
        $(".omni-filter-items").slideToggle("slow");
      });
 });

// Mobile navigation
jQuery(function($) {
    $(document).on('click', '.nav-toggle', function(){
      $(this).toggleClass('on');
      $('html').toggleClass('nav-on');
    });
 });