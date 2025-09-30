import { useState } from "react";
import play from "../assets/SVG/play.svg";
import dummyVideo from "../assets/video/dummy-video.mp4";
import thumb from "../assets/video/thumbnail.jpg"

const getEmbedUrl = (url, autoplay = false) => {
  if (!url) return null;

  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}`;
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}`;
  }

  if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop();
    return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}`;
  }

  return url;
};

export default function ProductVideo({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video) return null;

  const thumbnail = video.thumbnail || thumb;

  return (
    <div className="relative">
      {!isPlaying ? (
        <div
          className="relative cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          <img
            src={thumbnail}
            alt="video-thumbnail"
            className="w-full h-56 object-cover rounded-2xl"
             onError={(e) => { e.currentTarget.src = thumb; }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-[#FEF2E6] bg-opacity-50 rounded-xl flex items-center justify-center">
              <img src={play} alt="play-icon" />
            </div>
          </div>
        </div>
      ) : video.video_url ? (
        <iframe
          src={getEmbedUrl(video.video_url, true)}
          title="Product Video"
          className="w-full h-56 rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          controls
          autoPlay
          className="w-full h-60 object-cover rounded-2xl"
        >
          <source src={video.video_path || dummyVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
