"use client"
import React, { useState, useEffect, use } from 'react';
import { X, Award, Trophy, Flame, DollarSign, Users, Code, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { 
  loadAchievementsStart,
  loadAchievementsSuccess,
  claimAchievementSuccess,
  claimAllAchievementsSuccess,
  achievementsFailure
} from '@/lib/redux/slices/achievements';
import api from '@/utils/axiosConfig';
import { Achievements } from '@/constants/achievements';

export default function AchievementPage({params}) {
  const { userName } = use(params);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useAppDispatch();
  const { jwtToken, userData } = useAppSelector((state) => state.auth);
  const {
    unlocked,
    claimed,
    totalXP,
    unclaimed,
    isLoading
  } = useAppSelector((state) => state.achievements);
  const isOwner = userData?.userName === userName

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    fetchUser();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if(user){
      fetchunlocked();
    }
  },[user]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/get-user/${userName}`);
      setUser(response.data.user);
    } catch (err) {
      toast.error(err.message)
    }
  }

  const fetchunlocked = async () => {
    try {
      dispatch(loadAchievementsStart());
      const response = await api.get(`/get-unlocked-achievements/${user?._id}/${user?.role}`);
      dispatch(loadAchievementsSuccess(response.data));
    } catch (error) {
      dispatch(achievementsFailure(error.response?.data?.error || "Failed to fetch achievements"));
      toast.error(error.response?.data?.error || "Failed to fetch achievements");
    }
  };

  const handleClaimAchievement = async (achievementKey) => {
    const achievement = Achievements.find(a => a.key === achievementKey);
    
    toast.promise(
      api.post(`/claim-achievement-xp/${achievementKey}`, {}, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      }),
      {
        loading: 'Claiming XP...',
        success: ({ data }) => {
          dispatch(claimAchievementSuccess({
            key: achievementKey,
            xp: achievement.xp
          }));
          return `Claimed ${data.claimedXP.xpEarned} XP`;
        },
        error: (error) => error.response?.data?.error || "Failed to claim XP"
      }
    );
  };

  const handleClaimAllAchievements = async () => {
    const totalXP = unclaimed.reduce((sum, key) => {
      const achievement = Achievements.find(a => a.key === key);
      return sum + (achievement?.xp || 0);
    }, 0);

    toast.promise(
      api.post('/claim-all-xp', {}, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      }),
      {
        loading: 'Claiming all XP...',
        success: () => {
          dispatch(claimAllAchievementsSuccess({
            keys: unclaimed,
            xp: totalXP
          }));
          return `Claimed ${totalXP} XP from all achievements`;
        },
        error: (error) => error.response?.data?.error || "Failed to claim all XP"
      }
    );
  };

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const closeModal = () => {
    setSelectedAchievement(null);
  };

  const earnedCount = Achievements.filter(achievement => 
    unlocked.includes(achievement.key)
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
            {isOwner && "Your"} Achievements
          </h1>
          <p className="text-muted-foreground mb-6">
            Unlock achievements by being active in the Snipost community
          </p>
          
          <div className="flex justify-center flex-wrap sm:flex-nowrap gap-8 mb-8">
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

          {unclaimed.length > 0 && (
            <div className="mb-6">
              {(isOwner) && (<Button 
                variant="default"
                onClick={handleClaimAllAchievements}
              >
                Claim All {unclaimed.length} Achievements
              </Button>)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Achievements.map((achievement) => (
            <AchievementCard
              key={achievement.key}
              achievement={achievement}
              isEarned={unlocked.includes(achievement.key)}
                isClaimed={claimed.includes(achievement.key)}
              onClick={() => handleAchievementClick(achievement)}
              onClaim={(e) => {
                e.stopPropagation();
                handleClaimAchievement(achievement.key);
              }}
              userName={userName}
              authUserName={userData?._id}
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
                
                {(isOwner) && (unlocked.includes(selectedAchievement.key) && 
                  (claimed.includes(selectedAchievement.key) ? 
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
                  </Button>))
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
                
                {(isOwner) && (unlocked.includes(selectedAchievement.key) && 
                  (claimed.includes(selectedAchievement.key) ? 
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
                    </Button>))
                }
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

const AchievementCard = ({ achievement, isEarned, isClaimed, onClick, onClaim, userName, authUserName }) => {
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
            
            {(userName === authUserName) && (isEarned && 
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
              </Button>)
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