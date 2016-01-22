  $(document).ready(function(){
        $('body').plusAnchor({
            easing: 'easeInOutQuart',      // String: Anything other than "swing" or "linear" requires the easing.js plugin
            offsetTop: -20,       // Int: Top offset for anchor scrollto position. Can be positive or negative
            speed: 500,          // Int: The speed, in miliseconds, it takes to complete a slide
            onInit: null,         // Function: Callback function on plugin initialize
            onSlide: null,        // Function: Callback function that runs just before the page starts animating
            performance: true    // Boolean: Toggles between click and delegate events.
        });
        if ( ($(window).height() + 100) < $(document).height() ) {
            $('#top-link-block').removeClass('hidden').affix({
                // how far to scroll down before link "slides" into view
                offset: {top:100}
            });
        }
  });