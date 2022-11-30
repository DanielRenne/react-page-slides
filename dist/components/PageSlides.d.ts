import * as React from "react";
import { ISlideConfig } from "../models/ISlideConfig";
import { ISlidePrallaxConfig } from "../models/ISlidePrallaxConfig";
interface IPageSlidesProps {
    enableAutoScroll: boolean;
    transitionSpeed: number;
    parallax: ISlidePrallaxConfig;
    slides: ISlideConfig[];
    currentSlideIndex?: number;
    onChange?: (index: number) => void;
    height?: any;
}
interface IPageSlidesState {
    height: number;
}
export declare class PageSlides extends React.Component<IPageSlidesProps, IPageSlidesState> {
    static defaultProps: {
        enableAutoScroll: boolean;
        transitionSpeed: number;
    };
    state: {
        height: any;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    onResize: () => void;
    getHeight(): any;
    render(): JSX.Element;
}
export {};
