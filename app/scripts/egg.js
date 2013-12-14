(function() {
    if (!window.console) return;

    var logo = location.origin + '/images/logo.png';
    var styles = [
        "background-image: url('" + logo + "')",
        'background-repeat: no-repeat',
        'font-size: 30px'
    ].join(';');
    console.log('%c   ', styles);
    console.log('一个人在看代码？不如和我们一起写代码吧！');
    console.log('发邮件给我们： vtmerhome@gmail.com / bcxxxxx+console@gmail.com');
    console.log('http://hr.vtmer.com');
})();
