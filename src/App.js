import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from './components/VideoPlayer';

function App() {
  let { '*':videoUrl } = useParams();
  // For types of parts in URL: http and https
  if (videoUrl.includes("http:/"))
    videoUrl = videoUrl.replace("http:/", "http://");
  if (videoUrl.includes("https:/"))
    videoUrl = videoUrl.replace("https:/", "https://");

  console.log(videoUrl)
  const decodedVideoUrl = decodeURIComponent(videoUrl);
  console.log(decodedVideoUrl)
  return (
    <div>
      <VideoPlayer videoUrl={decodedVideoUrl} />
    </div>
  );
}

export default App;
