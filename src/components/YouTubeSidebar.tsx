import React from 'react';

interface YouTubeSidebarProps {
  videoId: string;
}

export function YouTubeSidebar({ videoId }: YouTubeSidebarProps) {
  return (
    <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}