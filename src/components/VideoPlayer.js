import React from "react";
import "shaka-player/dist/controls.css";
const shaka = require("shaka-player/dist/shaka-player.ui.js");

class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.videoComponent = React.createRef();
    this.videoContainer = React.createRef();
    // this.videoContainer.presentFullscreenPlayer()
    this.onErrorEvent = this.onErrorEvent.bind(this);
    this.onError = this.onError.bind(this);

    this.player = null;
    this.ui = null;
  }

  onErrorEvent(event) {
    this.onError(event.detail);
  }

  onError(error) {
    console.error("Error code", error.code, "object", error);
  }

  componentDidMount() {
    this.initPlayer();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.videoUrl !== this.props.videoUrl) {
      this.initPlayer();
    }
  }

  componentWillUnmount() {
    if (this.ui) {
      this.ui.destroy();
      this.ui = null;
    }
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }

  async initPlayer() {
    let { videoUrl } = this.props;

    console.log("videoUrl in player", videoUrl);

    const video = this.videoComponent.current;
    const videoContainer = this.videoContainer.current;

    if (!this.player) {
      this.player = new shaka.Player(video);
      this.player.addEventListener("error", this.onErrorEvent);
    }

    if (!this.ui) {
      this.ui = new shaka.ui.Overlay(this.player, videoContainer, video);
      this.ui.getControls();
    }

    try {
      await this.player.load(videoUrl);
      console.log("The video has now been loaded!");

      // Autoplay the video with mute
      video.muted = true; // Ensure the video is muted
      video.play();
      // video.allowFullScreen()
      console.log(video);

      video.presentFullscreenPlayer();

      // if (videoContainer.requestFullscreen) {
      //   videoContainer.requestFullscreen();
      // } else if (videoContainer.mozRequestFullScreen) { // Firefox
      //   videoContainer.mozRequestFullScreen();
      // } else if (videoContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
      //   videoContainer.webkitRequestFullscreen();
      // } else if (videoContainer.msRequestFullscreen) { // IE/Edge
      //   videoContainer.msRequestFullscreen();
      // }
    } catch (error) {
      this.onError(error);
    }
  }

  render() {
    return (
      <div className="video-container" ref={this.videoContainer}>
        <video className="shaka-video" ref={this.videoComponent} />
      </div>
    );
  }
}

export default VideoPlayer;