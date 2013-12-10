(function($) {
//    去除no-js类名，js运行成功
//    $('html').removeClass('no-js');


    var $links = $('a[href^=http]');

    $links.on('click', function() {
        window.open($(this).attr('href'));
        event.preventDefault();
    });



})(jQuery);