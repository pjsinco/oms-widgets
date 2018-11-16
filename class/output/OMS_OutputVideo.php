<?php

class OMS_OutputVideo extends OMS_Output
{

    public function widgetContent()
    {

        // Get widget-specific data
        $data = $this->widgetData();

        if ( empty( $data['thumbnail_image'] ) ) {
            // Return nothing if an image hasn't been selected.
            return '';
        }

        // Markup WordPress adds before a widget.
        $return = $args['before_widget'];

        $return .= '<div class="sideBar_ElementHolder sideBar_VideoElementHolder">';

        /* ======================================== */
        /* Title
        /* ======================================== */

        // if ( ! empty( $data['title'] ) ) {
        //     $return .= $this->format_title($args, $data['title']);
        // }

        if ( ! empty( $data['thumbnail_image'] ) ) {

            /* ======================================== */
            /* Length
            /* ======================================== */

            $length = '';

            if ( ! empty( $data['length'] ) ) {

                $length = '
                    <span class="length"> – ' . $data['length'] . '</span>
                ';

            }

            /* ======================================== */
            /* Caption
            /* ======================================== */

            $caption = '';
            $title = $this->widgetTitle();

            if ( ! empty( $data['caption'] ) || ! empty( $title ) ) {

                $caption = '<div class="sideBar_Caption">';
                $caption .= $this->widgetTitle() . $length;

                if ( ! empty( $data['caption'] ) ) {
                    $caption .= '
                        <div class="caption">
                            ' . $data['caption'] . '
                        </div>
                    ';
                }

                $caption .= '</div> <!-- .sideBar_Caption -->';

            }

            /* ======================================== */
            /* Thumbnail
            /* ======================================== */

            $thumbnail_image = '
                <img src="' . $data['thumbnail_image'] . '" alt="Image">
            ';

            if ( ! empty($data['video_url'] ) ) {

                $thumbnail_image = '
                    <a href="' . $data['video_url'] . '" data-solarbox="sidebar_video" data-solartitle="' . esc_html($data['caption']) . '" title="' . esc_html($data['caption']) . '">
                        ' . $thumbnail_image . '
                        <div class="button">
                            <i class="fa fa-play"></i><span>PLAY VIDEO</span>
                        </div>
                    </a>
                ';

            }

            /* ======================================== */
            /* Combined
            /* ======================================== */

            $return .= '
                <div class="sideBar_VideoHolder">
                    <div class="sideBar_VideoHolderInner">
                        <div class="sideBar_VideoInner">
                            ' . $thumbnail_image . '
                        </div> <!-- .sideBar_VideoInner -->
                        ' . $caption . '
                    </div> <!-- .sideBar_VideoHolderInner -->
                </div> <!-- .sideBar_VideoHolder -->
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
            'video_url'       => get_field( 'oms_video_url', $this->id ),
            'caption'         => get_field( 'oms_caption', $this->id ),
            'length'          => get_field( 'oms_video_length', $this->id ),
        );

        return $data;

    }

}
