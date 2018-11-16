<?php

class OMS_OutputImage extends OMS_Output
{

    public function widgetContent()
    {

        // Get widget-specific data
        $data = $this->widgetData();

        if ( empty( $data['thumbnail_image'] ) ) {
            // Return nothing if an image hasn't been selected.
            return '';
        }

        $return .= '<div class="sideBar_ElementHolder sideBar_ImageElementHolder">';

        /* ======================================== */
        /* Title
        /* ======================================== */

        // if ( ! empty( $data['title'] ) ) {
        //     $return .= $this->format_title( $args, $data['title'] );
        // }

        if ( ! empty( $data['thumbnail_image'] ) ) {

            /* ======================================== */
            /* Thumbnail
            /* ======================================== */

            $thumbnail_image = '
                <img src="' . $data['thumbnail_image'] . '" alt="Image">
            ';

            if ( ! empty( $data['full_image'] ) ) {

                $thumbnail_image = '
                    <a href="' . $data['full_image'] . '" data-solarbox="sidebar_image" data-solartitle="'. esc_html($data['caption']) .'" title="' . esc_html($data['caption']) . '">
                        ' . $thumbnail_image . '
                    </a>
                ';

            }

            /* ======================================== */
            /* Caption
            /* ======================================== */

            $caption = '';

            if ( ! empty( $data['caption'] ) || ! empty( $data['title'] ) ) {

                $caption = '
                    <div class="sideBar_Caption">
                        '. $this->widgetTitle() .'
                        <div class="caption">
                            '. $data['caption'] .'
                        </div>
                    </div> <!-- .sideBar_Caption -->
                ';

            }

            /* ======================================== */
            /* Combined
            /* ======================================== */

            $return .= '
                <div class="sideBar_ImageHolder">
                    ' . $thumbnail_image . '
                    ' . $caption . '
                </div> <!-- .sideBar_ImageHolder -->
            ';

        }

        $return .= '
            </div> <!-- .sideBar_ElementHolder -->
            <div class="sideBar_Spacer"></div>
        ';

        return $return;

    }

    /**
     * Build Widget-specific Data
     *
     * @return array Widget data array
     * @author Mark Furrow <mark@orbitmedia.com>
     */
    protected function widgetData()
    {

        $data = array(
            'thumbnail_image' => get_field( 'oms_thumbnail_image', $this->id ),
            'full_image'      => get_field( 'oms_full_image', $this->id ),
            'caption'         => get_field( 'oms_caption', $this->id ),
        );

        return $data;

    }

}
