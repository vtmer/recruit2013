(function($) {

    // 当所有内容准备完毕才允许运行js
    $(window).load(function() {
        
        // 去除no-js类名，js运行成功
        $('html').removeClass('no-js');

        var $links = $('a[href^=http]'),
            $button = $('ul.nav a'),
            $figure = $('ul.figure a');

        $links.on('click', function(event) {
            window.open($(this).attr('href'));
            event.preventDefault();
        });

        $button
            .on('click', function(event) {
                if ($('html, body').is(':animated')) return false;
                var $this = $(this),
                    $targetElem = $($this.attr('href'));

                $button.filter('.active')
                    .removeClass('active');

                $this.addClass('active');

                // 跳转对应页面块
                $targetElem.goTop(600);

                event.preventDefault();
            })
            .filter('.active')
                .triggerHandler('click');

        $('body').mousewheel(function(event) {
            var $activeElem = $button.filter('.active'),
                index = $button.index($activeElem),
                nextIndex = (index + 1) % 6,
                lastIndex = index == 0 ? 5 : (index - 1) % 6,
                $targetElem;

            // 如果按钮存在的话，才触发事件
            if ($('.nav:visible').length) {
                if (event.wheelDelta > 0) {
                    $targetElem = $button.eq(lastIndex);
                } else {
                    $targetElem = $button.eq(nextIndex);
                }

                $targetElem.triggerHandler('click');

                event.preventDefault();
            }
        });

        $figure.on('click', function(event) {

            var $this = $(this),
                href = $this.attr('href'),
                $targetElem = $button.filter('[href=' + href + ']');

            $targetElem.triggerHandler('click');

            event.preventDefault();
        });

        $(window).on('resize', function() {

            // 如果按钮存在的话，才触发事件
            if ($('.nav:visible').length) {
                $button.filter('.active')
                    .triggerHandler('click');
            }
        });
    });

})(jQuery);