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
    // Sidebar size toggle
    $(".sidebar-nav-toggle").on('click', function() {
        var sidebarEl = $(".sidebar"),
            wrapperEl = $(".wrapper");
        if (sidebarEl.hasClass("sidebar-slim")) {
            sidebarEl.removeClass("sidebar-slim-width", 150, function() {
                wrapperEl.removeClass("with-sidebar-slim", 150);
                sidebarEl.removeClass("sidebar-slim", 150);
            });
        } else {
            sidebarEl.addClass("sidebar-slim", 150, function() {
                wrapperEl.addClass("with-sidebar-slim", 150);
                sidebarEl.addClass("sidebar-slim-width", 150);
            });
        }

    });
});
