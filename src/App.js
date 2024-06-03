import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const { '*':videoUrl } = useParams();
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
