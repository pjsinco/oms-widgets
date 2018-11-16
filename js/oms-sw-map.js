
    /**
     * @file oms-sw-map.js
     * The functions for the map widget.
     *
     * @author Jimmy K. <jimmy@orbitmedia.com>
     * @link http://www.orbitmedia.com
     */

    jQuery(document).ready(function($e) {

        setInterval(function() {

            // Get the form.
            $form = jQuery('#widgets-right .oms-sw-map-repeatable-container').closest('form');

            // Update the save button event listener.
            jQuery('.widget-control-save', $form)
                .unbind('mouseup', oms_sw_map_parse_json)
                .bind('mouseup', oms_sw_map_parse_json)
            ;

        }, 1000);

    });

    /* ======================================== */
    /* Admin UI
    /* ======================================== */

    /**
     * Parse the map JSON. Called by the "Save" button.
     *
     * @return void
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */

    function oms_sw_map_parse_json()
    {

        // Hold the JSON values.
        $json_values = [];

        // Get the form.
        $form = jQuery('#widgets-right .oms-sw-map-repeatable-container').closest('form');

        jQuery('.repeatable', $form).each(function() {

            // Set the JSON values.
            $json_values.push({
                name: jQuery('input.name', jQuery(this)).val(),
                address_1: jQuery('input.address_1', jQuery(this)).val(),
                address_2: jQuery('input.address_2', jQuery(this)).val(),
                city: jQuery('input.city', jQuery(this)).val(),
                state: jQuery('input.state', jQuery(this)).val(),
                zip_code: jQuery('input.zip_code', jQuery(this)).val(),
                country: jQuery('input.country', jQuery(this)).val(),
                lat: jQuery('input.lat', jQuery(this)).val(),
                lng: jQuery('input.lng', jQuery(this)).val(),
                email: jQuery('input.email', jQuery(this)).val(),
                phone: jQuery('input.phone', jQuery(this)).val(),
                fax: jQuery('input.fax', jQuery(this)).val(),
            });

        });

        // Encode the JSON values.
        $encoded_json = JSON.stringify($json_values);

        // Update the form field.
        jQuery('textarea.json', $form).val($encoded_json);

    }

    /**
     * Add a map fieldset. Called by the "Add Location" button.
     *
     * @return void
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */

    function oms_sw_map_add_fieldset($element)
    {

        // Get the form.
        $form = jQuery('#widgets-right .oms-sw-map-repeatable-container').closest('form');

        // Get the original repeatable fieldset.
        $repeatable_fieldset = jQuery('.repeatable.original', $form);

        // Clone the fieldset.
        $cloned_fieldset = $repeatable_fieldset.clone();

        // Append the cloned fieldset.
        $cloned_fieldset.appendTo('.repeatableContainer', $form);

        // Add "cloned" class to the cloned fieldset so we know that it
        // is a cloned fieldset and can be deleted.
        $cloned_fieldset.addClass('clone');

        // Remove the "original" class from the cloned fieldset.
        $cloned_fieldset.removeClass('original');

        // Create the button listener.
        // oms_sw_create_delete_map_fieldset_listener();

        // Reset the fields.
        jQuery('input[type="text"]', $cloned_fieldset).val('');

    }

    /**
     * Remove a map fieldset. Called by the "Remove Location" buttons.
     *
     * @return void
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */

    function oms_sw_map_remove_fieldset($element) {

        // Get the fieldset.
        $fieldset = jQuery($element).closest('fieldset');

        // Remove the fieldset.
        $fieldset.remove();

    }

    /* ======================================== */
    /* Output
    /* ======================================== */

    function oms_sw_map_create_maps()
    {

        // Check if a map exists on the page.
        if (jQuery('.sideBar_MapElementHolder').length > 0) {

            // Loop through each map.
            jQuery('.sideBar_MapElementHolder').each(function() {

                // Get the data element.
                var $data_element = jQuery('.sideBar_GoogleMap', jQuery(this));

                // Get the marker width/height so we can generate coords.
                var $marker_width = parseInt($data_element.attr('data-marker_image_width'), 10);
                var $marker_height = parseInt($data_element.attr('data-marker_image_height'), 10);

                // Generate the marker coordinates.
                var $coords = [
                    0, 0,
                    $marker_width, 0,
                    $marker_width, $marker_height,
                    0, $marker_height
                ];

                // Get the map element as a regular JavaScript element.
                $map_element = document.getElementById($data_element.attr('id'));

                // Set the map options.
                var $map_options = {
                    scrollwheel: false,
                    zoom: parseInt($data_element.attr('data-zoom_level'), 10),
                    center: new google.maps.LatLng(0, 0),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                    streetViewControl: true,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE
                    },
                };

                // Create the map.
                var $map = new google.maps.Map(
                    $map_element,
                    $map_options
                );

                // Create the marker icon.
                var $marker_icon = {
                    url: $data_element.attr('data-marker_image_url'),
                    size: new google.maps.Size($marker_width, $marker_height),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(Math.ceil($marker_width / 2), $marker_height)
                };

                // Hold the lat/lng bounds.
                var $lat_lng_bounds = new google.maps.LatLngBounds();

                jQuery('.sideBar_MapListAddress', jQuery(this)).each(function() {

                    // Create the position.
                    var $marker_position = new google.maps.LatLng(jQuery(this).attr('data-lat'), jQuery(this).attr('data-lng'));

                    // Extend the bounds.
                    $lat_lng_bounds.extend($marker_position);

                    // Create the marker.
                    var $marker = new google.maps.Marker({
                        title: $data_element.attr('data-name'),
                        position: $marker_position,
                        map: $map,
                        icon: $marker_icon,
                        shape: $coords,
                        optimized: false /* Optimized icons get cut off for some reason. */
                    });

                    // Create the info window.
                    var $info_window = new google.maps.InfoWindow({
                        content: jQuery(this).html(),
                        maxWidth: 250
                    });

                    // Open the info window when markers are clicked.
                    google.maps.event.addListener($marker, 'click', function() {
                        $info_window.open($map, $marker);
                    });

                    // Close info windows on map click.
                    google.maps.event.addListener($map, 'click', function() {
                        $info_window.close();
                    });

                    // Get the ID of the clickable map address element.
                    var $clickable_element = 'sideBar_ClickableElement_' + jQuery(this).attr('data-map_id');

                    if (document.getElementById($clickable_element)) {

                        google.maps.event.addDomListener(document.getElementById($clickable_element), 'click', function() {

                            // Get the info window HTML.
                            $info_window_html = jQuery(this).closest('.sideBar_MapListAddress').html();

                            // Set the content and open the info window.
                            $info_window.setContent($info_window_html);
                            $info_window.open($map, $marker);

                        });

                    }

                });

                // Update the map center and bounds.
                $map.setCenter($lat_lng_bounds.getCenter());
                // $map.fitBounds($lat_lng_bounds);

            });

        }

    }
