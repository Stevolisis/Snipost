"use client"
import React, { useState, useEffect } from 'react';
import { X, Award, Trophy, Flame, DollarSign, Users, Code, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import api from '@/utils/axiosConfig';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/redux/hooks';

const Achievements = [
  // Snippet Achievements (13)
  {
    key: "first_snip",
    title: "🏅 First Snip",
    description: "You posted your first snippet!",
    xp: 35,
    category: "snippet"
  },
  {
    key: "active_poster",
    title: "🏅 Active Poster",
    description: "10 snippets posted!",
    xp: 100,
    category: "snippet"
  },
  {
    key: "upvoted_author",
    title: "🏅 Upvoted Author",
    description: "15 snippets with 15+ upvotes!",
    xp: 150,
    category: "snippet"
  },
  {
    key: "snippet_veteran",
    title: "🏅 Snippet Veteran",
    description: "50 public snippets!",
    xp: 200,
    category: "snippet"
  },
  {
    key: "fork_smith",
    title: "🏅 Fork Smith",
    description: "Forked 5 different snippets with each having 15+ upvotes",
    xp: 200,
    category: "snippet"
  },
  {
    key: "top_snip",
    title: "🏅 Top Snip",
    description: "50+ upvotes on a snippet!",
    xp: 120,
    category: "snippet"
  },
  {
    key: "forked_favorite",
    title: "🏅 Forked Favorite",
    description: "A single snippet forked 10+ times by others",
    xp: 200,
    category: "snippet"
  },
  {
    key: "tip_jar",
    title: "🏅 Tip Jar",
    description: "Receive tips on 3 different snippets",
    xp: 150,
    category: "snippet"
  },
  {
    key: "rising_snip",
    title: "🏅 Rising Snip",
    description: "One snippet gets 100+ upvotes",
    xp: 160,
    category: "snippet"
  },
  {
    key: "popular_creator",
    title: "🏅 Popular Creator",
    description: "One snippet gets 1000+ upvotes",
    xp: 230,
    category: "snippet"
  },
  {
    key: "viral_snip",
    title: "🏅 Viral Snip",
    description: "One snippet gets 10000+ upvotes",
    xp: 1000,
    category: "snippet"
  },
  {
    key: "js_commander",
    title: "🛠️ JS Commander",
    description: "10 JS/TS snippets with 5+ upvotes",
    xp: 150,
    category: "snippet"
  },
  {
    key: "rust_commander",
    title: "🛠️ Rust Commander",
    description: "10 Rust snippets with 5+ upvotes",
    xp: 150,
    category: "snippet"
  },

  // Comment Achievements (7)
  {
    key: "first_comment",
    title: "🏅 First Comment",
    description: "You posted your first comment!",
    xp: 30,
    category: "comment"
  },
  {
    key: "early_feedback",
    title: "🏅 Early Feedback",
    description: "First to comment on 5 snippets",
    xp: 100,
    category: "comment"
  },
  {
    key: "helpful_voice",
    title: "🏅 Helpful Voice",
    description: "One comment gets 10+ upvotes",
    xp: 100,
    category: "comment"
  },
  {
    key: "respected_insight",
    title: "🏅 Respected Insight",
    description: "A comment got 100+ upvotes!",
    xp: 300,
    category: "comment"
  },
  {
    key: "comment_legend",
    title: "🏅 Comment Legend",
    description: "A comment got 1000+ upvotes!",
    xp: 300,
    category: "comment"
  },
  {
    key: "community_helper",
    title: "🏅 Community Helper",
    description: "Post 25 comments on different snippets",
    xp: 300,
    category: "comment"
  },
  {
    key: "trusted_by_devs",
    title: "🏅 Trusted by Devs",
    description: "Receive replies from 10 different users",
    xp: 150,
    category: "comment"
  },

  // Engagement Achievements (4)
  {
    key: "30_day_flame",
    title: "🔥 30-Day Flame",
    description: "Engage daily for 30 days",
    xp: 400,
    category: "engagement"
  },
  {
    key: "100_day_flame",
    title: "🔥 100-Day Flame",
    description: "Engage daily for 100 days",
    xp: 700,
    category: "engagement"
  },
  {
    key: "500_day_flame",
    title: "🔥 500-Day Flame",
    description: "Engage daily for 500 days",
    xp: 1000,
    category: "engagement"
  },
  {
    key: "tipper",
    title: "💰 Tipper",
    description: "Tip 10 different users",
    xp: 100,
    category: "engagement"
  },

  // Profile & Social Achievements (8)
  {
    key: "complete_profile",
    title: "🏅 Complete Profile",
    description: "Add GitHub and Twitter Link, About, followedTags",
    xp: 50,
    category: "social"
  },
  {
    key: "og_snipper",
    title: "🏅 OG Snipper",
    description: "Join as one of the first 100 users",
    xp: 150,
    category: "social"
  },
  {
    key: "first_follower",
    title: "🏅 First Follower",
    description: "Gain your first follower",
    xp: 50,
    category: "social"
  },
  {
    key: "audience_builder",
    title: "🏅 Audience Builder",
    description: "Reach 20 followers",
    xp: 180,
    category: "social"
  },
  {
    key: "dev_to_watch",
    title: "🏅 Dev to Watch",
    description: "Reach 50 followers",
    xp: 250,
    category: "social"
  },
  {
    key: "trusted_voice",
    title: "🏅 Trusted Voice",
    description: "Reach 100 followers",
    xp: 400,
    category: "social"
  },
  {
    key: "influential_dev",
    title: "🏅 Influential Dev",
    description: "Reach 1000 followers",
    xp: 700,
    category: "social"
  },
  {
    key: "featured_builder",
    title: "🏅 Featured Builder",
    description: "Get featured on homepage",
    xp: 700,
    category: "social"
  }
];


export default function AchievementPage() {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userAchievements, setUserAchievements] = useState(new Set());
  const [totalXP, setTotalXP] = useState(0);
  const [unclaimedAchievements, setUnclaimedAchievements] = useState([]);
  const { jwtToken } = useAppSelector((state) => state.auth)
    const [claimedAchievements, setClaimedAchievements] = useState(new Set());

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    fetchUserAchievements();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const fetchUserAchievements = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/get-unlocked-achievements',{
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      const { achievements } = response.data;
      
    // Track both earned and claimed status
    const earnedKeys = new Set();
    const claimedKeys = new Set();
    
    achievements.forEach(a => {
      earnedKeys.add(a.key);
      if (a.claimed) claimedKeys.add(a.key);
    });
    
    setUserAchievements(earnedKeys);
    setClaimedAchievements(claimedKeys); // Add this new state
    setTotalXP(achievements.reduce((sum, a) => sum + (a.claimed ? a.xp : 0), 0));
    
    const unclaimed = achievements
      .filter(a => !a.claimed)
      .map(a => a.key);
    setUnclaimedAchievements(unclaimed);
      
    } catch (error) {
      toast.success("Error", error.response?.data?.error || "Failed to fetch achievements");
      console.error("Error fetching achievements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimAchievement = async (achievementKey) => {
    try {
      const response = await api.post(`/claim-achievement-xp/${achievementKey}`,{},{
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      const { claimedXP } = response.data;
      
      toast.success("Success!",`Claimed ${claimedXP} XP`);
      
      await fetchUserAchievements();
      
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to claim XP");
      console.error("Error claiming achievement:", error);
    }
  };

  const handleClaimAllAchievements = async () => {
    try {
      const response = await api.post('/claim-all-xp',{},{
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      const { claimAllXp } = response.data;
      
      toast.success("Success!",`Claimed ${claimAllXp} XP from all achievements`);
      
      await fetchUserAchievements();
      
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to claim all XP");
      console.error("Error claiming all achievements:", error);
    }
  };

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const closeModal = () => {
    setSelectedAchievement(null);
  };

  const earnedCount = Achievements.filter(achievement => 
    userAchievements.has(achievement.key)
  ).length;

  if (isLoading) {
    return (
      <div className="w-full px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto mb-6" />
            <div className="flex justify-center gap-8">
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Your Achievements
          </h1>
          <p className="text-muted-foreground mb-6">
            Unlock achievements by being active in the Snipost community
          </p>
          
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{earnedCount}</div>
              <div className="text-sm text-muted-foreground">Eligible</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{Achievements.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalXP.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
            </div>
          </div>

          {unclaimedAchievements.length > 0 && (
            <div className="mb-6">
              <Button 
                variant="default"
                onClick={handleClaimAllAchievements}
                className="bg-green-600 hover:bg-green-700"
              >
                Claim All {unclaimedAchievements.length} Achievements
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Achievements.map((achievement) => (
            <AchievementCard
              key={achievement.key}
              achievement={achievement}
              isEarned={userAchievements.has(achievement.key)}
                isClaimed={claimedAchievements.has(achievement.key)}
              onClick={() => handleAchievementClick(achievement)}
              onClaim={(e) => {
                e.stopPropagation();
                handleClaimAchievement(achievement.key);
              }}
            />
          ))}
        </div>

        {/* Desktop Dialog */}
        <Dialog open={!!selectedAchievement && !isMobile} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="text-4xl">{selectedAchievement?.title.split(' ')[0]}</div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedAchievement && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {selectedAchievement.title.substring(2)}
                  </h3>
                  <p className="text-muted-foreground">{selectedAchievement.description}</p>
                </div>
                
                <div className="flex items-center justify-center gap-6 py-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">+{selectedAchievement.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getCategoryIcon(selectedAchievement.category)}
                    <span className="capitalize">{selectedAchievement.category}</span>
                  </div>
                </div>
                
                {userAchievements.has(selectedAchievement.key) && 
                  (claimedAchievements.has(selectedAchievement.key) ? 
                  <Button 
                    className="w-full"
                    variant="outline"
                  >
                    Claimed
                  </Button> : 
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      await handleClaimAchievement(selectedAchievement.key);
                      closeModal();
                    }}
                  >
                    Claim +{selectedAchievement.xp} XP
                  </Button>)
                }
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Mobile Drawer */}
        <Drawer open={!!selectedAchievement && isMobile} onOpenChange={closeModal}>
          <DrawerContent>
            <DrawerHeader>
              <div className="text-center">
                <div className="text-4xl mb-2">{selectedAchievement?.title.split(' ')[0]}</div>
                <DrawerTitle className="text-xl font-bold text-foreground">
                  {selectedAchievement?.title.substring(2)}
                </DrawerTitle>
              </div>
            </DrawerHeader>
            
            {selectedAchievement && (
              <div className="space-y-4 px-4 pb-4">
                <p className="text-muted-foreground text-center">{selectedAchievement.description}</p>
                
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Trophy className="w-4 h-4" />
                    <span className="font-semibold">+{selectedAchievement.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getCategoryIcon(selectedAchievement.category)}
                    <span className="capitalize">{selectedAchievement.category}</span>
                  </div>
                </div>
                
                {userAchievements.has(selectedAchievement.key) && 
                  (claimedAchievements.has(selectedAchievement.key) ? 
                    <Button 
                        className="w-full"
                        variant="outline"
                    >
                        Claimed
                    </Button> : 
                    <Button 
                        className="w-full"
                        onClick={async () => {
                        await handleClaimAchievement(selectedAchievement.key);
                        closeModal();
                        }}
                    >
                        Claim +{selectedAchievement.xp} XP
                    </Button>)
                }
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

const AchievementCard = ({ achievement, isEarned, isClaimed, onClick, onClaim }) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md hover:border-gray-600 transition-colors duration-200 ${
        isEarned ? 'opacity-100' : 'opacity-50 grayscale'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-3xl">{achievement.title.split(' ')[0]}</div>
          <div className="flex items-center gap-1 text-muted-foreground">
            {getCategoryIcon(achievement.category)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1">
              {achievement.title.substring(2)}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {achievement.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <span>+{achievement.xp} XP</span>
            </div>
            
            {isEarned && 
              isClaimed ? 
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs border-primary text-primary hover:bg-primary/10"
              >
                Claimed
              </Button> : 
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs border-green-500 text-green-500 hover:bg-green-500/10"
                onClick={onClaim}
              >
                Claim XP
              </Button>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'snippet': return <Code className="w-4 h-4" />;
    case 'comment': return <MessageCircle className="w-4 h-4" />;
    case 'engagement': return <Flame className="w-4 h-4" />;
    case 'social': return <Users className="w-4 h-4" />;
    default: return <Award className="w-4 h-4" />;
  }
};