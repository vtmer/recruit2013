!function(a){a(window).ready(function(){a("html").removeClass("no-js")}),a(function(){var b=a("a[href^=http]"),c=a("ul.nav a"),d=a("ul.figure a");b.on("click",function(b){window.open(a(this).attr("href")),b.preventDefault()}),c.on("click",function(b){if(a("html, body").is(":animated"))return!1;var d=a(this),e=a(d.attr("href"));c.filter(".active").removeClass("active"),d.addClass("active"),e.goTop(600),b.preventDefault()}).filter(".active").triggerHandler("click"),a("body").mousewheel(function(b){var d,e=c.filter(".active"),f=c.index(e),g=(f+1)%6,h=0==f?5:(f-1)%6;a(".nav:visible").length&&(d=b.wheelDelta>0?c.eq(h):c.eq(g),d.triggerHandler("click"),b.preventDefault())}),d.on("click",function(b){var d=a(this),e=d.attr("href"),f=c.filter("[href="+e+"]");f.triggerHandler("click"),b.preventDefault()}),a(window).on("resize",function(){c.filter(".active").triggerHandler("click")})})}(jQuery);