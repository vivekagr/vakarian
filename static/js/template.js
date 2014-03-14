$(document).ready(function() {
    var navSidebarLi = $(".nav-sidebar > li");
    // Adding 'dropdown' class to list items with children
    navSidebarLi.each(function() {
        var el = $(this);
        if (el.children("ul").length > 0) {
            el.addClass("dropdown");
        }
    });
    // Showing and collapsing the children
    $(".nav-sidebar > li.dropdown > a").on('click', function(e) {
        e.preventDefault();
        var parent = $(this).parent("li");
        $(".nav-sidebar > li.dropdown").children("ul").slideUp(150);
        if (parent.hasClass("active")) {
            parent.removeClass("active");
        } else {
            navSidebarLi.removeClass("active");
            parent.addClass("active");
            parent.children("ul").slideDown(150);
        }
    });
});
