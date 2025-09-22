import { useState } from 'react';
import { Users, MapPin, Clock, MessageCircle, Plus, Search, Filter, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface CommunityListing {
  id: string;
  title: string;
  description: string;
  foodItems: string[];
  location: string;
  distance: number;
  expiresIn: number; // hours
  user: {
    name: string;
    avatar: string;
    rating: number;
    totalShared: number;
    email: string;
    phone: string;
  };
  category: string;
  isUrgent: boolean;
  createdAt: Date;
}

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface CommunityProps {
  foodItems: FoodItem[];
  userProfile: {
    name: string;
    email: string;
  };
}

export function Community({ foodItems, userProfile }: CommunityProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedContactUser, setSelectedContactUser] = useState<any>(null);
  const [likedListings, setLikedListings] = useState<string[]>([]);
  
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    selectedItems: [] as string[],
    location: 'Downtown Singapore'
  });

  // Sample community listings
  const [listings, setListings] = useState<CommunityListing[]>([
    {
      id: '1',
      title: 'Fresh vegetables expiring today!',
      description: 'Have some fresh lettuce, tomatoes, and carrots that I won\'t be able to use. Perfect for salads!',
      foodItems: ['Lettuce', 'Tomatoes', 'Carrots'],
      location: 'Orchard Road',
      distance: 0.8,
      expiresIn: 6,
      user: {
        name: 'Sarah Chen',
        avatar: '',
        rating: 4.8,
        totalShared: 23,
        email: 'sarah.chen@email.com',
        phone: '+65 8123 4567'
      },
      category: 'Fruits & Vegetables',
      isUrgent: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Bakery items - bread and pastries',
      description: 'Leftover bread and some pastries from my bakery visit. Still fresh and tasty!',
      foodItems: ['Sourdough Bread', 'Croissants', 'Danish Pastries'],
      location: 'Marina Bay',
      distance: 1.2,
      expiresIn: 18,
      user: {
        name: 'Mike Tan',
        avatar: '',
        rating: 4.9,
        totalShared: 31,
        email: 'mike.tan@email.com',
        phone: '+65 9234 5678'
      },
      category: 'Bakery',
      isUrgent: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Dairy products - milk and yogurt',
      description: 'Bought too much dairy products. Milk expires in 2 days, yogurt is still good for a week.',
      foodItems: ['Whole Milk', 'Greek Yogurt', 'Cheese Slices'],
      location: 'Tampines',
      distance: 2.1,
      expiresIn: 42,
      user: {
        name: 'Lisa Wong',
        avatar: '',
        rating: 4.7,
        totalShared: 18,
        email: 'lisa.wong@email.com',
        phone: '+65 8345 6789'
      },
      category: 'Dairy & Eggs',
      isUrgent: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  ]);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.foodItems.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || listing.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Fruits & Vegetables', 'Dairy & Eggs', 'Meat & Poultry', 'Bakery', 'Beverages', 'Other'];

  const handleCreateListing = () => {
    if (!newListing.title || !newListing.description || newListing.selectedItems.length === 0) {
      return;
    }

    const listing: CommunityListing = {
      id: Date.now().toString(),
      title: newListing.title,
      description: newListing.description,
      foodItems: newListing.selectedItems,
      location: newListing.location,
      distance: 0,
      expiresIn: 24,
      user: {
        name: userProfile.name,
        avatar: '',
        rating: 4.5,
        totalShared: 5,
        email: userProfile.email,
        phone: '+65 8000 0000'
      },
      category: 'Other',
      isUrgent: false,
      createdAt: new Date()
    };

    setListings(prev => [listing, ...prev]);
    setNewListing({
      title: '',
      description: '',
      selectedItems: [],
      location: 'Downtown Singapore'
    });
    setShowCreateDialog(false);
    setActiveTab('browse');
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const getExpiryColor = (hoursLeft: number) => {
    if (hoursLeft <= 12) return 'destructive';
    if (hoursLeft <= 24) return 'secondary';
    return 'default';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl">Food Community</h1>
          <p className="text-muted-foreground">Share and claim food to reduce waste together</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="primary-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Share Food
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Your Food</DialogTitle>
              <DialogDescription>
                List food items you can't use before they expire
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="listing-title">Title</Label>
                <Input
                  id="listing-title"
                  value={newListing.title}
                  onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Fresh vegetables expiring soon"
                />
              </div>
              
              <div>
                <Label htmlFor="listing-description">Description</Label>
                <Textarea
                  id="listing-description"
                  value={newListing.description}
                  onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the food items and their condition"
                  rows={3}
                />
              </div>

              <div>
                <Label>Select Food Items</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                  {foodItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={newListing.selectedItems.includes(item.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setNewListing(prev => ({
                          ...prev,
                          selectedItems: prev.selectedItems.includes(item.name)
                            ? prev.selectedItems.filter(i => i !== item.name)
                            : [...prev.selectedItems, item.name]
                        }));
                      }}
                      className="justify-start text-xs"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={newListing.location}
                  onValueChange={(value) => setNewListing(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Downtown Singapore">Downtown Singapore</SelectItem>
                    <SelectItem value="Orchard Road">Orchard Road</SelectItem>
                    <SelectItem value="Marina Bay">Marina Bay</SelectItem>
                    <SelectItem value="Tampines">Tampines</SelectItem>
                    <SelectItem value="Jurong East">Jurong East</SelectItem>
                    <SelectItem value="Woodlands">Woodlands</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateListing} className="w-full">
                Create Listing
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Listings</TabsTrigger>
          <TabsTrigger value="my-listings">My Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search for food items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
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
              </div>
            </CardContent>
          </Card>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-2">{listing.title}</CardTitle>
                      {listing.isUrgent && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {listing.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {listing.foodItems.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {listing.foodItems.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{listing.foodItems.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {listing.location} • {listing.distance}km
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {listing.expiresIn}h left
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {listing.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{listing.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ⭐ {listing.user.rating} • {listing.user.totalShared} shared
                        </p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md mx-4">
                        <DialogHeader>
                          <DialogTitle>Contact {listing.user.name}</DialogTitle>
                          <DialogDescription>
                            Reach out to arrange pickup or ask questions about the food items.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {listing.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{listing.user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ⭐ {listing.user.rating} • {listing.user.totalShared} items shared
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg">
                              <span className="text-sm font-medium">Email</span>
                              <a 
                                href={`mailto:${listing.user.email}`}
                                className="text-sm text-blue-600 hover:underline break-all"
                              >
                                {listing.user.email}
                              </a>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg">
                              <span className="text-sm font-medium">Phone</span>
                              <a 
                                href={`tel:${listing.user.phone}`}
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {listing.user.phone}
                              </a>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                            <strong>Safety reminder:</strong> Always meet in public places and trust your instincts when meeting someone new.
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Posted {formatTimeAgo(listing.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No listings found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Active Listings</CardTitle>
              <CardDescription>
                Manage your shared food items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You haven't shared any food items yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Share Your First Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-semibold text-green-600">1,247</div>
            <p className="text-sm text-muted-foreground">Items Shared</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-semibold text-blue-600">856</div>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-semibold text-purple-600">$8,432</div>
            <p className="text-sm text-muted-foreground">Total Value Saved</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}