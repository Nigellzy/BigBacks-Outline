"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Flame, Star, Crown, Zap, Leaf, DollarSign, Users, Medal, Gift } from "lucide-react"

interface UserStats {
  ecoPoints: number
  level: number
  streak: number
  rank: string
  wasteReduced: number
  moneySaved: number
  totalItems: number
}

interface GamificationDashboardProps {
  userStats: UserStats
}

// Mock data for leaderboard and achievements
const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Add your first item to inventory",
    icon: Target,
    points: 10,
    unlocked: true,
    unlockedAt: "2024-01-01",
  },
  {
    id: 2,
    title: "Waste Warrior",
    description: "Reduce food waste by 50%",
    icon: Leaf,
    points: 100,
    unlocked: true,
    unlockedAt: "2024-01-05",
  },
  {
    id: 3,
    title: "Money Saver",
    description: "Save S$50 in a month",
    icon: DollarSign,
    points: 150,
    unlocked: true,
    unlockedAt: "2024-01-10",
  },
  {
    id: 4,
    title: "Streak Master",
    description: "Maintain a 7-day streak",
    icon: Flame,
    points: 200,
    unlocked: true,
    unlockedAt: "2024-01-12",
  },
  {
    id: 5,
    title: "Eco Champion",
    description: "Reduce food waste by 80%",
    icon: Crown,
    points: 300,
    unlocked: true,
    unlockedAt: "2024-01-13",
  },
  {
    id: 6,
    title: "Recipe Explorer",
    description: "Try 10 different recipes",
    icon: Star,
    points: 250,
    unlocked: false,
    progress: 7,
    target: 10,
  },
  {
    id: 7,
    title: "Perfect Month",
    description: "Zero food waste for 30 days",
    icon: Medal,
    points: 500,
    unlocked: false,
    progress: 12,
    target: 30,
  },
  {
    id: 8,
    title: "Community Leader",
    description: "Reach top 10 in leaderboard",
    icon: Users,
    points: 400,
    unlocked: false,
    progress: 15,
    target: 10,
  },
]

const leaderboard = [
  { rank: 1, name: "Sarah Chen", points: 2450, level: 12, avatar: "SC" },
  { rank: 2, name: "Alex Wong", points: 2180, level: 11, avatar: "AW" },
  { rank: 3, name: "Maria Santos", points: 1890, level: 10, avatar: "MS" },
  { rank: 4, name: "David Lim", points: 1650, level: 9, avatar: "DL" },
  { rank: 5, name: "You", points: 1250, level: 8, avatar: "YO", isCurrentUser: true },
  { rank: 6, name: "Lisa Tan", points: 1120, level: 8, avatar: "LT" },
  { rank: 7, name: "John Kumar", points: 980, level: 7, avatar: "JK" },
  { rank: 8, name: "Emma Lee", points: 850, level: 7, avatar: "EL" },
]

const challenges = [
  {
    id: 1,
    title: "Zero Waste Week",
    description: "Don't waste any food for 7 consecutive days",
    reward: 300,
    progress: 3,
    target: 7,
    timeLeft: "4 days left",
    difficulty: "Hard",
  },
  {
    id: 2,
    title: "Recipe Master",
    description: "Cook 5 recipes using expiring ingredients",
    reward: 150,
    progress: 2,
    target: 5,
    timeLeft: "2 weeks left",
    difficulty: "Medium",
  },
  {
    id: 3,
    title: "Inventory Tracker",
    description: "Add 20 items to your inventory this week",
    reward: 100,
    progress: 12,
    target: 20,
    timeLeft: "3 days left",
    difficulty: "Easy",
  },
]

export function GamificationDashboard({ userStats }: GamificationDashboardProps) {
  const nextLevelPoints = (userStats.level + 1) * 200
  const currentLevelPoints = userStats.level * 200
  const progressToNextLevel =
    ((userStats.ecoPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Your Progress
          </CardTitle>
          <CardDescription>Keep tracking your food to level up and unlock new achievements!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">
                  Level {userStats.level} - {userStats.rank}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userStats.ecoPoints} / {nextLevelPoints} points
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Flame className="w-3 h-3" />
              {userStats.streak} day streak
            </Badge>
          </div>
          <Progress value={progressToNextLevel} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {nextLevelPoints - userStats.ecoPoints} points to Level {userStats.level + 1}
          </p>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Active Challenges
          </CardTitle>
          <CardDescription>Complete challenges to earn bonus points and unlock achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <Badge
                      variant={
                        challenge.difficulty === "Hard"
                          ? "destructive"
                          : challenge.difficulty === "Medium"
                            ? "secondary"
                            : "default"
                      }
                      className="text-xs"
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{challenge.timeLeft}</span>
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      {challenge.reward} points
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {challenge.progress} / {challenge.target}
                  </span>
                </div>
                <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unlocked Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-primary" />
              Unlocked Achievements
            </CardTitle>
            <CardDescription>
              {unlockedAchievements.length} of {achievements.length} achievements unlocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {unlockedAchievements.map((achievement) => {
              const IconComponent = achievement.icon
              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-primary">
                      +{achievement.points} points • Unlocked {achievement.unlockedAt}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Locked Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-muted-foreground" />
              Upcoming Achievements
            </CardTitle>
            <CardDescription>Keep going to unlock these achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lockedAchievements.map((achievement) => {
              const IconComponent = achievement.icon
              const progress = achievement.progress || 0
              const target = achievement.target || 1

              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg opacity-75">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">+{achievement.points} points</p>
                      {achievement.progress !== undefined && (
                        <>
                          <span className="text-xs">•</span>
                          <span className="text-xs">
                            {progress}/{target}
                          </span>
                        </>
                      )}
                    </div>
                    {achievement.progress !== undefined && (
                      <Progress value={(progress / target) * 100} className="h-1 mt-2" />
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Singapore Leaderboard
          </CardTitle>
          <CardDescription>See how you rank against other food waste warriors in Singapore</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  user.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    {user.rank <= 3 ? (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          user.rank === 1
                            ? "bg-yellow-500 text-white"
                            : user.rank === 2
                              ? "bg-gray-400 text-white"
                              : "bg-orange-600 text-white"
                        }`}
                      >
                        {user.rank}
                      </div>
                    ) : (
                      <span className="w-6 text-center text-sm font-medium text-muted-foreground">{user.rank}</span>
                    )}
                  </div>

                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {user.avatar}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${user.isCurrentUser ? "text-primary" : ""}`}>{user.name}</span>
                      {user.isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Level {user.level}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium">{user.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Keep tracking your food to climb the leaderboard!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
