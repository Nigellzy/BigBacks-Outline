import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  price: number;
  category: string;
}

interface AnalyticsProps {
  foodItems: FoodItem[];
  wasteHistory: Array<{
    date: Date;
    itemName: string;
    value: number;
    category: string;
  }>;
  usageHistory: Array<{
    date: Date;
    itemName: string;
    value: number;
    category: string;
  }>;
}

export function Analytics({ foodItems, wasteHistory, usageHistory }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30'); // days

  // Calculate waste and spending data
  const wasteData = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));

    const filteredWaste = wasteHistory.filter(item => item.date >= cutoffDate);
    const filteredUsage = usageHistory.filter(item => item.date >= cutoffDate);

    // Group by week
    const weeklyData = new Map();
    
    [...filteredWaste, ...filteredUsage].forEach(item => {
      const weekStart = new Date(item.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, { week: weekKey, waste: 0, saved: 0, spending: 0 });
      }
      
      const week = weeklyData.get(weekKey);
      if (filteredWaste.some(w => w === item)) {
        week.waste += item.value;
      } else {
        week.saved += item.value;
      }
      week.spending += item.value;
    });

    return Array.from(weeklyData.values()).sort((a, b) => a.week.localeCompare(b.week));
  }, [wasteHistory, usageHistory, timeRange]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const categories = new Map();
    
    [...wasteHistory, ...usageHistory].forEach(item => {
      if (!categories.has(item.category)) {
        categories.set(item.category, { category: item.category, waste: 0, saved: 0, total: 0 });
      }
      
      const cat = categories.get(item.category);
      if (wasteHistory.some(w => w === item)) {
        cat.waste += item.value;
      } else {
        cat.saved += item.value;
      }
      cat.total += item.value;
    });

    return Array.from(categories.values());
  }, [wasteHistory, usageHistory]);

  // Calculate totals
  const totalWaste = wasteHistory.reduce((sum, item) => sum + item.value, 0);
  const totalSaved = usageHistory.reduce((sum, item) => sum + item.value, 0);
  const wasteReduction = totalSaved > 0 ? ((totalSaved / (totalWaste + totalSaved)) * 100) : 0;

  // Current inventory value
  const inventoryValue = foodItems.reduce((sum, item) => sum + item.price, 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your food waste patterns and savings</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Waste</CardTitle>
            <Trash2 className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-destructive">${totalWaste.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {wasteHistory.length} items wasted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Money Saved</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">${totalSaved.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {usageHistory.length} items used in time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Waste Reduction</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{wasteReduction.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Of food used before expiring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Current Inventory</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${inventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {foodItems.length} items in stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Waste vs Savings Trend</CardTitle>
              <CardDescription>
                Weekly breakdown of your food waste and money saved over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Week of ${new Date(value).toLocaleDateString()}`}
                    formatter={(value, name) => [`$${value.toFixed(2)}`, name === 'waste' ? 'Wasted' : 'Saved']}
                  />
                  <Bar dataKey="waste" fill="#ef4444" name="waste" />
                  <Bar dataKey="saved" fill="#22c55e" name="saved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Waste by Category</CardTitle>
                <CardDescription>Which food categories are wasted most</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, waste }) => waste > 0 ? `${category}: $${waste.toFixed(0)}` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="waste"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Waste vs savings by food category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={80} />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="waste" fill="#ef4444" />
                    <Bar dataKey="saved" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
              <CardDescription>
                Track your total food spending and waste patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Week of ${new Date(value).toLocaleDateString()}`}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Total Spending"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wasteReduction > 75 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-green-800">Excellent waste reduction! You're saving {wasteReduction.toFixed(1)}% of your food.</p>
                </div>
              </div>
            )}
            
            {wasteReduction < 50 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <TrendingDown className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800">Consider setting more expiration reminders to improve your {wasteReduction.toFixed(1)}% save rate.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">This Month:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Total items tracked: {foodItems.length}</li>
                  <li>• Money saved: ${totalSaved.toFixed(2)}</li>
                  <li>• Waste prevented: {usageHistory.length} items</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tips:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Check expiration dates daily</li>
                  <li>• Use recipe suggestions for expiring items</li>
                  <li>• Track items with shorter shelf lives more carefully</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}