<?php

class OMS_OutputMap extends OMS_Output
{

    protected $config_data;

    public function __construct( $args, $id )
    {

        parent::__construct( $args, $id );

        $this->config_data = $this->setConfigData();

    }

    public function widgetContent()
    {

        // Get widget-specific data
        $locaton_data = $this->locationData();

        // Set array data to object
        $locaton_data = json_decode(json_encode($locaton_data), FALSE);

        // Hold the formatted output.
        $formatted_html = '';

        // Hold the index.
        $i = 0;

        foreach( $locaton_data as $v ) {

            /* ======================================== */
            /* Latitude & Longitude
            /* ======================================== */

            // Get the latitude and longitude.
            $lat = $v->lat;
            $lng = $v->lng;

            if ( $lat == '0' || empty( $lat ) || $lng == '0' || empty( $lng ) ) {

                // Ask Google to geocode the address for us.
                $geocoded_lat_lng = $this->geocode_address(
                    $v->address_1 . ' ' . $v->city . ', ' . $v->state . ', ' . $v->zip_code . ', ' . $v->country
                );

                if ($geocoded_lat_lng !== false) {
                    // Use the geocoded latitude and longitude instead.
                    $lat = $geocoded_lat_lng['lat'];
                    $lng = $geocoded_lat_lng['lng'];
                }

            }

            // Set the data attributes.
            $instance_attributes = array(
                'lat' => $lat,
                'lng' => $lng,
                'map_id' => rand(0, 999),
            );

            // Hold the data attributes output.
            $instance_attributes_html = '';

            // Convert data attributes array to HTML attributes.
            foreach ($instance_attributes as $instance_key => $instance_value) {
                $instance_attributes_html .= ' data-' . esc_html__( $instance_key ) . '="' . esc_html__( $instance_value ) . '"';
            }

            $formatted_html .= '
                <div class="sideBar_MapListAddress" ' . $instance_attributes_html . '>
            ';

            /* ======================================== */
            /* Formatted Address
            /* ======================================== */

            $formatted_html .= '
                <div class="sideBar_MapAddressElement nameText" id="sideBar_ClickableElement_' . $instance_attributes['map_id'] . '">
                    ' . esc_html__( $v->name ) . '
                </div> <!-- .nameText -->
                <div class="sideBar_MapAddressElement addressText1">
                    ' . esc_html__( $v->address_1 ) . '
                </div> <!-- .combinedAddressText -->
                <div class="sideBar_MapAddressElement addressText2">
                    ' . esc_html__( $v->address_2 ) . '
                </div> <!-- .combinedAddressText -->
                <div class="sideBar_MapAddressElement cityStateZipText">
                    ' . $this->format_city_state_zip($v) . '
                </div> <!-- .cityStateZipText -->
                <div class="sideBar_MapAddressElement directionsButton mobileOnly">
                    <a href="' . $this->format_directions_url($v) . '" class="button" target="_blank">Get Directions</a>
                </div> <!-- .directionsButton -->
            ';

            /* ======================================== */
            /* Formatted Phone
            /* ======================================== */

            if ( ! empty( $v->phone ) ) {
                $formatted_html .= '
                    <div class="sideBar_MapAddressElement phoneText desktopOnly">
                        General Phone: ' . esc_html__( $v->phone ) . '
                    </div> <!-- .phoneText -->
                    <div class="sideBar_MapAddressElement phoneText mobileOnly">
                        <a href="tel://' . esc_html__( $v->phone ) . '" class="button">Call Now</a>
                    </div> <!-- .phoneText -->
                ';
            }

            /* ======================================== */
            /* Formatted Fax
            /* ======================================== */

            if ( ! empty( $v->fax ) ) {
                $formatted_html .= '
                    <div class="sideBar_MapAddressElement faxText desktopOnly">
                        Fax: ' . esc_html__( $v->fax ) . '
                    </div> <!-- .faxText -->
                ';
            }

            /* ======================================== */
            /* Formatted Toll Phone
            /* ======================================== */

            if ( ! empty( $v->toll ) ) {
                $formatted_html .= '
                    <div class="sideBar_MapAddressElement tollText desktopOnly">
                        Toll-Free: ' . esc_html__( $v->toll ) . '
                    </div> <!-- .faxText -->
                ';
            }

            /* ======================================== */
            /* Formatted Email
            /* ======================================== */

            if ( ! empty( $v->email ) ) {
                $formatted_html .= '
                    <div class="sideBar_MapAddressElement emailText desktopOnly">
                        Email: <a href="mailto:' . esc_html__( $v->email ) . '">' . esc_html__( $v->email ) . '</a>
                    </div> <!-- .emailText -->
                ';
            }

            /* ======================================== */
            /* Formatted Driving Directions
            /* ======================================== */

            $formatted_html .= '
                <div class="sideBar_MapAddressElement directionsText desktopOnly">
                    <a href="' . $this->format_directions_url($v) . '" target="_blank">Driving Directions</a>
                </div> <!-- .directionsText -->';

            $formatted_html .= '
                </div> <!-- .sideBar_mapListAddress -->
            ';

        }

        /* ======================================== */
        /* Combined
        /* ======================================== */

        $return .= '
            <div class="sideBar_ElementHolder sideBar_MapElementHolder">
                <div class="sideBar_GoogleMapHolder">
                    <div id="googleMapWrapper" class="desktopOnly">
                        <div id="sideBar_GoogleMap_' . rand(0, 99) . '" class="sideBar_GoogleMap" style="width: 300px; height: 300px;" ' . $this->config_data . '></div>
                    </div> <!-- .googleMapWrapper -->
                    <div id="sideBar_MapList">
                        ' . $formatted_html . '
                    </div> <!-- .sideBar_MapList -->
                </div> <!-- .sideBar_GoogleMapHolder -->
            </div> <!-- .sideBar_ElementHolder -->
            <div class="sideBar_Spacer"></div>
        ';

        return $return;

    }

