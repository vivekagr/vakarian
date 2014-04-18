(function () {
/**
 * almond 0.1.4 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name],
                        config: makeConfig(name)
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else if (!defining[depName]) {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

//Wrapped in an outer function to preserve global this
(function (root) { var amdExports; define('bootstrap/bootstrap-transition',['jquery'], function () { (function () {

/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

   // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);


}.call(root));
    return amdExports;
}); }(this));

/*
 * Fuel UX Utilities
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define('fuelux/util',['require','jquery'],function (require) {

	var $ = require('jquery');

	// custom case-insensitive match expression
	function fuelTextExactCI(elem, text) {
		return (elem.textContent || elem.innerText || $(elem).text() || '').toLowerCase() === (text || '').toLowerCase();
	}

	$.expr[':'].fuelTextExactCI = $.expr.createPseudo ?
		$.expr.createPseudo(function (text) {
			return function (elem) {
				return fuelTextExactCI(elem, text);
			};
		}) :
		function (elem, i, match) {
			return fuelTextExactCI(elem, match[3]);
		};

});

/*
 * Fuel UX Wizard
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define('fuelux/wizard',['require','jquery'],function (require) {

	var $   = require('jquery');
	var old = $.fn.wizard;

	// WIZARD CONSTRUCTOR AND PROTOTYPE

	var Wizard = function (element, options) {
		var kids;

		this.$element = $(element);
		this.options = $.extend({}, $.fn.wizard.defaults, options);
		this.options.disablePreviousStep = ( this.$element.data().restrict === "previous" ) ? true : false;
		this.currentStep = this.options.selectedItem.step;
		this.numSteps = this.$element.find('.steps li').length;
		this.$prevBtn = this.$element.find('button.btn-prev');
		this.$nextBtn = this.$element.find('button.btn-next');

		kids = this.$nextBtn.children().detach();
		this.nextText = $.trim(this.$nextBtn.text());
		this.$nextBtn.append(kids);

		// handle events
		this.$prevBtn.on('click', $.proxy(this.previous, this));
		this.$nextBtn.on('click', $.proxy(this.next, this));
		this.$element.on('click', 'li.complete', $.proxy(this.stepclicked, this));
		
		if(this.currentStep > 1) {
			this.selectedItem(this.options.selectedItem);
		}

		if( this.options.disablePreviousStep ) {
			this.$prevBtn.attr( 'disabled', true );
			this.$element.find( '.steps' ).addClass( 'previous-disabled' );
		}
	};

	Wizard.prototype = {

		constructor: Wizard,

		setState: function () {
			var canMovePrev = (this.currentStep > 1);
			var firstStep = (this.currentStep === 1);
			var lastStep = (this.currentStep === this.numSteps);

			// disable buttons based on current step
			if( !this.options.disablePreviousStep ) {
				this.$prevBtn.attr('disabled', (firstStep === true || canMovePrev === false));
			}

			// change button text of last step, if specified
			var data = this.$nextBtn.data();
			if (data && data.last) {
				this.lastText = data.last;
				if (typeof this.lastText !== 'undefined') {
					// replace text
					var text = (lastStep !== true) ? this.nextText : this.lastText;
					var kids = this.$nextBtn.children().detach();
					this.$nextBtn.text(text).append(kids);
				}
			}

			// reset classes for all steps
			var $steps = this.$element.find('.steps li');
			$steps.removeClass('active').removeClass('complete');
			$steps.find('span.badge').removeClass('badge-info').removeClass('badge-success');

			// set class for all previous steps
			var prevSelector = '.steps li:lt(' + (this.currentStep - 1) + ')';
			var $prevSteps = this.$element.find(prevSelector);
			$prevSteps.addClass('complete');
			$prevSteps.find('span.badge').addClass('badge-success');

			// set class for current step
			var currentSelector = '.steps li:eq(' + (this.currentStep - 1) + ')';
			var $currentStep = this.$element.find(currentSelector);
			$currentStep.addClass('active');
			$currentStep.find('span.badge').addClass('badge-info');

			// set display of target element
			var target = $currentStep.data().target;
			this.$element.next('.step-content').find('.step-pane').removeClass('active');
			$(target).addClass('active');

			// reset the wizard position to the left
			this.$element.find('.steps').first().attr('style','margin-left: 0');

			// check if the steps are wider than the container div
			var totalWidth = 0;
			this.$element.find('.steps > li').each(function () {
				totalWidth += $(this).outerWidth();
			});
			var containerWidth = 0;
			if (this.$element.find('.actions').length) {
				containerWidth = this.$element.width() - this.$element.find('.actions').first().outerWidth();
			} else {
				containerWidth = this.$element.width();
			}
			if (totalWidth > containerWidth) {
			
				// set the position so that the last step is on the right
				var newMargin = totalWidth - containerWidth;
				this.$element.find('.steps').first().attr('style','margin-left: -' + newMargin + 'px');
				
				// set the position so that the active step is in a good
				// position if it has been moved out of view
				if (this.$element.find('li.active').first().position().left < 200) {
					newMargin += this.$element.find('li.active').first().position().left - 200;
					if (newMargin < 1) {
						this.$element.find('.steps').first().attr('style','margin-left: 0');
					} else {
						this.$element.find('.steps').first().attr('style','margin-left: -' + newMargin + 'px');
					}
				}
			}

			this.$element.trigger('changed');
		},

		stepclicked: function (e) {
			var li          = $(e.currentTarget);
			var index       = this.$element.find('.steps li').index(li);
			var canMovePrev = true;

			if( this.options.disablePreviousStep ) {
				if( index < this.currentStep ) {
					canMovePrev = false;
				}
			}

			if( canMovePrev ) {
				var evt = $.Event('stepclick');
				this.$element.trigger(evt, {step: index + 1});
				if (evt.isDefaultPrevented()) return;

				this.currentStep = (index + 1);
				this.setState();
			}
		},

		previous: function () {
			var canMovePrev = (this.currentStep > 1);
			if( this.options.disablePreviousStep ) {
				canMovePrev = false;
			}
			if (canMovePrev) {
				var e = $.Event('change');
				this.$element.trigger(e, {step: this.currentStep, direction: 'previous'});
				if (e.isDefaultPrevented()) return;

				this.currentStep -= 1;
				this.setState();
			}
		},

		next: function () {
			var canMoveNext = (this.currentStep + 1 <= this.numSteps);
			var lastStep = (this.currentStep === this.numSteps);

			if (canMoveNext) {
				var e = $.Event('change');
				this.$element.trigger(e, {step: this.currentStep, direction: 'next'});

				if (e.isDefaultPrevented()) return;

				this.currentStep += 1;
				this.setState();
			}
			else if (lastStep) {
				this.$element.trigger('finished');
			}
		},

		selectedItem: function (selectedItem) {
			var retVal, step;

			if(selectedItem) {

				step = selectedItem.step || -1;

				if(step >= 1 && step <= this.numSteps) {
					this.currentStep = step;
					this.setState();
				}

				retVal = this;
			}
			else {
				retVal = { step: this.currentStep };
			}

			return retVal;
		}
	};


	// WIZARD PLUGIN DEFINITION

	$.fn.wizard = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'wizard' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('wizard', (data = new Wizard( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.wizard.defaults = {
        selectedItem: {step:1}
	};

	$.fn.wizard.Constructor = Wizard;

	$.fn.wizard.noConflict = function () {
		$.fn.wizard = old;
		return this;
	};


	// WIZARD DATA-API

	$(function () {
		$('body').on('mouseover.wizard.data-api', '.wizard', function () {
			var $this = $(this);
			if ($this.data('wizard')) return;
			$this.wizard($this.data());
		});
	});
});
/*
 * Fuel UX
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define('fuelux/all',['require','jquery','fuelux/wizard'],function (require) {
	require('jquery');
	require('fuelux/wizard');
});

/*
 * Fuel UX
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define('jquery', [], function () { return jQuery; });

define('moment', [], function () {});

define('fuelux/loader', ['fuelux/all'], function () {});

require('fuelux/loader');}());