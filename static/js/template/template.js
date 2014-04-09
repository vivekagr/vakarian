$(function () {

    var navSidebarLi = $(".nav-sidebar > li");

    navSidebarLi.each(function() {
        var el = $(this);

        // Adding 'dropdown' class to list items with children
        if (el.children("ul").length > 0) {
            el.addClass("dropdown");
        }

        // Display the default active item
        if (el.hasClass('active')) {
            el.find('ul').show();
        }
    });

    // Closing the collapsed sub-menu when clicking outside of it
    // We are binding this over the entire html tag and are preventing the trigger
    // from undesired areas (such as sub-menu itself) by using `stopPropagation`
    // method on the event.
    $('html').click(function() {
        if ($(".sidebar-slim")[0])
            $(".nav-sidebar > li.dropdown.active").removeClass('active').children("ul").hide();
    });

    // Showing and collapsing the children
    $(".nav-sidebar > li.dropdown > a").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var parent = $(this).parent("li"),
            sidebarSlim = $(".sidebar-slim"),
            dropdownSubList = $(".nav-sidebar > li.dropdown").children("ul");
        sidebarSlim[0] ? dropdownSubList.hide() : dropdownSubList.slideUp(150);
        if (parent.hasClass("active")) {
            parent.removeClass("active");
        } else {
            navSidebarLi.removeClass("active");
            parent.addClass("active");
            sidebarSlim[0] ? parent.children("ul").show() : parent.children("ul").slideDown(150);
        }
    });

    // Preventing the collapsed sub-menu from being closed while clicking it
    $(".nav-sidebar > li.dropdown > ul").click(function(e) {
        e.stopPropagation();
    });

    // Sidebar size toggle
    $("#sidebarNavToggle").on('click', function() {
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

        // Triggering windows resize event so that widgets like charts
        // can re-render themselves according to their new container size
        $(window).trigger('resize');

    });

    // Focusing the search field if empty form is submitted by mistake
    $('#navbarSearchForm').submit(function(e) {
        var inputEl = $(this).find('input');
        if (!inputEl.val()) {
            e.preventDefault();
            inputEl.focus();
        }
    });

    // Control the size of widget info section
    $(".widget-info-fixed-size").find(".expand").click(function() {
        var parent = $(this).parent();
        parent.toggleClass('open', 300);
        if (parent.hasClass('open')) {
            $(this).html('Expand');
        } else {
            $(this).html('Show Less');
        }
    });

});
