"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { markProfilePromptShown } from '@/lib/redux/slices/notifications';
import { X, RocketIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axiosConfig';

export function ProfilePrompt() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { hasShownProfilePrompt = false } = useAppSelector((state) => state.notifications ?? {});
  const { jwtToken } = useAppSelector((state) => state.auth);

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [achievementOpen, setAchievementOpen] = useState(false);

  useEffect(() => {
    api.get('/me',{
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.error('Failed to fetch user:', err);
      });
  }, []);

  useEffect(() => {
    if (!user) return;

    const needsProfileCompletion = !user.about && (!user.socialLinks || !user.socialLinks.length) && (!user.followedTags || !user.followedTags.length);

    if (!hasShownProfilePrompt && needsProfileCompletion) {
      const timers = [
        setTimeout(() => {
          setProfileOpen(true);
          dispatch(markProfilePromptShown());
        }, 4000),
        setTimeout(() => setAchievementOpen(true), 2000)
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [user, hasShownProfilePrompt, dispatch]);

  if (!user) return null;

  return (
    <div className="fixed left-4 bottom-4 z-50 w-[350px] space-y-4">
      {profileOpen && (
        <PromptCard 
          icon={<RocketIcon className="h-4 w-4 text-primary" />}
          title="Complete your profile"
          description="Add more details to unlock full features and connect with the community"
          accentColor="bg-primary"
          onClose={() => setProfileOpen(false)}
          action={{
            label: "Complete Profile",
            onClick: () => router.push('/account/settings')
          }}
        />
      )}

      {achievementOpen && (
        <PromptCard 
          icon={<span className="text-lg">🏅</span>}
          title="Check your achievements"
          description="Discover what you've accomplished and see what's next to unlock"
          accentColor="bg-yellow-500"
          onClose={() => setAchievementOpen(false)}
          action={{
            label: "View Achievements",
            onClick: () => router.push(`/profile/${user._id}/achievements`)
          }}
        />
      )}
    </div>
  );
}

const PromptCard = ({
  icon,
  title,
  description,
  accentColor,
  onClose,
  action
}) => (
  <div className="relative rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-left-8 duration-300">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
          accentColor.includes('yellow') 
            ? 'bg-yellow-100 dark:bg-yellow-900/30' 
            : 'bg-primary/10'
        }`}>
          {icon}
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 -mt-1 -mr-1"
        onClick={onClose}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
    <p className="text-sm text-muted-foreground mb-4 ml-10">{description}</p>
    <div className="ml-10">
      <Button size="sm" className="w-full" onClick={action.onClick}>
        {action.label}
      </Button>
    </div>
    <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} rounded-l-lg`} />
  </div>
);
