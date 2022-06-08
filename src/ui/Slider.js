import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import './Slider.css';
import SliderContent from './SliderContent';

export class Slider extends React.Component {
    constructor() {
        super();

        this.state = {
            index: 0,
            txt: "We help you meet your daily logistic needs.",
            galleryItems: [
                <img src="slider/img1.jpg" alt="1"/>,
                <img src="slider/img2.jpg" alt="2"/>,
                <img src="slider/img3.jpg" alt="3"/>
            ]
        };
    }

    changeText = (e) => {
        var cur;
        switch(e.slide) {
            case 0:
                cur = "We help you meet your daily logistic needs.";
                break;
            case 1:
                cur = "As easy as click of a button.";
                break;
            case 2:
                cur = "Grow with us.";
                break;
            default:
                cur = "";
                break;
        }
        var d = {...this.state};
        d["txt"] = cur;
        this.setState(d);
    }

    responsive = {
        0: { items: 1 },
        1024: { items: 1 }
    }

    render() {
        return(
            <div>
                <AliceCarousel
                    items={this.state.galleryItems}
                    responsive={this.responsive}
                    autoPlayInterval={2500}
                    autoPlay={true}
                    infinite={true}
                    onSlideChanged={this.changeText}
                    fadeOutAnimation={true}
                    slideToIndex={this.state.index}
                    mouseTrackingEnabled={true}
                    disableButtonsControls={true}
                />
                <SliderContent cont={this.state.txt} />
            </div>
        );
    }
};

export default Slider;