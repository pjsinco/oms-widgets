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
  if (jQuery('.sideBar_MapElementHolder').length > 0) {

    // Loop through each map.
    jQuery('.sideBar_MapElementHolder').each(function() {
      // Get the data element.
      var data_element = jQuery('.sideBar_GoogleMap', jQuery(this));

      map_element = document.getElementById(data_element.attr('id'));

      var map = window.L.map(map_element);

      window.L.esri.basemapLayer('Streets').addTo(map);

      // Get the marker width/height so we can generate coords.
      var marker_width = 
        parseInt(data_element.attr('data-marker_image_width'), 10);
      var marker_height = 
        parseInt(data_element.attr('data-marker_image_height'), 10);

      var marker_icon = window.L.icon({
        iconUrl: data_element.attr('data-marker_image_url'),
        iconSize: L.point(marker_width, marker_height),
        iconAnchor: L.point(marker_width / 2, marker_height),
        popupAnchor: L.point(0, -marker_height),
      });

      var lat = jQuery('.sideBar_MapListAddress').length &&
        jQuery('.sideBar_MapListAddress').first().attr('data-lat');

      var lng = jQuery('.sideBar_MapListAddress').length &&
        jQuery('.sideBar_MapListAddress').first().attr('data-lng');

      // Hold the lat/lng bounds.
      var lat_lng_bounds = window.L.latLngBounds([window.L.latLng([lat, lng])]);

      jQuery('.sideBar_MapListAddress', jQuery(this)).each(function() {
        var markerLat = jQuery(this).attr('data-lat');
        var markerLng = jQuery(this).attr('data-lng');
              
        var marker = window.L.marker(window.L.latLng([markerLat, markerLng]),
          { icon: marker_icon }
        ).addTo(map)
          .bindPopup(jQuery(this).html());
      
        lat_lng_bounds.extend(window.L.latLng([markerLat, markerLng]));
      });

      map.fitBounds(lat_lng_bounds);
      map.setView(lat_lng_bounds.getCenter())

      if (map.getZoom() > 15) {
        map.setZoom(15);
      }
    });
  }
}
