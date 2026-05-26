import React, { useState, useEffect } from 'react';

const BioLink = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [discordData, setDiscordData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      username: "realhvh",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    
    // Bio Links - Official logos only, no text
    bioLinks: [
      { 
        logo: "/youtube-logo.png",
        name: "YouTube",
        url: "https://youtube.com/@YOUR_CHANNEL",
      },
      { 
        logo: "/roblox-logo.png",
        name: "Roblox",
        url: "https://www.roblox.com/users/YOUR_ID/profile",
      },
    ],
    
    // Video Background (optional)
    videoUrl: "",
  };

  // Fetch Discord status from our backend API
  const fetchDiscordStatus = async () => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/discord/user/${bioData.discordUserId}`);
      const result = await response.json();
      
      if (result.success) {
        // Merge with Lanyard data for status
        const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${bioData.discordUserId}`);
        const lanyardData = await lanyardResponse.json();
        
        // Combine bot API data (for badges) with Lanyard data (for status)
        const combinedData = {
          discord_user: {
            ...result.data,
            public_flags: result.data.public_flags
          },
          discord_status: lanyardData.success ? lanyardData.data.discord_status : 'offline',
          activities: lanyardData.success ? lanyardData.data.activities : []
        };
        
        console.log('Discord public_flags:', result.data.public_flags);
        setDiscordData(combinedData);
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
    const customStatus = activities.find(a => a.type === 4);
    
    if (customStatus && customStatus.state) {
      return customStatus.state;
    }
    
    const activity = activities.find(a => a.type === 0); // Playing
    if (activity) {
      return `Playing ${activity.name}`;
    }
    
    // Calculate last seen
    if (discordData.discord_status === 'offline') {
      return 'Offline';
    }
    
    return discordData.discord_status.charAt(0).toUpperCase() + discordData.discord_status.slice(1);
  };

  const username = discordData?.discord_user?.username || bioData.defaultProfile.username;
  const avatar = discordData?.discord_user?.avatar 
    ? `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png?size=128`
    : bioData.defaultProfile.avatar;
  const status = discordData?.discord_status || 'offline';
  // Use manual badges instead of API badges
  const badges = bioData.manualBadges || [];

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
          className="h-12 w-12 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
          style={{ 
            width: '48px', 
            height: '48px',
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.8))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))';
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-6">
        {/* Discord-Style Profile Card with Live Status */}
        <div 
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          data-testid="profile-card"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white/20"
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

        {/* Bio Links - Logo Only */}
        <div 
          className={`flex gap-6 transition-all duration-1000 delay-100 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {bioData.bioLinks.map((link, index) => (
            <BioLinkButton key={index} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BioLink;