<?php

abstract class OMS_Output {

    protected $args;
    protected $id;
    protected $plugins_url;

    public function __construct( $args, $id )
    {
        // Set $args array
        $this->args = $args;

        // Set widget id
        $this->id = $id;

        // Set path to plugin
        $this->plugins_url = plugins_url( '/oms-widgets' );

        if ( ! is_admin() ) {
            // Enqueue the scripts and styles.
            add_action( 'wp_footer', array( $this, 'enqueue_print_scripts' ) );
        }
    }

    public function output()
    {

        // Markup WordPress adds before a widget.
        $return = $this->args['before_widget'];
        // $return .= $this->widgetTitle();
        $return .= $this->widgetContent();
        $return .= $this->args['after_widget'];

        echo $return;

    }

    protected function widgetTitle()
    {
        // Get Widget Title
        $title = get_field( 'oms_widget_title', $this->id );

        if ( ! empty( $title ) ) {
            return $this->args['before_title'] . apply_filters( 'widget_title', __( $title ), $this->id ) . $this->args['after_title'];
        }

        return '';
    }

    public function widgetContent() {}

    /**
     * Enqueue the scripts and styles.
     *
     * @return void
     * @author Jimmy K. <jimmy@orbitmedia.com>
     * @author Mark Furrow <mark@orbitmedia.com>
     */
    public function enqueue_print_scripts()
    {

        // SolarBox
        if ( ! wp_script_is( 'oms_solarbox', 'enqueued' ) ) {
            wp_register_script( 'oms_solarbox', $this->plugins_url .'/js/jquery.solarbox.js', array('jquery') );
            wp_enqueue_script( 'oms_solarbox', $this->plugins_url .'/js/jquery.solarbox.js' );
        }

        // SCRIPTS
        wp_register_script( 'oms_sw_scripts', $this->plugins_url . '/js/oms-sw.js', array('oms_solarbox') );
        wp_enqueue_script( 'oms_sw_scripts' );

        // STYLES
        wp_enqueue_style('oms_sw_css', $this->plugins_url . '/css/oms-sw.css');

    }

}
