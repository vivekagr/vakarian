/*
    Simple jQuery plugin for animating an element with
    animate.css classes. First adds the class as required
    by animate.css and then removes them so that they
    can be animated again in the future.

    Params:
        animation:  animate.css effect class
        callback:   callback function

    callback is called when the animation is finished.

    Example:

    $('.sidebar').animate('bounce');
    $('.notification-icon').animate('flash', function() {
        console.log('animation done');
    });
*/
(function($) {
    $.fn.animateCss = function(animation, callback) {
        var that = this;
        this.addClass('animated ' + animation);
        this.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            that.removeClass("animated " + animation);

            if (typeof(callback) == "function")
                callback();
        });
    };
})(jQuery);


var App = {

    /*
        Animates all the dropdown menu within the provided selector.

        Animation is done with the help of animate.css classes
     */
    animateDropdownMenu: function (selector) {
        // Listen for dropdown show event
        // and add animation class to it when shown
        $(selector).on('show.bs.dropdown', function (el) {
            $(el.target).find('ul.dropdown-menu').addClass('animated flipInY');
        });
    },

    /*
        Animates all the quickstat widgets with class `.quick-stat-widget`.

        The icon is bounced in from the left of the screen and numbers are
        rotated with odometer.
     */
    animateQuickstatWidget: function () {
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
    },

    init: function() {
        // Animating dropdow menus in top bar
        this.animateDropdownMenu('.topbar');

        this.animateQuickstatWidget();
    }

};


