$(document).ready(function() {
    var navSidebarLi = $(".nav-sidebar > li");
    navSidebarLi.each(function() {
        var el = $(this);
        if (el.children("ul").length > 0) {
            el.addClass("dropdown");
        }
    });
    $(".nav-sidebar > li.dropdown > a").on('click', function() {
        console.log('hey');
        var el = $(this).parent("li");
        if (el.hasClass("active")) {
            el.removeClass("active");
        } else {
            navSidebarLi.removeClass("active", 1000);
            el.addClass("active");
        }
    });
});
