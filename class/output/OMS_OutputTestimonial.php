<?php

class OMS_OutputTestimonial extends OMS_Output
{

    public function widgetContent()
    {

        $testimonial_id =  get_field( 'oms_testimonial', $this->id );

        echo '<pre>' . print_r($testimonial_id,true) . '</pre>';

    }

}
