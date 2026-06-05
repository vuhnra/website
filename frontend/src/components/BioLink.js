import React, { useState, useEffect, useMemo } from 'react';

const BioLink = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [discordData, setDiscordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const videoRef = React.useRef(null);

  const handleEnter = () => {
    setHasEntered(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  // ========================================
  // CUSTOMIZE YOUR BIO LINK CONTENT HERE
  // ========================================
  const bioData = {
    // Your Discord User ID (for live status)
    discordUserId: "178906698440900608",
    
    // Manual badges (since Discord API doesn't expose them)
    manualBadges: [],
    
    // Default profile info (will be replaced by live Discord data)
    defaultProfile: {
      username: "66japanese",
      avatar: "https://cdn.discordapp.com/avatars/178906698440900608/00fa9cae5cfc9da5773de4d26812f1f3.png?size=128",
    },
    
    // Bio Links - Official logos only, no text
    bioLinks: [
      { 
        logo: "/youtube-logo.png",
        name: "YouTube",
        url: "https://youtube.com/channel/UCDHRfbbfEepcVRJ7qqDQk9g",
      },
      { 
        logo: "/roblox-logo.png",
        name: "Roblox",
        url: "https://www.roblox.com/users/504314066/profile",
      },
    ],
    
    // Video Background (optional)
    videoUrl: "/video.mp4",
  };

  // Fetch Discord status from Lanyard API directly
  const fetchDiscordStatus = async () => {
    try {
      const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${bioData.discordUserId}`);
      const lanyardData = await lanyardResponse.json();
      
      if (lanyardData.success) {
        setDiscordData({
          discord_user: lanyardData.data.discord_user,
          discord_status: lanyardData.data.discord_status,
          activities: lanyardData.data.activities || [],
          spotify: lanyardData.data.spotify,
          listening_to_spotify: lanyardData.data.listening_to_spotify
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Discord status:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    fetchDiscordStatus();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDiscordStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Get Discord badges from public_flags
  const getDiscordBadges = (publicFlags) => {
    const badges = [];
    
    if (!publicFlags) return badges;
    
    const BADGES = {
      STAFF: { bit: 1 << 0, icon: 'https://cdn.discordapp.com/badge-icons/5e74e9b61934fc1f67c65515d1f7e60d.png', name: 'Discord Staff' },
      PARTNER: { bit: 1 << 1, icon: 'https://cdn.discordapp.com/badge-icons/3f9748e53446a137a052f3454e2de41e.png', name: 'Partnered Server Owner' },
      HYPESQUAD: { bit: 1 << 2, icon: 'https://cdn.discordapp.com/badge-icons/bf01d1073931f921909045f3a39fd264.png', name: 'HypeSquad Events' },
      BUG_HUNTER_LEVEL_1: { bit: 1 << 3, icon: 'https://cdn.discordapp.com/badge-icons/2717692c7dca7289b35297368a940dd0.png', name: 'Bug Hunter Level 1' },
      HYPESQUAD_BRAVERY: { bit: 1 << 6, icon: 'https://cdn.discordapp.com/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png', name: 'HypeSquad Bravery' },
      HYPESQUAD_BRILLIANCE: { bit: 1 << 7, icon: 'https://cdn.discordapp.com/badge-icons/011940fd013da3f7fb926e4a1cd2e618.png', name: 'HypeSquad Brilliance' },
      HYPESQUAD_BALANCE: { bit: 1 << 8, icon: 'https://cdn.discordapp.com/badge-icons/3aa41de486fa12454c3761e8e223442e.png', name: 'HypeSquad Balance' },
      EARLY_SUPPORTER: { bit: 1 << 9, icon: 'https://cdn.discordapp.com/badge-icons/7060786766c9c840eb3019e725d2b358.png', name: 'Early Supporter' },
      BUG_HUNTER_LEVEL_2: { bit: 1 << 14, icon: 'https://cdn.discordapp.com/badge-icons/848f79194d4be5ff5f81505cbd0ce1e6.png', name: 'Bug Hunter Level 2' },
      VERIFIED_DEVELOPER: { bit: 1 << 17, icon: 'https://cdn.discordapp.com/badge-icons/6bdc42827a38498929a4920da12695d9.png', name: 'Early Verified Bot Developer' },
      ACTIVE_DEVELOPER: { bit: 1 << 22, icon: 'https://cdn.discordapp.com/badge-icons/6df5892e0f35b051f8b61eace34f4967.png', name: 'Active Developer' },
    };
    
    Object.entries(BADGES).forEach(([key, badge]) => {
      if ((publicFlags & badge.bit) === badge.bit) {
        badges.push(badge);
      }
    });
    
    return badges;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#23a55a';
      case 'idle': return '#f0b232';
      case 'dnd': return '#f23f43';
      default: return '#80848e';
    }
  };

  // Get status text
  const getStatusText = () => {
    if (!discordData) return bioData.defaultProfile.username;
    
    const activities = discordData.activities || [];
    
    // Don't show Spotify in status text anymore (we'll show it separately)
    
    // Check for custom status (type 4)
    const customStatus = activities.find(a => a.type === 4);
    if (customStatus && customStatus.state) {
      return customStatus.state;
    }
    
    // Check for playing game (type 0)
    const activity = activities.find(a => a.type === 0);
    if (activity) {
      return `Playing ${activity.name}`;
    }
    
    // Show offline if not online
    if (discordData.discord_status === 'offline') {
      return 'Offline';
    }
    
    return discordData.discord_status.charAt(0).toUpperCase() + discordData.discord_status.slice(1);
  };

  // Get Spotify data
  const spotifyData = discordData?.spotify || null;
  const isListeningToSpotify = discordData?.listening_to_spotify || false;

  // Calculate Spotify progress
  const [spotifyProgress, setSpotifyProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    if (spotifyData && spotifyData.timestamps) {
      const updateProgress = () => {
        const now = Date.now();
        const start = spotifyData.timestamps.start;
        const end = spotifyData.timestamps.end;
        const totalDuration = end - start;
        const elapsed = now - start;
        const progress = Math.min((elapsed / totalDuration) * 100, 100);
        
        setSpotifyProgress(progress);
        setCurrentTime(Math.floor(elapsed / 1000));
        setDuration(Math.floor(totalDuration / 1000));
      };

      updateProgress();
      const interval = setInterval(updateProgress, 1000);
      
      return () => clearInterval(interval);
    }
  }, [spotifyData]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const username = discordData?.discord_user?.username || bioData.defaultProfile.username;
  const avatar = discordData?.discord_user?.avatar 
    ? `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png?size=128`
    : bioData.defaultProfile.avatar;
  const status = discordData?.discord_status || 'offline';
  // Use manual badges instead of API badges
  const badges = bioData.manualBadges || [];

  // Memoize bio links to prevent re-rendering on timer updates
  const memoizedBioLinks = useMemo(() => {
    return bioData.bioLinks.map((link, index) => (
      <a
        key={index}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group transition-all duration-300"
        data-testid={`link-${link.name.toLowerCase()}`}
      >
        <img 
          src={link.logo} 
          alt={link.name}
          className="h-12 w-12 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
          style={{ 
            width: '48px', 
            height: '48px',
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))',
          }}
        />
      </a>
    ));
  }, [bioData.bioLinks]);

  const BioLinkButton = ({ logo, name, url }) => {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group transition-all duration-300"
        data-testid={`link-${name.toLowerCase()}`}
      >
        <img 
          src={logo} 
          alt={name}
          className="h-12 w-12 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
          style={{ 
            width: '48px', 
            height: '48px',
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))',
          }}
        />
      </a>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Background (if provided) */}
      {bioData.videoUrl && (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            data-testid="background-video"
          >
            <source src={bioData.videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Click to Enter Splash Screen */}
      {!hasEntered && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer transition-opacity duration-500"
          onClick={handleEnter}
          data-testid="enter-splash"
        >
          {/* Starfield on splash */}
          <div className="stars" />
          <div className="stars2" />
          <div className="stars3" />
          
          <div className="relative z-10 text-center animate-pulse">
            <p className="text-white/80 text-2xl md:text-3xl font-light tracking-widest">
              click to enter
            </p>
          </div>
        </div>
      )}

      {/* Starfield/Snow Particle Effect */}
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-6">
        {/* Discord-Style Profile Card with Live Status */}
        <div 
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          data-testid="profile-card"
        >
          <div className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white/10 shadow-lg"
                data-testid="profile-avatar"
              />
              {/* Live status indicator */}
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 border-2 border-black/50 rounded-full transition-colors duration-300"
                style={{ backgroundColor: getStatusColor(status) }}
                data-testid="status-indicator"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-lg truncate" data-testid="username">
                  {username}
                </span>
                {/* Discord Badges */}
                {badges.map((badge, index) => (
                  <img 
                    key={index}
                    src={badge.icon} 
                    alt={badge.name}
                    title={badge.name}
                    className="w-5 h-5"
                    data-testid={`badge-${index}`}
                  />
                ))}
              </div>
              <p className="text-[#b5bac1] text-sm truncate" data-testid="status">
                {loading ? 'Loading...' : getStatusText()}
              </p>
            </div>
          </div>
        </div>

        {/* Spotify Now Playing - Show below Discord card */}
        {isListeningToSpotify && spotifyData && (
          <div 
            className={`transition-all duration-1000 delay-150 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            data-testid="spotify-card"
          >
            <div className="flex items-start gap-3 min-w-[280px]">
              {/* Album Art */}
              <img 
                src={spotifyData.album_art_url} 
                alt={spotifyData.album}
                className="w-16 h-16 rounded-lg shadow-lg"
                data-testid="spotify-album-art"
              />
              
              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-green-500 font-medium">Spotify</span>
                </div>
                <p className="text-white text-sm font-medium truncate mb-1" data-testid="spotify-song">
                  {spotifyData.song}
                </p>
                <p className="text-[#b5bac1] text-xs truncate mb-2" data-testid="spotify-artist">
                  {spotifyData.artist}
                </p>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[#b5bac1] text-xs">{formatTime(currentTime)}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-1000"
                      style={{ width: `${spotifyProgress}%` }}
                    />
                  </div>
                  <span className="text-[#b5bac1] text-xs">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bio Links - Logo Only */}
        <div 
          className={`flex gap-3 transition-all duration-1000 delay-100 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {memoizedBioLinks}
        </div>
      </div>
    </div>
  );
};

export default BioLink;