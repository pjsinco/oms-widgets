<?php

/**
 * Class OMS_Widget
 *
 * @file OMS_Widget.php
 * @author  Mark Furrow <mark@orbitmedia.com>
 * @version 1.0.0
 */

class OMS_Widget extends WP_Widget
{

    protected $output;

    /**
     * Sets up the widgets name etc
     */
    public function __construct()
    {

        // widget actual processes
        parent::__construct(
            'oms_persistent_widget', // Base ID
            'OMS Persistent Widget', // Name
            array(
                'description' => __( 'Displays your OMS Widget content.')
            )
        );

    }

    /**
     * Outputs the content of the widget
     *
     * @param array $args
     * @param array $instance
     */
    public function widget( $args, $instance ) {

        // outputs the content of the widget
        $widget_id = get_field( 'choose_oms_widget', 'widget_' . $args['widget_id'] );

        (new OMS_BuildWidget( $args, $widget_id ))->getInstance();

    }

    /**
     * Outputs the options form on admin
     *
     * @param array $instance The widget options
     */
    public function form( $instance ) {

        // outputs the options form on admin
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'New title', 'text_domain' );
        ?>
        <p>
        <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Admin Title:' ); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
        </p>
        <?php

    }

    /**
     * Processing widget options on save
     *
     * @param array $new_instance The new options
     * @param array $old_instance The previous options
     */
    public function update( $new_instance, $old_instance ) {

        // processes widget options to be saved$instance = array();
        $instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';

        return $instance;

    }

}
