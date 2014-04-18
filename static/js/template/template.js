$(function () {

    $('.sidebar-profile-wrapper').popover();

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

    $('.sidebar').show();

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

    // Expand Sidebar Navigation
    function expandSidebarNav() {
        var sidebarEl = $(".sidebar"),
            pageWrapperEl = $(".page-wrapper");

        // If sidebar nav is already expanded, do nothing
        if (!sidebarEl.hasClass("sidebar-slim-width"))
            return;

        sidebarEl.removeClass("sidebar-slim-width", 150, function() {
            pageWrapperEl.removeClass("with-sidebar-slim", 150);
            sidebarEl.removeClass("sidebar-slim", 150);
        });
    }

    // Contract Sidebar Navigation
    function contractSidebarNav() {
        var sidebarEl = $(".sidebar"),
            pageWrapperEl = $(".page-wrapper");

        // If sidebar nav is already contracted, do nothing
        if (sidebarEl.hasClass("sidebar-slim-width"))
            return;

        sidebarEl.addClass("sidebar-slim", 150, function() {
            pageWrapperEl.addClass("with-sidebar-slim", 150);
            sidebarEl.addClass("sidebar-slim-width", 150);
        });
    }

    // Toggle sidebar size
    $("#sidebarNavToggle").on('click', function() {
        var sidebar = $(".sidebar");

        // Storing the knowledge that user manually toggled the size
        sidebar.data('manually-toggled', '1');

        if (sidebar.hasClass("sidebar-slim")) {
            expandSidebarNav();
        } else {
            contractSidebarNav();
        }

        // Triggering windows resize event so that widgets like charts
        // can re-render themselves according to their new container size
        $(window).trigger('resize');

    });

    // Toggle sidebar size according to window width
    function autoAdjustSidebarWidth() {
        var width = $(window).width(),
            manuallyToggled = $(".sidebar").data('manually-toggled');

        if (!manuallyToggled) {
            // If user didn't manually toggle the sidebar size
            // then automatically resize according to window width
            if (width > 800) {
                expandSidebarNav();
            } else {
                contractSidebarNav();
            }
        } else if (width < 800) {
            // Else if user did manually toggle the sidebar size,
            // contract it only when window size is too small
            contractSidebarNav();
        }
    }

    // Adjust sidebar size once on document load
    autoAdjustSidebarWidth();

    // Auto adjust sidebar size on window resize
    $(window).resize(autoAdjustSidebarWidth);

    // Focusing the search field if empty form being is submitted
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

    // Toggle documentation
    $('#docToggle').click(function() {
        var docEls = $('.widget-info'),
            btn    = $('#docToggle');
        if (docEls.is(':visible')) {
            docEls.slideUp();
            $('.expand').hide();
            btn.html('<i class="fa fa-eye"></i> Show Documentation');
        } else {
            docEls.slideDown();
            $('.expand').show();
            btn.html('<i class="fa fa-eye-slash"></i> Hide Documentation');
        }
    });

    // Trigger file upload dialon on clicking the button replacement
    $('.file-input-wrapper > .btn').click(function() {
        $(this).parent().find('input').trigger('click');
    });

    // Show the file name on selection
    $('.file-input-wrapper > input').change(function() {
        var vals = $(this).val(),
            filename = vals.length ? vals.split('\\').pop() : '';
        if ($('.file-input-wrapper > .file-name').length === 0) {
            $('.file-input-wrapper').append($('<div class="file-name">' + filename + '</div>'));
        } else {
            $('.file-input-wrapper > .file-name').html(filename);
        }
    });

    // Fade in the content wrapper
    $('.content-wrapper').fadeIn();

});
