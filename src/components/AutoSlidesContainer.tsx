import * as React from "react";
import { Slide } from "./Slide";

import { ISlideConfig } from "../models/ISlideConfig";
import { CSSProperties } from "react";
import { ISlidePrallaxConfig } from "../models/ISlidePrallaxConfig";
import { AutoSlideBackground } from "./AutoSlideBackground";

interface IAutoSlidesContainerProps {
  height: number;
  transitionSpeed: number;
  slides: ISlideConfig[];
  parallax: ISlidePrallaxConfig;
  currentSlideIndex: number | undefined;
  onChange?: (index: number) => void;
}

interface IAutoSlidesContainerState {
  currentSlideIndex: number;
  userSlideIndex?: number;
}

export class AutoSlidesContainer extends React.Component<
  IAutoSlidesContainerProps,
  IAutoSlidesContainerState
> {
  public static defaultProps = {
    transitionSpeed: 2000,
    onChange: () => {},
  };

  static getDerivedStateFromProps(
    props: IAutoSlidesContainerProps,
    state: IAutoSlidesContainerState
  ) {
    if (
      typeof props.currentSlideIndex !== "undefined" &&
      props.currentSlideIndex !== state.userSlideIndex &&
      AutoSlidesContainer.isValidSlideIndex(props.currentSlideIndex, props)
    ) {
      return {
        currentSlideIndex: props.currentSlideIndex,
        userSlideIndex: props.currentSlideIndex,
      };
    }
    return null;
  }

  static isValidSlideIndex(
    slideIndex: number,
    props: IAutoSlidesContainerProps
  ) {
    return slideIndex < props.slides.length && slideIndex >= 0;
  }

  public state = {
    currentSlideIndex: 0,
  };

  private touchStart: number;
  // private prevWheelDelta = 0;
  private block = false;
  private trackPadEvent = false;

  componentDidMount() {
    window.addEventListener("wheel", this.handleMouseWheel, { passive: false });
    window.addEventListener("DOMMouseScroll", this.handleMouseWheel, {
      passive: false,
    });
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
  }

  componentDidUpdate(
    prevProps: IAutoSlidesContainerProps,
    prevState: IAutoSlidesContainerState
  ) {
    if (prevState.currentSlideIndex !== this.state.currentSlideIndex) {
      this.props.onChange!(this.state.currentSlideIndex);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("wheel", this.handleMouseWheel);
    window.removeEventListener("DOMMouseScroll", this.handleMouseWheel);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
  }

  handleMouseWheel = (event: WheelEvent) => {
    event.preventDefault();


    const delta = -event.deltaY;
    

    if (!this.block) {
      if (Math.abs(event.deltaY) < 100) {
        this.block = true;
        // console.log("Event", event);
        this.trackPadEvent = true;
        setTimeout(() => {
          this.trackPadEvent = false;
          this.block = false;
        }, 1500);
      }
      
      this.updateCurrentPage(delta < 0);
    }

  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (!this.block) {
      switch (event.key) {
        case "ArrowUp":
          this.updateCurrentPage(false);
          break;
        case "ArrowDown":
          this.updateCurrentPage(true);
          break;
      }
    }
  };

  handleTouchStart = (event: TouchEvent) => {
    this.touchStart = event.touches[0].pageY;
  };

  handleTouchMove = (event: TouchEvent) => {
    if (!this.block) {
      const touchDelta = event.touches[0].pageY - this.touchStart;
      if (Math.abs(touchDelta) > 30) {
        this.updateCurrentPage(touchDelta < 0);
        this.touchStart = event.touches[0].pageY;
      }
    }
  };

  updateCurrentPage(nextPage: boolean) {
    const currentSlideIndex =
      (nextPage ? 1 : -1) + this.state.currentSlideIndex;
    if (AutoSlidesContainer.isValidSlideIndex(currentSlideIndex, this.props)) {
      this.setState({
        currentSlideIndex,
      });
      this.block = true;
    }
  }

  getHeight() {
    return this.props.height;
  }

  renderSlides() {
    const height = this.getHeight();
    return this.props.slides.map((props, index) => {
      const isCurrent = index === this.state.currentSlideIndex;
      const isBottom = index > this.state.currentSlideIndex;
      const isTop = index < this.state.currentSlideIndex;

      return (
        <Slide height={height} key={index}>
          <AutoSlideBackground
            transitionSpeed={this.props.transitionSpeed}
            parallaxType={this.props.parallax.type}
            parallaxOffset={this.props.parallax.offset}
            isBottom={isBottom}
            isCurrent={isCurrent}
            isTop={isTop}
            height={this.getHeight()}
            style={props.style}
          />
          {props.content}
        </Slide>
      );
    });
  }

  getScrollToTop() {
    return this.state.currentSlideIndex * this.getHeight() * -1;
  }

  onTransitionEnd = () => {
    if (!this.trackPadEvent){
      this.block = false;
    }
      
  };

  render() {
    return (
      <div
        style={this.getContainerStyle()}
        onTransitionEnd={this.onTransitionEnd}
      >
        {this.renderSlides()}
      </div>
    );
  }

  private getContainerStyle() {
    const scrollToTop = this.getScrollToTop();
    return {
      height: "100%",
      position: "relative",
      touchAction: "none",
      padding: 0,
      margin: 0,
      transform: `translate3d(0px, ${scrollToTop}px, 0px)`,
      transition: `all ${this.props.transitionSpeed}ms ease`,
    } as CSSProperties;
  }
}
