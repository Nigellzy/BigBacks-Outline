"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, DollarSign, Leaf, Target, Calendar, Award, BarChart3 } from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate: string
  daysLeft: number
}

interface AnalyticsDashboardProps {
  inventory: InventoryItem[]
}

// Mock data for charts
const wasteReductionData = [
  { month: "Jul", wasteReduced: 45, moneySaved: 28 },
  { month: "Aug", wasteReduced: 52, moneySaved: 32 },
  { month: "Sep", wasteReduced: 61, moneySaved: 38 },
  { month: "Oct", wasteReduced: 68, moneySaved: 42 },
  { month: "Nov", wasteReduced: 75, moneySaved: 46 },
  { month: "Dec", wasteReduced: 82, moneySaved: 51 },
  { month: "Jan", wasteReduced: 85, moneySaved: 55 },
]

const categoryData = [
  { name: "Vegetables", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Fruits", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Dairy", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Meat", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Grains", value: 8, color: "hsl(var(--chart-5))" },
]

const weeklyUsageData = [
  { day: "Mon", used: 12, wasted: 2 },
  { day: "Tue", used: 15, wasted: 1 },
  { day: "Wed", used: 18, wasted: 3 },
  { day: "Thu", used: 14, wasted: 1 },
  { day: "Fri", used: 20, wasted: 2 },
  { day: "Sat", used: 16, wasted: 1 },
  { day: "Sun", used: 13, wasted: 2 },
]

const singaporeComparisonData = [
  { metric: "Food Waste Reduction", you: 85, singapore: 45 },
  { metric: "Money Saved Monthly", you: 55, singapore: 25 },
  { metric: "Eco Points Earned", you: 1250, singapore: 650 },
]

export function AnalyticsDashboard({ inventory }: AnalyticsDashboardProps) {
  // Calculate real-time stats from inventory
  const totalItems = inventory.length
  const expiredItems = inventory.filter((item) => item.daysLeft <= 0).length
  const expiringItems = inventory.filter((item) => item.daysLeft > 0 && item.daysLeft <= 3).length

  const categoryBreakdown = inventory.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey.includes("money") || entry.dataKey.includes("Saved")
                ? " SGD"
                : entry.dataKey.includes("waste") || entry.dataKey.includes("Reduced")
                  ? "%"
                  : ""}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-primary">85%</p>
                <p className="text-xs text-muted-foreground">Waste Reduced</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span className="text-primary">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Money Saved</p>
                <p className="text-2xl font-bold text-primary">S$55</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span className="text-primary">+S$9 from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eco Impact</p>
                <p className="text-2xl font-bold text-primary">2.4kg</p>
                <p className="text-xs text-muted-foreground">CO₂ Saved</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Equivalent to 12km drive</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goal Progress</p>
                <p className="text-2xl font-bold text-primary">85%</p>
                <p className="text-xs text-muted-foreground">Monthly Target</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Waste Reduction Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Waste Reduction Progress
                </CardTitle>
                <CardDescription>Your monthly waste reduction and money saved over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={wasteReductionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="wasteReduced"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      name="Waste Reduced (%)"
                    />
                    <Area
                      type="monotone"
                      dataKey="moneySaved"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.2}
                      name="Money Saved (SGD)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Usage Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Usage Pattern
                </CardTitle>
                <CardDescription>Items used vs wasted throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyUsageData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="used" fill="hsl(var(--primary))" name="Items Used" />
                    <Bar dataKey="wasted" fill="hsl(var(--destructive))" name="Items Wasted" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Food Category Breakdown</CardTitle>
                <CardDescription>Distribution of items in your inventory by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Waste reduction rate by food category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-muted-foreground">{85 + index * 2}%</span>
                    </div>
                    <Progress value={85 + index * 2} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Singapore Comparison
              </CardTitle>
              <CardDescription>See how you compare to the average Singaporean household</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {singaporeComparisonData.map((item, index) => (
                  <div key={item.metric} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.metric}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="secondary">
                          You: {item.you}
                          {item.metric.includes("Money") ? " SGD" : item.metric.includes("Points") ? "" : "%"}
                        </Badge>
                        <Badge variant="outline">
                          SG Avg: {item.singapore}
                          {item.metric.includes("Money") ? " SGD" : item.metric.includes("Points") ? "" : "%"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">You</div>
                        <Progress value={(item.you / Math.max(item.you, item.singapore)) * 100} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Singapore Average</div>
                        <Progress
                          value={(item.singapore / Math.max(item.you, item.singapore)) * 100}
                          className="h-2 [&>div]:bg-muted-foreground"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-primary font-medium">
                      You're {Math.round(((item.you - item.singapore) / item.singapore) * 100)}% better than average! 🎉
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Milestones you've reached in your food waste reduction journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">Eco Warrior</p>
                <p className="text-xs text-muted-foreground">Reduced waste by 80%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
              <div className="w-10 h-10 bg-chart-2 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">Money Saver</p>
                <p className="text-xs text-muted-foreground">Saved S$50+ this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-chart-3/10 rounded-lg">
              <div className="w-10 h-10 bg-chart-3 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">Consistency King</p>
                <p className="text-xs text-muted-foreground">7 days streak</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
