$(function () {

    /*
        Animates a an element with animate.css classes.
        First adds the class as required by animate.css
        and then removes them so that they can be animated
        again in the future.

        Expects:
            el:         jQuery node object
            animation:  animate.css effect class
            callback:   callback function

        Callback is called when the animation is finished.
    */
    function animateEl(el, animation, callback) {
        el.addClass("animated " + animation);
        el.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            el.removeClass("animated " + animation);

            if (typeof(callback) == "function")
                callback();
        });
    }


    /*
        Animates all the dropdown menu within the provided selector.

        Animation is done with the help of animate.css classes
     */
    function animateDropdownMenu(selector) {
        // Listen for dropdown show event
        // and add animation class to it when shown
        $(selector).on('show.bs.dropdown', function (el) {
            $(el.target).find('ul.dropdown-menu').addClass('animated flipInY');
        });
    }


    /*
        Animates all the quickstat widgets with class `.quick-stat-widget`.

        The icon is bounced in from the left of the screen and numbers are
        rotated with odometer.
     */
    function animateQuickstatWidget() {
        $('.widget-odometer').each(function(i, el) {
            // Not animating on mobile/tablets due to performance concerns
            if (!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {

                // Roll the numbers with Odometer
                var od = new Odometer({
                    el: el,
                    value: 0,
                    format: $(el).data('format')
                });
                od.update($(el).data('value'));

                // Bounce in the icon from the left
                $('.quick-stat-widget').find('.icon-area i').addClass('animated bounceInLeft');

            } else {
                $(el).text(($(el).data('value')));
            }
        });
    }

    // Animating dropdow menus in top bar
    animateDropdownMenu('.topbar');

    animateQuickstatWidget();

    /*** Setup the profile popover ***/

    var sidebarProfile = $('.sidebar-profile');

    sidebarProfile.popover({
        html: true,
        content: function() {
            return $('.sidebar-profile-wrapper').find('.popover-content').html();
        },
        title: function() {
            return $('.sidebar-profile-wrapper').find('.popover-title').html();
        }
    });

    // Setting `overflow-y` of sidebar to `visible` when profile popover
    // is open. Without it, popover would be essentially hidden from the view.
    // But as a result of this, sidebar cannot be scrolled when popover is open.
    sidebarProfile.on('show.bs.popover', function() {
        $('.sidebar').css('overflow-y', 'visible');
    });

    // Changing back the `overflow-y` property back to `scroll` when popover
    // is closed so that sidebar content is scrollable.
    sidebarProfile.on('hidden.bs.popover', function() {
        $('.sidebar').css('overflow-y', 'scroll');
    });


    /*** Setup sidebar navigation menu ***/

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

    // Show the sidebar when the nav menu has been setup above
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
        sidebarSlim[0] ? dropdownSubList.hide() : dropdownSubList.slideUp(250);
        if (parent.hasClass("active")) {
            parent.removeClass("active");
        } else {
            navSidebarLi.removeClass("active");
            parent.addClass("active");
            sidebarSlim[0] ? parent.children("ul").show() : parent.children("ul").slideDown(250);
        }
    });

    // Preventing the collapsed sub-menu from being closed while clicking it
    $(".nav-sidebar > li.dropdown > ul").click(function(e) {
        e.stopPropagation();
    });


    /*** Setup sidebar size toggle features. ***/

    // Expand Sidebar Navigation
    function expandSidebarNav() {
        var sidebarEl = $(".sidebar"),
            pageWrapperEl = $(".page-wrapper");

        // If sidebar nav is already expanded, do nothing
        if (!sidebarEl.hasClass("sidebar-slim-width"))
            return;

        sidebarEl.removeClass("sidebar-slim-width", 250, function() {
            pageWrapperEl.removeClass("with-sidebar-slim");
            sidebarEl.removeClass("sidebar-slim", 250);
            animateEl(sidebarEl.find('.nav.nav-sidebar'), 'fadeInLeft');
        });
    }

    // Contract Sidebar Navigation
    function contractSidebarNav() {
        var sidebarEl = $(".sidebar"),
            pageWrapperEl = $(".page-wrapper");

        // If sidebar nav is already contracted, do nothing
        if (sidebarEl.hasClass("sidebar-slim-width"))
            return;

        animateEl(sidebarEl.find('.nav.nav-sidebar'), 'fadeInLeft');

        sidebarEl.addClass("sidebar-slim", 250, function() {
            pageWrapperEl.addClass("with-sidebar-slim");
            sidebarEl.addClass("sidebar-slim-width", 250);
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


    /*** Setup miscellaneous features ***/

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
