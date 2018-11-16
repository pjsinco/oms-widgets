
    /**
     * @file oms-sw.js
     * The functions for the sidebar widgets.
     *
     * @author Jimmy K. <jimmy@orbitmedia.com>
     * @author Mark Furrow <mark@orbitmedia.com>
     * @link http://www.orbitmedia.com
     */

    /* ======================================== */
    /* jQuery
    /* ======================================== */

    jQuery(document).ready(function(e) {

        // Listen for `ajaxcomplete` events. Whenever a widget is saved in
        // WordPress, an `ajaxcomplete` event will fire. Widget forms are
        // reloaded via ajax each time a widget is saved so we need to
        // reinitialize the media buttons each time this happens.

        jQuery(document).ajaxComplete(function($e) {
            oms_sw_init_media_buttons();
        });

        // Initialize the select media buttons.
        oms_sw_init_media_buttons();

        // Initialize the Google maps.
        oms_sw_map_create_maps();

        // Initialize SolarBox
        oms_sw_init_solarBox();

    });

    /* ======================================== */
    /* prettyPhoto
    /* ======================================== */

    /**
     * Check if the prettyPhoto library is loaded.
     *
     * @return boolean
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */

    function oms_sw_prettyphoto_lib_loaded()
    {

        var $loaded = false;

        if (typeof jQuery.fn.prettyPhoto == "function") {
            // Update the flag.
            $loaded = true;
        }

        return $loaded;

    }

    /**
     * Initialize prettyPhoto.
     *
     * @return void
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */

    function oms_sw_init_prettyphoto()
    {

        try {

            // Initialize prettyPhoto.
            jQuery.fn.prettyPhoto();

            // Bind the prettyPhoto links using the `rel` attribute.
            jQuery("a[rel^='prettyPhoto']").prettyPhoto({
                allow_expand: false,
                allow_resize: true,
                counter_seperator: ' of ',
                show_title: false,
                social_tools: '',
                theme: 'light_square',
                deeplinking: false
            });

        } catch ($e) {
            // console.log($e);
        }

    }

    /* ======================================== */
    /* Functions
    /* ======================================== */

    /**
     * Bind the select media buttons in WordPress sidebar widget forms.
     *
     * @return void
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */

    function oms_sw_init_media_buttons()
    {

        jQuery('.oms_sw_media_select_button').bind('click', function($) {

            // Get the ID of the button being clicked.
            $button_id = jQuery(this).attr('id');

            // Get the ID of the textfield to update.
            $textfield_id = jQuery(this).attr('data-textfield-id');

            if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {

                // Open the media window.
                wp.media.editor.open($button_id);

                wp.media.editor.send.attachment = function($a, $b) {
                    // $b has all the information about the attachment.
                    // console.log($b);
                    jQuery('#' + $textfield_id).val($b.url);
                };

            }

        });

    }

    function oms_sw_init_solarBox()
    {

        // INITIALIZE SOLAR BOX ON PAGE LOAD HERE
        jQuery("a[data-solarbox]").solarBox({
            countSeparator : "/", //SEPARATOR BETWEEN CURRENT NUMBER AND COUNT (DEFAULT: "/")
            mobileBreak : 768, //SCREEN WIDTH WHEN IT BEHAVES LIKE MOBILE DEVICE (DEFAULT: 768)
            fullscreen : false, //OPEN FULLSCREEN FOR LARGE SCREENS BY DEFAULT (DEFAULT: false)
            closeInBottom : false, //PLACE CLOSE BUTTON IN BOTTOM (DEFAULT: false)
            addThis : false, //USE ADDTHIS SHARING (DEFAULT: false)
            // addThisHtml : "", //CUSTOM HTML FOR SHARETHIS ICONS
            changeHash : false, //ALLOW HASH TO BE UPDATED FOR AUTO-OPENING AND SOCIAL TOOLS (DEFAULT: false)
            fullScreenPadding : 42, //SETS LIMIT ON SIZE OF BOX WITH PADDING AROUND THE SCREEN (DEFAULT: 42)
            videoDefaultWidth : 560, //DEFAULT WIDTH FOR VIDEOS IF NONE SUPPLIED (DEFAULT: 560)
            videoDefaultHeight : 314, //DEFAULT HEIGHT FOR VIDEOS IF NONE SUPPLIED (DEFAULT: 314)
            swipeThreshold : 200, //SWIPE DETECTION PIXEL WIDTH (DEFAULT: 200)
            onSolarOpen : false, //CALLBACK FUNCTION TO BE CALLED WHEN OPENED
            onSolarClose : false, //CALLBACK TO BE CALLED WHEN CLOSED
            onSolarChange : false //CALLBACK TO BE CALLED WHEN OPENED
        });

    }