    protected function setConfigData()
    {

        $marker_image = get_field( 'oms_marker', $this->id );
        $zoom_level = (int) get_field( 'oms_zoom_level', $this->id );
        $zoom_level = ( ! empty( $zoom_level ) ) ? $zoom_level : 15;

        /* ======================================== */
        /* Marker Image
        /* ======================================== */

        // Default marker width and height.
        $marker_width = 30;
        $marker_height = 40;

        if ( empty( $marker_image ) ) {

            // Use the default marker image.
            $marker_image = $this->plugins_url .'/images/markers/default.png';

        } else {

            if ( ! defined( 'ABSPATH' ) ) {
                // Get the absolute path of the WordPress installation.
                define( 'ABSPATH', dirname(__FILE__) . '/' );
            }

            // Extract the marker image filename.
            $marker_image_path = $marker_image;
            $marker_image_path = substr($marker_image_path, strpos($marker_image_path, '/wp-content/uploads/') + 1);

            if ( @file_exists( ABSPATH . $marker_image_path ) ) {
                // Get the width and height of the marker..
                list( $marker_width, $marker_height, $image_type, $image_attributes ) = @getimagesize( ABSPATH . $marker_image_path );
            } else {
                // echo 'Marker image does not exist.';
            }

        }

        /* ======================================== */
        /* Data Attributes
        /* ======================================== */

        // Data attributes will be used by jQuery to initialize the map.
        $instance_attributes = array(
            'marker_image_url'    => $marker_image,
            'marker_image_width'  => $marker_width,
            'marker_image_height' => $marker_height,
            'zoom_level'          => $zoom_level,
        );

        // Convert data attributes array to HTML attributes.
        foreach( $instance_attributes as $k => $v ) {
            $data_attributes .= ' data-' . esc_html($k) . '="' . esc_html__($v) . '"';
        }

        // Set the attributes.
        return $data_attributes;

    }

