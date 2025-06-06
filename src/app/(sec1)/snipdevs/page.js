"use client"
import React, { useEffect, useState } from 'react'
import { 
  Users, 
  Code, 
  Trophy, 
  Star, 
  GitFork, 
  MessageCircle, 
  BookOpen, 
  Target,
  Crown,
  Award,
  Zap,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import api from '@/utils/axiosConfig';
import { toast } from 'sonner';

const getRankGradient = (title) => { 
  switch (title) { 
    case "Cadet": 
      return "from-gray-800 via-gray-700 to-slate-600 border-gray-500 hover:border-gray-400 shadow-gray-400/50 bg-gradient-to-br"; 
    case "Contributor": 
      return "from-emerald-600 via-teal-500 to-cyan-400 border-teal-400 hover:border-cyan-300 shadow-cyan-400/60 bg-gradient-to-br"; 
    case "Builder": 
      return "from-blue-600 via-indigo-500 to-purple-400 border-indigo-400 hover:border-purple-300 shadow-purple-400/60 bg-gradient-to-br"; 
    case "Explorer": 
      return "from-violet-600 via-purple-500 to-fuchsia-400 border-purple-400 hover:border-fuchsia-300 shadow-fuchsia-400/60 bg-gradient-to-br"; 
    case "Innovator": 
      return "from-fuchsia-600 via-pink-500 to-rose-400 border-pink-400 hover:border-rose-300 shadow-rose-400/70 bg-gradient-to-br"; 
    case "Strategist": 
      return "from-orange-600 via-amber-500 to-yellow-400 border-amber-400 hover:border-yellow-300 shadow-yellow-400/70 bg-gradient-to-br"; 
    case "Architect": 
      return "from-red-600 via-orange-500 to-amber-400 border-primary hover:border-amber-300 shadow-amber-400/80 bg-gradient-to-br"; 
    case "Mentor": 
      return "from-indigo-600 via-blue-500 to-cyan-300 border-blue-400 hover:border-cyan-200 shadow-cyan-300/80 bg-gradient-to-br"; 
    case "Visionary": 
      return "from-purple-700 via-fuchsia-600 to-pink-400 border-fuchsia-500 hover:border-pink-300 shadow-pink-400/90 bg-gradient-to-br"; 
    case "Icon": 
      return "from-yellow-500 via-primary to-red-400 border-primary hover:border-yellow-300 shadow-primary/100 shadow-2xl bg-gradient-to-br animate-bounce"; 
    default: 
      return "from-gray-800 via-gray-700 to-slate-600 border-gray-500 hover:border-gray-400 shadow-gray-400/50 bg-gradient-to-br"; 
  } 
};

const getRankIcon = (title) => {
  switch (title) {
    case "Cadet":
      return <Target className="w-4 h-4" />;
    case "Contributor":
      return <Code className="w-4 h-4" />;
    case "Builder":
      return <GitFork className="w-4 h-4" />;
    case "Explorer":
      return <BookOpen className="w-4 h-4" />;
    case "Innovator":
      return <Zap className="w-4 h-4" />;
    case "Strategist":
      return <Star className="w-4 h-4" />;
    case "Architect":
      return <Award className="w-4 h-4" />;
    case "Mentor":
      return <Users className="w-4 h-4" />;
    case "Visionary":
      return <Trophy className="w-4 h-4" />;
    case "Icon":
      return <Crown className="w-4 h-4" />;
    default:
      return <Target className="w-4 h-4" />;
  }
};

const DevRanks = [
  { title: "Cadet", threshold: 0, multiplier: 1.0 },
  { title: "Contributor", threshold: 600, multiplier: 1.05 },
  { title: "Builder", threshold: 1400, multiplier: 1.10 },
  { title: "Explorer", threshold: 2800, multiplier: 1.15 },
  { title: "Innovator", threshold: 5000, multiplier: 1.20 },
  { title: "Strategist", threshold: 7500, multiplier: 1.25 },
  { title: "Architect", threshold: 10500, multiplier: 1.30 },
  { title: "Mentor", threshold: 14000, multiplier: 1.35 },
  { title: "Visionary", threshold: 19000, multiplier: 1.40 },
  { title: "Icon", threshold: 25000, multiplier: 1.50 },
];

const DeveloperCard = ({ user }) => {
  const { userData } = useAppSelector((state) => state.auth);
  const isCurrentUser = userData?._id === user._id;

  // Calculate rank based on XP
  const getRankFromXP = (xp) => {
    if (xp >= DevRanks[8].threshold) return 'Icon';
    if (xp >= DevRanks[7].threshold) return 'Visionary';
    if (xp >= DevRanks[6].threshold) return 'Mentor';
    if (xp >= DevRanks[5].threshold) return 'Architect';
    if (xp >= DevRanks[4].threshold) return 'Strategist';
    if (xp >= DevRanks[3].threshold) return 'Innovator';
    if (xp >= DevRanks[2].threshold) return 'Explorer';
    if (xp >= DevRanks[1].threshold) return 'Builder';
    if (xp >= DevRanks[0].threshold) return 'Contributor';
    return 'Cadet';
  };

  const userRank = getRankFromXP(user.xp || 0);

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-border">
                <AvatarImage 
                  src={user.avatar?.url || "/default_avatar.png"} 
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className=" items-center gap-2 mb-1">
                <Link href={`/profile/${user._id}`}>
                  <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer">
                    {user.name || 'Anonymous Developer'}
                  </CardTitle>
                </Link>
                {user.userName && (
                  <div className="text-[11px] text-muted-foreground">@{user.userName}</div>
                )}
                {isCurrentUser && (
                  <Badge variant="secondary" className="text-xs">You</Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {user.about || user.position || 'Building the future of Web3 development'}
              </p>
              
              {/* Rank Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white ${getRankGradient(userRank)} border-2 shadow-lg`}>
                {getRankIcon(userRank)}
                <span>{userRank}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                🤼
                Followers
              </span>
              <span className="font-semibold">{user.followers?.length || 0}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                🤝
                Following
              </span>
              <span className="font-semibold">{user.following?.length || 0}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                🏅
                Achievements
              </span>
              <span className="font-semibold">{user.achievements?.length || 0}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                🔥
                Streak
              </span>
              <span className="font-semibold">{user.streak?.count || 0}</span>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          {/* <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Trophy className="w-3 h-3" />
              XP
            </div>
            <div className="font-semibold text-sm">{(user.xp).toFixed(2) || 0}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Award className="w-3 h-3" />
              Achievements
            </div>
            <div className="font-semibold text-sm">{user.achievements?.length || 0}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Star className="w-3 h-3" />
              Plan
            </div>
            <div className="font-semibold text-xs">{user.subscription?.plan || 'FREE'}</div>
          </div> */}
        </div>

        {/* Skills/Technologies */}
        {user.followedTags && user.followedTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Followed Tags</h4>
            <div className="flex flex-wrap gap-1">
              {user.followedTags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {user.followedTags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{user.followedTags.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {user.socialLinks && user.socialLinks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Social Links</h4>
            <div className="flex flex-wrap gap-1">
              {user.socialLinks.slice(0, 3).map((social, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {social.platform}
                </Badge>
              ))}
              {user.socialLinks.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{user.socialLinks.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/profile/${user._id}`} className="flex-1">
            <Button variant="outline" className="w-full text-sm">
              View Profile
            </Button>
          </Link>
          
          {user.achievements && user.achievements.length > 0 && (
            <Link href={`/profile/${user._id}/achievements`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Trophy className="w-4 h-4" />
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          )}
        </div>

        {/* Achievement Preview */}
        {user.achievements && user.achievements.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Latest Achievement</span>
              <Badge variant="outline" className="text-xs">
                {user.achievements.length} total
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{user.achievements[user.achievements.length - 1]?.title || 'Achievement Unlocked'}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DevelopersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank'); // 'rank', 'xp', 'followers', 'snippets'
  const { jwtToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/get-all-users', {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load developers');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedUsers = users
    .filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.about?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'xp':
          return (b.xp || 0) - (a.xp || 0);
        case 'followers':
          return (b.followers?.length || 0) - (a.followers?.length || 0);
        case 'achievements':
          return (b.achievements?.length || 0) - (a.achievements?.length || 0);
        default: // rank
          const getRankValue = (xp) => {
            if (xp >= 10000) return 10;
            if (xp >= 5000) return 9;
            if (xp >= 3000) return 8;
            if (xp >= 2000) return 7;
            if (xp >= 1500) return 6;
            if (xp >= 1000) return 5;
            if (xp >= 600) return 4;
            if (xp >= 300) return 3;
            if (xp >= 100) return 2;
            return 1;
          };
          return getRankValue(b.xp || 0) - getRankValue(a.xp || 0);
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading developers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-50% to-purple-600 bg-clip-text text-transparent">
          SnipPost Developers
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Discover talented Web3 developers, contributors, and innovators building the future of decentralized development
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{users.length} Developers</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>{users.reduce((sum, user) => sum + (user.xp || 0), 0).toLocaleString()} Total XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>{users.reduce((sum, user) => sum + (user.achievements?.length || 0), 0)} Achievements</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search developers by name, bio, or rank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="rank">Sort by Rank</option>
          <option value="xp">Sort by XP</option>
          <option value="followers">Sort by Followers</option>
          <option value="achievements">Sort by Achievements</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredAndSortedUsers.length} of {users.length} developers
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredAndSortedUsers.map((user) => (
          <DeveloperCard key={user._id} user={user} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No developers found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'No developers available at the moment'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DevelopersPage;