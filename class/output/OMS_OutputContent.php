<?php

class OMS_OutputContent extends OMS_Output
{

    public function widgetContent()
    {
        $return = '
            <div class="sideBar_ElementHolder sideBar_ContentElementHolder">
                '. $this->widgetTitle() .'
                '. get_field( 'oms_open_content', $this->id ) .'
            </div>
        ';

        return $return;

    }

}