    protected function locationData()
    {

        $data = array();

        if ( have_rows( 'oms_locations', $this->id ) ) {
            while ( have_rows( 'oms_locations', $this->id ) ) : the_row();
                $data[] = array(
                    'name' => get_sub_field( 'oms_name' ),
                    'address_1' => get_sub_field( 'oms_address_1' ),
                    'address_2' => get_sub_field( 'oms_address_2' ),
                    'city' => get_sub_field( 'oms_city' ),
                    'state' => get_sub_field( 'oms_state' ),
                    'zip_code' => get_sub_field( 'oms_zip_code' ),
                    'country' => get_sub_field( 'oms_country' ),
                    'lat' => get_sub_field( 'oms_latitude' ),
                    'lng' => get_sub_field( 'oms_longitude' ),
                    'phone' => get_sub_field( 'oms_phone' ),
                    'fax' => get_sub_field( 'oms_fax' ),
                    'email' => get_sub_field( 'oms_email' ),
                    'toll' => get_sub_field( 'oms_toll' ),
                );
            endwhile;
        }

        return $data;

    }


    /**
     * Fetch the latitude and longitude for an address using the (free)
     * Google Maps API.
     *
     * @param string $address
     * @return array
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */
    protected function geocode_address( $address )
    {

        if ( ! function_exists( 'file_get_contents' ) ) {
            // The file_get_contents() function is not enabled.
            return false;
        }

        // Hold the Google API URL.
        $google_api_url = 'http://maps.googleapis.com/maps/api/geocode/xml?address=' . urlencode($address) . '&sensor=false';

        // Ask Google to geocode the address.
        if ( $xml_response = @file_get_contents( $google_api_url ) ) {

            // Parse the XML response.
            $xml = new SimpleXMLElement( $xml_response );

            if ( $xml->status == 'OK' ) {
                // Everything is good!
                return array(
                    'lat' => $xml->result->geometry->location->lat,
                    'lng' => $xml->result->geometry->location->lng,
                );
            }

            // Response returned an error.
            return false;

        }

        // Couldn't read XML response.
        return false;

    }

    /**
     * Format the city, state, and zip.
     *
     * @return string
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */
    protected function format_city_state_zip( $data )
    {

        // Hold the return value.
        $return = '';

        // CITY
        if ( ! empty( $data->city ) ) {
            $return .= $data->city;
        }

        // STATE
        if ( ! empty( $data->state ) ) {
            if ( ! empty( $return ) ) $return .= ', ';
            $return .= $data->state;
        }

        // ZIP
        if ( ! empty( $data->zip_code ) ) {
            if ( ! empty( $return ) ) $return .= ' ';
            $return .= $data->zip_code;
        }

        // COUNTRY
        if ( ! empty( $data->country ) ) {
            if ( ! empty( $return ) ) $return .= ', ';
            $return .= $data->country;
        }

        // Trim the return value.
        $return = trim( $return );

        return $return;

    }

    /**
     * Format the directions URL.
     *
     * @param array $data
     * @return string
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */
    protected function format_directions_url( $data )
    {

        // Start the URL.
        $return = 'http://maps.google.com/maps?hl=en&amp;f=d&amp;daddr=';

        // Add the address parts.
        $return .= urlencode( $data->address_1 . ' ' );
        $return .= urlencode( $this->format_city_state_zip( $data ) . ' ' );

        // Trim the return value.
        $return = rtrim( $return, '+' );

        return $return;

    }

    /**
     * Enqueue the scripts and styles.
     *
     * @return void
     * @author Jimmy K. <jimmy@orbitmedia.com>
     */
    public function enqueue_print_scripts()
    {

        parent::enqueue_print_scripts();

        // SCRIPTS
        wp_register_script('oms_sw_map_js', $this->plugins_url . '/js/oms-sw-map.js');
        wp_enqueue_script('oms_sw_map_js');
        wp_register_script('oms_sw_map_google_maps', 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false');
        wp_enqueue_script('oms_sw_map_google_maps');

        // STYLES
        wp_enqueue_style('oms_sw_map_css', $this->plugins_url . '/css/oms-sw-map.css');

    }

}
