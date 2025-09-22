import { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Award, Crown, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface LeaderboardProps {
  userScore: number;
  userRank: number;
}

export function Leaderboard({ userScore, userRank }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState('global');

  // Mock leaderboard data
  const globalLeaderboard = [
    { id: 1, name: 'Sarah Chen', score: 2850, streak: 15, badge: 'Food Saver Master', avatar: '' },
    { id: 2, name: 'Mike Johnson', score: 2640, streak: 12, badge: 'Waste Warrior', avatar: '' },
    { id: 3, name: 'Emma Wilson', score: 2420, streak: 8, badge: 'Green Guardian', avatar: '' },
    { id: 4, name: 'Alex Kumar', score: 2180, streak: 6, badge: 'Eco Expert', avatar: '' },
    { id: 5, name: 'You', score: userScore, streak: 4, badge: 'Rising Star', avatar: '' },
    { id: 6, name: 'Lisa Garcia', score: 1850, streak: 3, badge: 'Food Tracker', avatar: '' },
    { id: 7, name: 'David Park', score: 1620, streak: 2, badge: 'Beginner', avatar: '' },
  ];

  const friendsLeaderboard = [
    { id: 1, name: 'Sarah Chen', score: 2850, streak: 15, badge: 'Food Saver Master', avatar: '' },
    { id: 2, name: 'You', score: userScore, streak: 4, badge: 'Rising Star', avatar: '' },
    { id: 3, name: 'Lisa Garcia', score: 1850, streak: 3, badge: 'Food Tracker', avatar: '' },
    { id: 4, name: 'David Park', score: 1620, streak: 2, badge: 'Beginner', avatar: '' },
  ];

  const achievements = [
    { 
      id: 1, 
      title: 'First Steps', 
      description: 'Add your first 5 food items', 
      icon: Star, 
      completed: true, 
      progress: 100,
      points: 50
    },
    { 
      id: 2, 
      title: 'Recipe Explorer', 
      description: 'Use 5 suggested recipes', 
      icon: Award, 
      completed: true, 
      progress: 100,
      points: 75
    },
    { 
      id: 3, 
      title: 'Waste Warrior', 
      description: 'No waste for 7 consecutive days', 
      icon: Medal, 
      completed: false, 
      progress: 57,
      points: 150
    },
    { 
      id: 4, 
      title: 'Social Saver', 
      description: 'Share on social media', 
      icon: Users, 
      completed: false, 
      progress: 0,
      points: 100
    },
    { 
      id: 5, 
      title: 'Master Saver', 
      description: 'Reach 3000 points', 
      icon: Crown, 
      completed: false, 
      progress: (userScore / 3000) * 100,
      points: 300
    },
  ];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Trophy className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-muted-foreground">#{position}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Food Saver Master': return 'bg-purple-100 text-purple-800';
      case 'Waste Warrior': return 'bg-green-100 text-green-800';
      case 'Green Guardian': return 'bg-blue-100 text-blue-800';
      case 'Eco Expert': return 'bg-emerald-100 text-emerald-800';
      case 'Rising Star': return 'bg-yellow-100 text-yellow-800';
      case 'Food Tracker': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const LeaderboardList = ({ data }: { data: typeof globalLeaderboard }) => (
    <div className="space-y-3">
      {data.map((user, index) => (
        <div
          key={user.id}
          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
            user.name === 'You' 
              ? 'bg-primary/5 border-primary/20' 
              : 'hover:bg-accent'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8">
              {getRankIcon(index + 1)}
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className={user.name === 'You' ? 'font-semibold' : 'font-medium'}>
                  {user.name}
                </span>
                {user.name === 'You' && <Badge variant="outline">You</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">
                {user.streak} day streak
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{user.score.toLocaleString()} pts</div>
            <Badge className={`text-xs ${getBadgeColor(user.badge)}`}>
              {user.badge}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Your Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userScore.toLocaleString()}</div>
            <Progress value={(userScore % 1000) / 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Global Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">#{userRank}</div>
            <p className="text-xs text-muted-foreground">Out of 10,247 users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Current Streak</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">4 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>
                See how you rank against food savers worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardList data={globalLeaderboard} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Friends Leaderboard
              </CardTitle>
              <CardDescription>
                Compete with your friends and family
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardList data={friendsLeaderboard} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Achievements
              </CardTitle>
              <CardDescription>
                Unlock badges and earn points for your food-saving actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all ${
                        achievement.completed
                          ? 'bg-green-50 border-green-200'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            achievement.completed 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        <Badge variant={achievement.completed ? 'default' : 'secondary'}>
                          {achievement.points} pts
                        </Badge>
                      </div>
                      
                      {!achievement.completed && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{Math.round(achievement.progress)}%</span>
                          </div>
                          <Progress value={achievement.progress} />
                        </div>
                      )}
                      
                      {achievement.completed && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Star className="h-4 w-4" />
                          <span>Completed!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}