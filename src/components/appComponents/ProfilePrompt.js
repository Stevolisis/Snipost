"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { markProfilePromptShown } from '@/lib/redux/slices/auth';
import { X, RocketIcon } from 'lucide-react';

export function ProfilePrompt() {
  const dispatch = useAppDispatch();
  const { userData, hasShownProfilePrompt } = useAppSelector((state) => state.auth);
  const [profileOpen, setProfileOpen] = useState(false);
  const [achievementOpen, setAchievementOpen] = useState(false);

  useEffect(() => {
    if (!hasShownProfilePrompt && userData) {
        let profileTimer;
        let achievementTimer;

        // Show achievement prompt after 4 seconds
        achievementTimer = setTimeout(() => {
            setAchievementOpen(true);
        }, 2000);

        if (!userData?.about && !userData.socialLinks?.length && !userData.followedTags?.length) {
            profileTimer = setTimeout(() => {
                setProfileOpen(true);
                dispatch(markProfilePromptShown());
            }, 4000);
        }

        // Cleanup timers
        return () => {
            clearTimeout(profileTimer);
            clearTimeout(achievementTimer);
        };
    }

  }, [dispatch, hasShownProfilePrompt]);
    

  return (
    <div className="fixed left-4 bottom-4 z-50 w-[350px] space-y-4">
      {/* Profile Completion Prompt */}
      {profileOpen && (
        <div className="relative rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-left-8 duration-300">
          {/* Header with icon and close button */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <RocketIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Complete your profile</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-1"
              onClick={() => setProfileOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 ml-10">
            Add more details to unlock full features and connect with the community
          </p>

          {/* Action button */}
          <div className="ml-10">
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => {
                setProfileOpen(false);
                window.location.href = '/profile/settings';
              }}
            >
              Complete Profile
            </Button>
          </div>

          {/* Border accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
        </div>
      )}

      {/* Achievement Prompt */}
      {achievementOpen && (
        <div className="relative rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-left-8 duration-300">
          {/* Header with icon and close button */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <span className="text-lg">🏅</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Check your achievements</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-1"
              onClick={() => setAchievementOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 ml-10">
            Discover what you've accomplished and see what's next to unlock
          </p>

          {/* Action button */}
          <div className="ml-10">
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => {
                setAchievementOpen(false);
                window.location.href = `/profile/${userData._id}/achievements`;
              }}
            >
              View Achievements
            </Button>
          </div>

          {/* Border accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-l-lg"></div>
        </div>
      )}
    </div>
  );
}