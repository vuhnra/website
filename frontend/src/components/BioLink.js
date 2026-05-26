import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

const BioLink = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // ========================================
  // CUSTOMIZE YOUR BIO LINK CONTENT HERE
  // ========================================
  const bioData = {
    // Main Title at top
    mainTitle: "Real",
    
    // Icon/Emoji (can be emoji or leave empty)
    icon: "💡",
    
    // Text below icon
    subText: "$$$",
    
    // Discord-style Profile Card
    profile: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      username: "realhvh",
      badge: "🔱", // Emoji badge next to username
      status: "last seen 2 hours ago",
      verified: true // Show verification badge
    },
    
    // Bottom number/text
    bottomText: "10",
    
    // Video Background (optional)
    // TO USE YOUR OWN VIDEO: 
    // 1. Place your video.mp4 in /app/frontend/public/ folder
    // 2. Then change videoUrl to: "/video.mp4"
    videoUrl: "",
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Background (if provided) */}
      {bioData.videoUrl && (
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
            data-testid="background-video"
          >
            <source src={bioData.videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Starfield/Snow Particle Effect */}
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-8">
        {/* Main Title */}
        <div 
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          data-testid="main-title"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-wider">
            {bioData.mainTitle}
          </h1>
        </div>

        {/* Icon/Emoji */}
        {bioData.icon && (
          <div 
            className={`text-6xl transition-all duration-1000 delay-100 transform ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))'
            }}
            data-testid="icon"
          >
            {bioData.icon}
          </div>
        )}

        {/* Sub Text */}
        {bioData.subText && (
          <div 
            className={`transition-all duration-1000 delay-200 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            data-testid="sub-text"
          >
            <p className="text-3xl md:text-4xl font-bold text-white tracking-widest">
              {bioData.subText}
            </p>
          </div>
        )}

        {/* Discord-Style Profile Card */}
        <div 
          className={`transition-all duration-1000 delay-300 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          data-testid="profile-card"
        >
          <div className="bg-[#2b2d31] border border-[#3f4147] rounded-2xl p-4 flex items-center gap-4 min-w-[280px] hover:bg-[#313338] transition-colors duration-200">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={bioData.profile.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-[#3f4147]"
                data-testid="profile-avatar"
              />
              {/* Online status indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#23a55a] border-2 border-[#2b2d31] rounded-full" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-lg truncate" data-testid="username">
                  {bioData.profile.username}
                </span>
                {bioData.profile.badge && (
                  <span className="text-base">{bioData.profile.badge}</span>
                )}
                {bioData.profile.verified && (
                  <Shield size={16} className="text-[#5865f2] fill-current" />
                )}
              </div>
              <p className="text-[#b5bac1] text-sm" data-testid="status">
                {bioData.profile.status}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Text/Number */}
        {bioData.bottomText && (
          <div 
            className={`transition-all duration-1000 delay-400 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            data-testid="bottom-text"
          >
            <p className="text-6xl md:text-7xl font-bold text-white tracking-wider">
              {bioData.bottomText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BioLink;