var Sidebar = {
    options: {},

    /*
        Caching the frequently accessed elements
    */
    el: {
        pageWrapper: $('.page-wrapper'),
        sidebar : $('.sidebar'),
        sidebarProfile : $('.sidebar-profile'),
        sidebarProfileWrapper : $('.sidebar-profile-wrapper'),
        navSidebarLi: $('.nav-sidebar li')
    },

    /*
        Adds initially required classes to the nav items
    */
    initialNavSetup: function() {
        this.el.navSidebarLi.each(function() {
            var item = $(this);

            // Adding 'dropdown' class to list items with children
            if (item.children('ul').length > 0) {
                item.addClass('dropdown');
            }

            // Display the default active item
            // We're not using CSS for showing the the children items of an active
            // item because we control the animation (slideDown/Up) with jQuery
            if (item.hasClass('active')) {
                item.find('ul').show();
            }
        });

        this.autoAdjustSidebarWidth();

        // Show the sidebar when the nav menu has been setup above
        this.el.sidebar.show();
    },

    /*
        Setup the profile popover
    */
    setupProfile: function() {
        var that = this;
        this.el.sidebarProfile.popover({
            html: true,
            content: function() {
                return that.el.sidebarProfileWrapper.find('.popover-content').html();
            },
            title: function() {
                return that.el.sidebarProfileWrapper.find('.popover-title').html();
            }
        });

        // Setting `overflow-y` of sidebar to `visible` when profile popover
        // is open. Without it, popover would be essentially hidden from the view.
        // But as a result of this, sidebar cannot be scrolled when popover is open.
        this.el.sidebarProfile.on('show.bs.popover', function() {
            that.el.sidebar.css('overflow-y', 'visible');
        });

        // Changing back the `overflow-y` property back to `scroll` when popover
        // is closed so that sidebar content is scrollable.
        this.el.sidebarProfile.on('hidden.bs.popover', function() {
            that.el.sidebar.css('overflow-y', 'scroll');
        });
    },

    // Used by `sidebarCollapse` method
    collapseTimeout: 0,

    // Checks whether the provided jQuery element is hovered
    isHovered: function (el) {
        return !!el.filter(function() { return $(this).is(":hover"); }).length;
    },

    // Collapsing the sidebar navigation
    // This function should be bound to the hover and click events on sidebar element
    sidebarCollapse: function(e) {
        e.preventDefault();
        e.stopPropagation();

        var that = e.data.that,
            parent = $(this).parent('li'),
            sidebarSlimEl = $('.sidebar-slim'),
            dropdownSubList = $(this).parent().siblings('li').children('ul'),
            isLevelOne = $($(this).parents()[2]).hasClass('sidebar');

        // Animated collapse when either the item is on the top (level 1)
        // or it a sub-item of a slim sidebar
        if (e.type === 'click' && (!sidebarSlimEl.length || (sidebarSlimEl.length && !isLevelOne) )) {
            // Closing all the other items on the same level
            dropdownSubList.slideUp(250);
            if (parent.hasClass('active')) {
                // If the item is already active, then close it down
                parent.removeClass('active');
                $(this).siblings('ul').slideUp(250);
            } else {
                // First remove .active class from all the items on same level
                $(this).parent().siblings('li').removeClass('active');
                parent.addClass('active');
                parent.children('ul').slideDown(250);
            }
        }

        // Plain hide/show when collapsed in the slim sidebar
        else if ((e.type == 'mouseenter' || e.type == 'click') && sidebarSlimEl.length && isLevelOne) {
            // Closing all the other items on the same level
            dropdownSubList.hide();
            if (parent.hasClass('active')) {
                // If the item is already active, then close it down
                parent.removeClass('active');
                $(this).siblings('ul').hide();
            } else {
                // First remove .active class from all the items on same level
                $(this).parent().siblings('li').removeClass('active');
                parent.addClass('active');
                parent.children('ul').show();
            }
        }

        // When the user moves the mouse pointer away from the dropdown list
        // hide it after one second
        else if (e.type == 'mouseleave' && sidebarSlimEl.length) {
            var checkSlimSidebarState = function (el) {
                var childNav = el.siblings('ul');
                return function() {
                    if (!that.isHovered(el) && !that.isHovered(childNav)) {
                        el.parent().removeClass('active');
                        el.siblings('ul').hide();
                    } else {
                        clearTimeout(that.collapseTimeout);
                        that.collapseTimeout = setTimeout(checkSlimSidebarState(el), 1000);
                    }
                }
            };

            this.collapseTimeout = setTimeout(checkSlimSidebarState($(this)), 1000);
        }

    },

    // Expand Sidebar Navigation
    expandSidebar: function() {
        var sidebarEl = $('.sidebar'),
            pageWrapperEl = $('.page-wrapper');

        // If sidebar nav is already expanded, do nothing
        if (!sidebarEl.hasClass('sidebar-slim-width'))
            return;

        sidebarEl.removeClass('sidebar-slim-width', 250, function() {
            pageWrapperEl.removeClass('with-sidebar-slim');
            sidebarEl.removeClass('sidebar-slim', 250);
            sidebarEl.find('.nav.nav-sidebar').animateCss('fadeInLeft');
        });
    },

    // Contract Sidebar Navigation
    contractSidebar: function() {
        var sidebarEl = $('.sidebar'),
            pageWrapperEl = $('.page-wrapper');

        // If sidebar nav is already contracted, do nothing
        if (sidebarEl.hasClass('sidebar-slim-width'))
            return;

        sidebarEl.find('.nav.nav-sidebar').animateCss('fadeInLeft');

        sidebarEl.addClass('sidebar-slim', 250, function() {
            pageWrapperEl.addClass('with-sidebar-slim');
            sidebarEl.addClass('sidebar-slim-width', 250);
        });
    },

    /*
        Toggles the sidebar size by calling the expand or contract
        function, whichever is required
        Should be bound to the click event on toggle button
    */
    toggleSidebarSize: function(e) {
        var that = e.data.that;

        if ($(window).width() < 500) {
             if (that.el.pageWrapper.hasClass('with-sidebar-hidden')) {
                 that.el.pageWrapper.removeClass('with-sidebar-hidden');
                 that.el.sidebar.removeClass('sidebar-hidden');
             } else {
                 that.el.pageWrapper.addClass('with-sidebar-hidden');
                 that.el.sidebar.addClass('sidebar-hidden');
             }
        } else {
            // Storing the knowledge that user manually toggled the size
            that.el.sidebar.data('manually-toggled', '1');

            if (that.el.sidebar.hasClass('sidebar-slim')) {
                that.expandSidebar();
            } else {
                that.contractSidebar();
            }

            // Triggering windows resize event so that widgets like charts
            // can re-render themselves according to their new container size
            $(window).trigger('resize');
        }
    },

    /*
        Adjust sidebar size once on document load
    */
    autoAdjustSidebarWidth: function(e) {
        var that = e ? e.data.that : this,
            width = $(window).width();

        if (width < 500) {
            // that.el.sidebar.removeClass('sidebar-slim');
            that.el.sidebar.addClass('sidebar-hidden');
            that.el.pageWrapper('with-sidebar-hidden');

        } else {

            that.el.sidebar.removeClass('sidebar-hidden');
            that.el.pageWrapper.removeClass('with-sidebar-hidden');

            if (!that.el.sidebar.data('manually-toggled')) {
                // If user didn't manually toggle the sidebar size
                // then automatically resize according to window width
                if (width > 800) {
                    that.expandSidebar();
                } else {
                    that.contractSidebar();
                }
            } else if (width < 800 && width >= 500) {
                // Else if user did manually toggle the sidebar size,
                // contract it only when window size is too small
                that.contractSidebar();
            }
        }
    },

    bindEvents: function() {
        // Closing the collapsed sub-menu when clicking outside of it
        // We are binding this over the entire html tag and are preventing the trigger
        // from undesired areas (such as sub-menu itself) by using `stopPropagation`
        // method on the event.
        $('html').click(function() {
            if ($('.sidebar-slim')[0])
                $('.nav-sidebar > li.dropdown.active').removeClass('active').children('ul').hide();
        });

        $('.nav-sidebar li.dropdown > a').on('click mouseenter mouseleave', {that: this} ,this.sidebarCollapse);

        // Preventing the collapsed sub-menu from being closed while clicking it
        $('.nav-sidebar > li.dropdown > ul').click(function(e) {
            e.stopPropagation();
        });

        // Toggle sidebar size
        $('#sidebarNavToggle').on('click', {that: this}, this.toggleSidebarSize);

        // Auto adjust sidebar size on window resize
        $(window).on('resize', {that: this}, this.autoAdjustSidebarWidth);
    },

    init: function() {

        this.initialNavSetup();
        this.setupProfile();
        this.bindEvents();

    }
};


$(function () {

    App.init();
    Sidebar.init();

    function toggleSlimSidebarPeek() {
        var sidebarEl = $('.sidebar'),
            pageWrapperEl = $('.page-wrapper');

        sidebarEl.addClass('sidebar-hidden');
        pageWrapperEl.addClass('with-sidebar-hidden');
    }

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
    $('.widget-info-fixed-size').find('.expand').click(function() {
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
            filename = vals.length ? vals.split('\\').pop() : '',
            filenameEl = $('.file-input-wrapper > .file-name');
        if (filenameEl.length === 0) {
            $('.file-input-wrapper').append($('<div class="file-name">' + filename + '</div>'));
        } else {
            filenameEl.html(filename);
        }
    });

    // Fade in the content wrapper
    $('.spinner').fadeOut(1000);
    $('.page-content').fadeIn(1000);

    $(window).on('beforeunload', function() {
        $('.spinner').fadeIn(500);
    });
});
