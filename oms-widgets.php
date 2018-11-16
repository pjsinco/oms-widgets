<?php

/**
 * Plugin Name: OMS Persistant Widgets
 * Plugin URI: http://orbitmedia.com
 * Description: This plugin creates persisting sidebar widget content.
 * Version: 1.0.0
 * Author: Mark Furrow
 * License: GPL2
 */

/**
 *
 * @todo Finish documentation
 * @todo Add SolarBox
 * @todo Composer
 * @todo Check for enqueued libraries
 *
 */

// ACF Field Definitions
// include( dirname(__FILE__) . '/includes/acf-field-definitions.php' );

// Require necessary resources
require_once( dirname(__FILE__) . '/class/OMS_Widget.php' );
require_once( dirname(__FILE__) . '/class/output/OMS_Output.php' );
require_once( dirname(__FILE__) . '/class/OMS_BuildWidget.php' );
require_once( dirname(__FILE__) . '/class/output/OMS_OutputMap.php' );
require_once( dirname(__FILE__) . '/class/output/OMS_OutputContent.php' );
require_once( dirname(__FILE__) . '/class/output/OMS_OutputImage.php' );
require_once( dirname(__FILE__) . '/class/output/OMS_OutputVideo.php' );
// require_once( dirname(__FILE__) . '/class/output/OMS_OutputTestimonial.php' );

add_action( 'widgets_init', create_function( '', 'return register_widget("OMS_Widget");' ) );

/**
 * Create Widget Custom Post Type
 *
 * @return void
 * @author Mark Furrow <mark@orbitmedia.com>
 */
function create_oms_widget_type()
{

    $labels = array(
        'name'                => _x( 'OMS Widgets', 'oms_widget' ),
        'singular_name'       => _x( 'OMS Widget', 'oms_widget' ),
        'add_new'             => _x( 'Add New', 'oms_widget' ),
        'add_new_item'        => _x( 'Add New Widget', 'oms_widget' ),
        'edit_item'           => _x( 'Edit Widget', 'oms_widget' ),
        'new_item'            => _x( 'New Widget', 'oms_widget' ),
        'view_item'           => _x( 'View Widget', 'oms_widget' ),
        'search_items'        => _x( 'Search Widgets', 'oms_widget' ),
        'not_found'           => _x( 'No widgets found', 'oms_widget' ),
        'not_found_in_trash'  => _x( 'No widgets found in Trash', 'oms_widget' ),
        'parent_item_colon'   => _x( 'Parent Widget:', 'oms_widget' ),
        'menu_name'           => _x( 'OMS Widgets', 'oms_widget' ),
    );

    $args = array(
        'labels'              => $labels,
        'hierarchical'        => false,
        'description'         => 'Persistent content for Wordpress widgets.',
        'supports' => array(
            'title',
            'custom-fields',
        ),
        'public'              => true,
        'menu_icon'           => 'dashicons-lightbulb',
        'show_ui'             => true,
        'show_in_menu'        => true,
        'menu_position'       => 20,
        'show_in_nav_menus'   => false,
        'publicly_queryable'  => true,
//        'exclude_from_search' => false,
        'exclude_from_search' => true,
        'has_archive'         => false,
        'query_var'           => true,
        'can_export'          => true,
        'rewrite'             => true,
        'capability_type'     => 'post'
    );

    register_post_type( 'oms_widget', $args );

}

add_action( 'init', 'create_oms_widget_type' );
