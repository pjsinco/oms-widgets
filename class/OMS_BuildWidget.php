<?php

class OMS_BuildWidget
{

    protected $widget_args; // Widget arguments
    protected $widget_id; // Widget ID
    protected $widget_type; // Widget type

    // Exception Constants
    const VIEW_ERROR_NOT_FOUND        = 1000;
    const VIEW_ERROR_UNKNOWN_SUBCLASS = 1001;

    // Widget selection constants
    const MAP         = 'map';
    const VIDEO       = 'video';
    const IMAGE       = 'image';
    const CONTENT     = 'open';
    const TESTIMONIAL = 'testimonial';

    // Widget types - Used for building dynamic class names
    static public $widget_types = array(
        OMS_BuildWidget::MAP         => 'Map',
        OMS_BuildWidget::VIDEO       => 'Video',
        OMS_BuildWidget::IMAGE       => 'Image',
        OMS_BuildWidget::CONTENT     => 'Content',
        OMS_BuildWidget::TESTIMONIAL => 'Testimonial',
    );

    public function __construct( $args, $widget_id )
    {
        $this->widget_args = $args;
        $this->widget_id   = $widget_id;
    }

    /**
     * Return Widget Output
     *
     * @return string Final widget output HTML
     * @author Mark Furrow <mark@orbitmedia.com>
     */
    final public function getInstance()
    {

        // Get widget type selection
        $widget_type = get_field( 'oms_widget_type', $this->widget_id );

        // Insure appropriate widget type string
        $class_type = self::$widget_types[ $widget_type ];

        // Retrieve appropriate widget object
        $view = $this->create( $class_type );

        return $view->output();

    }

    /**
     * Dynamically Instantiate Appropriate Widget Class
     *
     * @param  string $class_type Type of widget
     * @return object       Widget object
     * @author Mark Furrow <mark@orbitmedia.com>
     */
    final public function create( $class_type )
    {

        // Return immediately if not set
        if ( empty( $class_type ) ) return '';

        // Build widget class name
        $view_class = 'OMS_Output'. $class_type;

        // Throw exception if class does not exist
        if ( ! class_exists( $view_class )) {
            throw new Exception(
                'View subclass not found, cannot create.',
                self::VIEW_ERROR_UNKNOWN_SUBCLASS
            );
        }

        // Instantiate and return appropriate widget class
        return new $view_class( $this->widget_args, $this->widget_id );

    }

}
