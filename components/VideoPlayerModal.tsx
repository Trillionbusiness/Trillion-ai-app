
import React from 'react';

interface VideoPlayerModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 border-2 border-yellow-400 rounded-2xl w-full max-w-4xl h-auto flex flex-col p-6 md:p-8 text-white shadow-2xl relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Your Video Overview</h2>
          <p className="text-gray-400 mt-2">A summary of your new business plan.</p>
        </div>

        <div className="flex-grow bg-black rounded-lg overflow-hidden aspect-video">
          {videoUrl ? (
            <video src={videoUrl} controls autoPlay className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>Loading video...</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-center">
             <a
                href={videoUrl}
                download="hormozi_ai_video_overview.mp4"
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition-colors"
             >
                Download Video
            </a>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
