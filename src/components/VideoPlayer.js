import React from "react";
import "shaka-player/dist/controls.css";
const shaka = require("shaka-player/dist/shaka-player.ui.js");

class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.videoComponent = React.createRef();
    this.videoContainer = React.createRef();
    this.onErrorEvent = this.onErrorEvent.bind(this);
    this.onError = this.onError.bind(this);

    this.player = null;
    this.ui = null;

    this.state = {
      loading: true, // Initially set loading to true
      playing: false, // Add a state variable for playing state
    };
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

  componentDidUpdate(prevProps, prevState) {
    // Update player only if video URL changes or loading state changes
    if (
      prevProps.videoUrl !== this.props.videoUrl ||
      prevState.loading !== this.state.loading
    ) {
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

      // Autoplay with mute (consider adding a prop for user control)
      video.muted = true;
      await video.play();

      this.setState({ loading: false, playing: true }); // Update loading and playing state

      // Optionally, handle ended event to reset loading state
      // video.addEventListener("ended", () => {
      //   this.setState({ loading: true }); // Reset loading when video ends
      // });
    } catch (error) {
      this.onError(error);
    }
  }

  render() {
    const { loading, playing } = this.state;

    return (
      <div className="video-container" ref={this.videoContainer}>
        {loading && !playing && ( // Show loading GIF only if loading and not playing
          <img
            src="https://i.gifer.com/ZKZg.gif"
            alt="Loading..."
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60px",
              height: "60px",
            }}
          />
        )}
        <video className="shaka-video" ref={this.videoComponent} />
      </div>
    );
  }
}

export default VideoPlayer;
