(function($) {

  'use strict';

  var XPrecise = {

    /**
    * Init X-Precise interface
    */
    init: function () {
      XPrecise.interfaceAppend();
      XPrecise.overlayChange();
      XPrecise.overlayToggle();
      XPrecise.overlayDrag();
      XPrecise.overlayPosition();
      XPrecise.overlayOpacity();
      XPrecise.pageOpacity();
      XPrecise.overlayFineTuning();
      XPrecise.overUnderToggle();
      XPrecise.interfaceDrag();
      XPrecise.interfaceToggle();
    },

    /**
    * Change overlay image
    *
    */
    overlayChange: function () {
      $("#xprecise-image").bind('change', function () {
        $("#xprecise-overlay img").attr('src', $(this).val());
        XPrecise.saveSettings();
      });
    },

    /**
    * Toggle overlay image on / off
    *
    */
    overlayToggle: function () {
      var link = $("#xprecise a.xprecise-toggle");
      var overlay = $("#xprecise-overlay");
      var isAlt = false;

      // Action on click
      link.bind('click', function () {
        toggleOverlay();
        return false;
      });

      // Action on key up
      $(document).keyup(function(e) {
        if(e.which == 18) {
          isAlt = false;
        }
      });

      // Action on key down
      $(document).keydown(function(e) {
        if(e.which == 18) {
          isAlt = true;
        }
        if(e.which == 81 && isAlt) {
          toggleOverlay();
        }
      });

      // Toggle function
      function toggleOverlay() {
        if (link.text() === "On") {
          link.text("Off");
          link.addClass('xprecise-off');
        } else {
          link.text("On");
          link.removeClass('xprecise-off');
        }
        overlay.toggle();
        XPrecise.saveSettings();
      }

      // Hide overlay
      if (link.text() === "Off") {
        overlay.hide();
        link.addClass('xprecise-off');
      }
    },

    /**
    * Make overlay image draggable
    */
    overlayDrag: function () {
      $("#xprecise-overlay").draggable({
        drag: function(event, ui) {
          $("#xprecise-top").val(ui.position.top);
          $("#xprecise-left").val(ui.position.left);
        },
        stop: function() {
          XPrecise.saveSettings();
        }
      });
    },

  /**
    * Position overlay by field values
    */
    overlayPosition: function () {
      var overlay = $("#xprecise-overlay");
      var top_field = $("#xprecise-top");
      var left_field = $("#xprecise-left");
      top_field.bind('change', function () {
        overlay.css('top', $(this).val() + 'px');
        XPrecise.saveSettings();
      });
      left_field.bind('change', function () {
        overlay.css('left', $(this).val() + 'px');
        XPrecise.saveSettings();
      });
      overlay.css('top', top_field.val() + 'px');
      overlay.css('left', left_field.val() + 'px');
    },


  /**
    * Fine tuning of the overlay position by W, S, A, D keys
    * Pressing these keys moves the overlay by 1px in selected direction
    */
    overlayFineTuning: function () {
      var overlay = $("#xprecise-overlay");
      var top_field = $("#xprecise-top");
      var left_field = $("#xprecise-left");

      // Init listening to keypresses only on hover over the overlay
      overlay.hover(
        function () {
          $(document).unbind('keypress.xprecise');
          $(document).bind('keydown.xprecise', function (e) {
            switch(e.keyCode) {
              // Pressed "W" - up key
              case 87:
                setTop('up');
                break;
              // Pressed "S" - down key
              case 83:
                setTop('down');
                break;
              // Pressed "A" left key
              case 65:
                setLeft('left');
                break;
              // Pressed "D" - rigth key
              case 68:
                setLeft('right');
                break;
            }
          });
        },
        function () {
          $(document).unbind('keydown.xprecise');
        }
      );

      /**
      * Set top position
      * @param direction of overlay moving, default is top
      */
      function setTop(direction) {
        var top = top_field.val() * 1 - 1;
        if (direction === 'down') {
          top = top_field.val() * 1 + 1;
        }
        top_field.val(top);
        overlay.css('top', top + 'px');
        XPrecise.saveSettings();
      }

      /**
      * Set left position
      * @param direction of overlay moving, default is left
      */
      function setLeft(direction) {
        var left = left_field.val() * 1 - 1;
        if (direction === 'right') {
          left = left_field.val() * 1 + 1;
        }
        left_field.val(left);
        overlay.css('left', left + 'px');
        XPrecise.saveSettings();
      }

    },

    /**
    * Change overlay opacity by interface slider
    */
    overlayOpacity: function () {

      var overlay = $("#xprecise-overlay");
      var overlay_value = $("#xprecise-opacity-value");
      var overlay_opacity = overlay_value.text() * 1;

      overlay.css('opacity', overlay_opacity/100);

      $("#xprecise-opacity").slider({
        value: overlay_opacity,
        slide: function(event, ui) {
          overlay_value.text(ui.value);
          overlay.css('opacity', ui.value/100);
        },
        stop: function() {
          XPrecise.saveSettings();
        }
      });
    },

    /**
    * Change page opacity by interface slider
    */
    pageOpacity: function () {

      var page = $("#xprecise-wrapper");
      var page_value = $("#xprecise-page-opacity-value");
      var page_opacity = page_value.text() * 1;

      page.css('opacity', page_opacity/100);

      $("#xprecise-page-opacity").slider({
        value: page_opacity,
        slide: function(event, ui) {
          page_value.text(ui.value);
          page.css('opacity', ui.value/100);
          console.log(page);
        },
        stop: function() {
          XPrecise.saveSettings();
        }
      });
    },

    /**
    * Toggle position of the overlay over and under the page
    */
    overUnderToggle: function () {
      var overlay = $("#xprecise-overlay");

      $("#xprecise-over").bind('click', function () {
        overlay.css("z-index", 10000);
        XPrecise.saveSettings();
      });

      $("#xprecise-under").bind('click', function () {
        overlay.css("z-index", 1000);
        XPrecise.saveSettings();
      });

      // Initial settings
      if ($("#xprecise-over").is(":checked")) {
        overlay.css("z-index", 10000);
      } else {
        overlay.css("z-index", 1000);
      }
    },

    /**
    * Check if X-Precise is not off the screen and return it
    */
    getInterfacePosition: function () {

      var interface_position = $("#xprecise").offset();
      var interface_top = interface_position.top - $(window).scrollTop();
      var interface_left = interface_position.left - $(window).scrollLeft();

      var window_height = $(window).height();
      var window_width = $(window).width();

      var max_top = window_height - 35;
      var max_left = window_width - 200;

      interface_position.top = interface_top;
      interface_position.left = interface_left;

      if (interface_top > max_top) {
        interface_position.top = max_top;
        $("#xprecise").css('top', interface_position.top);
      }

      if (interface_top < 0) {
        interface_position.top = 0;
        $("#xprecise").css('top', interface_position.top);
      }

      if (interface_left > max_left) {
        interface_position.left = max_left;
        $("#xprecise").css('left', interface_position.left);
      }

      if (interface_left < 0) {
        interface_position.left = 0;
        $("#xprecise").css('left', interface_position.left);
      }

      return interface_position;
    },

    /**
    * Make interface draggable
    */
    interfaceDrag: function () {
      $("#xprecise").draggable({
        handle: 'h2',
        stop: function() {
          XPrecise.saveSettings();
        }
      });
    },

    /**
    * Toggle interface on / off
    */
    interfaceToggle: function () {
      var form = $("#xprecise form");
      var link = $("#xprecise a.xprecise-close");

      $("#xprecise a.xprecise-close").bind('click', function () {
        toggleInterface();
        return false;
      });

      $("#xprecise h2").bind("dblclick", function() {
        toggleInterface();
      });

      function toggleInterface() {
        var close_link = $("#xprecise a.xprecise-close");
        form.toggle();
        if (close_link.text() === "–") {
          close_link.text("+");
          close_link.addClass('xprecise-closed');
        } else {
          close_link.text("–");
          close_link.removeClass('xprecise-closed');
        }
        XPrecise.saveSettings();
      }

      // Close interface
      if (link.text() === "+") {
        form.hide();
        link.addClass('xprecise-closed');
      }
    },

    /**
    * Get image name from page URL
    */
    getImageFromURL: function () {

      var image_name = '';
      var url_parts = location.pathname.split('/');
      url_parts.reverse();
      if (url_parts[0] !== '') {
        image_name = 'xprecise/' + url_parts[0].replace(/(.html|.php)/, '.jpg');
      } else {
        image_name = 'xprecise/index.jpg';
      }

      return image_name;
    },

    /**
    * Save settings to cookie
    */
    saveSettings: function () {
      var delimiter = '|';
      var interface_toggle, overlay_toggle, over_under;

      // Interface opened/closed
      if ($("#xprecise a.xprecise-close").text() === "–") {
        interface_toggle = '–';
      } else {
        interface_toggle = '+';
      }

      // Overlay visible/hidden
      if ($("#xprecise a.xprecise-toggle").text() === "On") {
        overlay_toggle = 'On';
      } else {
        overlay_toggle = 'Off';
      }

      // Interface position
      var interface_position = this.getInterfacePosition();

      // Overlay over or under the page
      if ($("#xprecise-over").is(":checked")) {
        over_under = 'over';
      } else {
        over_under = 'under';
      }

      // Store settings in string separated by delimiter
      var xprecise_settings = interface_toggle + delimiter +
        interface_position.top + delimiter +
        interface_position.left + delimiter +
        overlay_toggle + delimiter +
        $("#xprecise-image").val() + delimiter +
        $("#xprecise-top").val() + delimiter +
        $("#xprecise-left").val() + delimiter +
        $("#xprecise-opacity-value").text() + delimiter +
        $("#xprecise-page-opacity-value").text() + delimiter +
        over_under;
      var cookie_info = XPrecise.getCookieInfo();
      $.cookie(cookie_info.cookie_name, xprecise_settings, { path: cookie_info.cookie_path, expires: 365 });
    },

    /**
    * Get cookie name and path for current page
    * @return array
    */
    getCookieInfo: function () {
      var cookie_info = [];
      var path_parts = location.pathname.split('/');
      var file_name = path_parts.pop();
      cookie_info.cookie_path = path_parts.join('/') + '/';
      cookie_info.cookie_name = 'xprecise_' + file_name;
      return cookie_info;
    },

    /**
    * Load settings
    */
    loadSettings: function () {
      var settings = [];
      // Load settings from cookie
      var cookie_info = XPrecise.getCookieInfo();
      if ($.cookie(cookie_info.cookie_name)) {
        var xprecise_settings = $.cookie(cookie_info.cookie_name).split('|');
        settings.interface = xprecise_settings[0];
        settings.interface_top = xprecise_settings[1];
        settings.interface_left = xprecise_settings[2];
        settings.overlay = xprecise_settings[3];
        settings.image = xprecise_settings[4];
        settings.overlay_top = xprecise_settings[5];
        settings.overlay_left = xprecise_settings[6];
        settings.overlay_opacity = xprecise_settings[7];
        settings.page_opacity = xprecise_settings[8];
        settings.over_under = xprecise_settings[9];
      // Do initial settings
      } else {
        settings.interface = '+';
        settings.interface_top = 20;
        settings.interface_left = 20;
        settings.overlay = 'Off';
        settings.image = XPrecise.getImageFromURL();
        settings.overlay_top = 0;
        settings.overlay_left = 0;
        settings.overlay_opacity = 50;
        settings.page_opacity = 100;
        settings.over_under = 'over';
      }

      return settings;
    },

    /**
     * Check if .jpg image exists and if it doesn't - look for .png version
     */
    checkExtension: function (image_path) {

      var img_check = new XMLHttpRequest();
      img_check.open('HEAD', image_path, false);
      img_check.send();

      this.onerror = function () {
      };

      if (img_check.status == 404 && image_path.match(/.jpg/)) {
        var img_png_path = image_path.replace(/.jpg/, '.png');
        var img_check_png = new XMLHttpRequest();
        img_check_png.open('HEAD', img_png_path, false);
        img_check_png.send();

        if (img_check_png.status != 404 ) {
          image_path = img_png_path;
        }
      }

      return image_path;

    },

    /**
     * Can be used for IE8/7 detection
     */
    isCanvasSupported: function() {
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    },

    /**
    * Append interface and set it up
    */
    interfaceAppend: function () {
      var settings = this.loadSettings();

      // Over / under
      var over_checked, under_checked;
      if (settings.over_under === 'over') {
        over_checked = ' checked="checked" ';
        under_checked = '';
      } else {
        under_checked = ' checked="checked" ';
        over_checked = '';
      }

      settings.image = XPrecise.checkExtension(settings.image);

      var body = $('body');
      $('head').append('<link rel="stylesheet" type="text/css" media="all" href="http://xhtmlized.github.io/x-precise/xprecise.min.css" />');
      body.children().not('script').wrapAll('<div id="xprecise-wrapper"></div>');
      body.append('<div id="xprecise-overlay"><img src="' + settings.image + '" alt="X-Precise Overlay" /></div>');
      body.append('<div id="xprecise"> <h2><img src="http://xhtmlized.github.io/x-precise/img/x.png" width="14" height="14" alt="X" /> - Precise <span><a href="#" class="xprecise-toggle">' + settings.overlay + '</a> <a href="#" class="xprecise-close">' + settings.interface + '</a></span></h2> <form action="#"> <div> <h3><label for="xprecise-image" class="design">Design</label> <span> <input type="radio" name="xprecise-switch" id="xprecise-over" ' + over_checked + ' />    <label for="xprecise-over">over</label>    <input type="radio" name="xprecise-switch" id="xprecise-under" ' + under_checked + ' />    <label for="xprecise-under">under</label></span></h3> <input type="text" value="' + settings.image + '" id="xprecise-image" /> </div> <div> <h3>Position</h3> <label for="xprecise-top">top</label> <input type="text" value="' + settings.overlay_top + '" id="xprecise-top" size="4" /> <label for="xprecise-left">left</label> <input type="text" value="' + settings.overlay_left + '" id="xprecise-left" size="4" /> </div> <div>    <h3>Design opacity <span><span id="xprecise-opacity-value">' + settings.overlay_opacity + '</span>%</span></h3> <div class="xprecise-slider"> <div id="xprecise-opacity"></div> </div> </div> <div> <h3>Page opacity <span> <span id="xprecise-page-opacity-value">' + settings.page_opacity + '</span>%</span>    </h3> <div class="xprecise-slider"> <div id="xprecise-page-opacity"></div> </div> </div> </form> </div>');
      $("#xprecise-overlay").css('position', 'absolute');
      $("#xprecise").css('top', settings.interface_top + 'px');
      $("#xprecise").css('left', settings.interface_left + 'px');
      if (!XPrecise.isCanvasSupported()) {
        $("#xprecise").addClass('oldies');
      }
    }
  };

  $(function() {
    XPrecise.init();
  });

})(jQuery);

