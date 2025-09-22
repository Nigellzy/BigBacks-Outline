import { useState } from 'react';
import { User, Mail, Calendar, DollarSign, TrendingUp, Save, Edit2, Award, Target, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface UserProfile {
  name: string;
  email: string;
  streakDays: number;
  totalSaved: number;
  wasteReduction: number;
}

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  userScore: number;
  onBack?: () => void;
}

export function Profile({ userProfile, onUpdateProfile, userScore, onBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userProfile);

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  const achievements = [
    { 
      name: 'First Steps', 
      description: 'Added first food item', 
      completed: true, 
      icon: '🎯',
      points: 50 
    },
    { 
      name: 'Week Warrior', 
      description: '7-day waste-free streak', 
      completed: userProfile.streakDays >= 7, 
      icon: '🔥',
      points: 100 
    },
    { 
      name: 'Money Saver', 
      description: 'Saved $100+', 
      completed: userProfile.totalSaved >= 100, 
      icon: '💰',
      points: 150 
    },
    { 
      name: 'Eco Champion', 
      description: '80% waste reduction', 
      completed: userProfile.wasteReduction >= 80, 
      icon: '🌱',
      points: 200 
    },
  ];

  const nextLevelScore = Math.ceil(userScore / 1000) * 1000;
  const progressToNext = ((userScore % 1000) / 1000) * 100;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Back Button Header */}
      {onBack && (
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      )}

      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 primary-gradient opacity-10"></div>
        <CardContent className="relative pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl">{userProfile.name}</h1>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {userProfile.email}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <Badge variant="secondary" className="accent-gradient">
                      🔥 {userProfile.streakDays} day streak
                    </Badge>
                    <Badge variant="outline">
                      Level {Math.floor(userScore / 1000) + 1}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Score</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userScore.toLocaleString()}</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Level {Math.floor(userScore / 1000) + 1}</span>
                <span>{nextLevelScore.toLocaleString()}</span>
              </div>
              <Progress value={progressToNext} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Money Saved</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${userProfile.totalSaved.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Waste Reduction</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userProfile.wasteReduction}%</div>
            <p className="text-xs text-muted-foreground">Food saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Current Streak</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userProfile.streakDays}</div>
            <p className="text-xs text-muted-foreground">Days waste-free</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <CardDescription>
            Your food-saving milestones and badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${achievement.completed ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${achievement.completed ? 'text-green-800' : 'text-gray-600'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${achievement.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={achievement.completed ? 'default' : 'secondary'}
                      className={achievement.completed ? 'primary-gradient' : ''}
                    >
                      {achievement.points}pts
                    </Badge>
                    {achievement.completed && (
                      <p className="text-xs text-green-600 mt-1">✓ Completed</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Monthly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Save $200 this month</span>
              <span className="text-sm text-muted-foreground">
                ${userProfile.totalSaved.toFixed(0)} / $200
              </span>
            </div>
            <Progress value={(userProfile.totalSaved / 200) * 100} />
          </div>
          
          <Separator />
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Reach 90% waste reduction</span>
              <span className="text-sm text-muted-foreground">
                {userProfile.wasteReduction}% / 90%
              </span>
            </div>
            <Progress value={(userProfile.wasteReduction / 90) * 100} />
          </div>
          
          <Separator />
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Maintain 30-day streak</span>
              <span className="text-sm text-muted-foreground">
                {userProfile.streakDays} / 30 days
              </span>
            </div>
            <Progress value={(userProfile.streakDays / 30) * 100} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}