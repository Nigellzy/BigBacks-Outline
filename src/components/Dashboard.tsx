import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, DollarSign, TrendingUp, Search, Filter, ChefHat, SortAsc } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UseItemDialog } from './UseItemDialog';
import { EditFoodDialog } from './EditFoodDialog';

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface DashboardProps {
  foodItems: FoodItem[];
  onUseItem: (itemId: string, usedQuantity?: number) => void;
  onEditItem: (itemId: string, updatedItem: Omit<FoodItem, 'id'>) => void;
  onAddFood: () => void;
  onFindRecipe: (item: FoodItem) => void;
  userScore: number;
}

export function Dashboard({ foodItems, onUseItem, onEditItem, onAddFood, onFindRecipe, userScore }: DashboardProps) {
  const [soonToExpire, setSoonToExpire] = useState<(FoodItem & { daysLeft: number; potentialLoss: number })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('expiration');

  // Get filtered and sorted items
  const filteredItems = foodItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'expiration':
          return a.expirationDate.getTime() - b.expirationDate.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  useEffect(() => {
    const today = new Date();
    const expiringSoon = foodItems
      .map(item => {
        const daysLeft = Math.ceil((item.expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...item,
          daysLeft,
          potentialLoss: item.price
        };
      })
      .filter(item => item.daysLeft <= 7 && item.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    setSoonToExpire(expiringSoon);
  }, [foodItems]);

  const categories = [...new Set(foodItems.map(item => item.category))];
  const totalPotentialLoss = soonToExpire.reduce((sum, item) => sum + item.potentialLoss, 0);
  const expiredItems = foodItems.filter(item => {
    const daysLeft = Math.ceil((item.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft < 0;
  });

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 1) return 'destructive';
    if (daysLeft <= 3) return 'secondary';
    return 'default';
  };



  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl">Dashboard</h1>
          <p className="text-muted-foreground">Track your food inventory and reduce waste</p>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Food Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{userScore}</div>
            <Progress value={(userScore % 1000) / 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Items Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{soonToExpire.length}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Potential Loss</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${totalPotentialLoss.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">If items expire</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Items Expired</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-destructive">{expiredItems.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Food Inventory
          </CardTitle>
          <CardDescription>
            Search, filter, and manage your food items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiration">Expiration Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items found matching your criteria</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const daysLeft = Math.ceil((item.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = daysLeft <= 3 && daysLeft >= 0;
                const isExpired = daysLeft < 0;
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors ${
                      isExpired ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 
                      isExpiringSoon ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' : ''
                    }`}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-medium">{item.name}</h3>
                        <Badge variant={getUrgencyColor(daysLeft)}>
                          {daysLeft >= 0 ? `${daysLeft} days left` : `Expired ${Math.abs(daysLeft)} days ago`}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                          <span>Qty: {item.quantity} {item.unit}</span>
                          <span>{item.category}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                        <div className="font-medium text-foreground">
                          Expires: {item.expirationDate.toLocaleDateString('en-SG', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col lg:flex-row">
                      <EditFoodDialog item={item} onEditItem={onEditItem}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 sm:flex-none"
                        >
                          <span className="sm:hidden lg:inline">Edit</span>
                        </Button>
                      </EditFoodDialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onFindRecipe(item)}
                        className="flex-1 sm:flex-none"
                      >
                        <ChefHat className="h-4 w-4 sm:mr-0 lg:mr-1" />
                        <span className="sm:hidden lg:inline">Recipe</span>
                      </Button>
                      <UseItemDialog item={item} onUseItem={onUseItem}>
                        <Button size="sm" className="flex-1 sm:flex-none primary-gradient">
                          <span>Use</span>
                        </Button>
                      </UseItemDialog>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest food management actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Added 2 apples to inventory</span>
              <span className="text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-green-600">Used milk before expiration (+50 points)</span>
              <span className="text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Found 3 recipes with your ingredients</span>
              <span className="text-muted-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}