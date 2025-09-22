import { useState, useEffect } from 'react';
import { Search, Clock, Users, ExternalLink, RefreshCw, Sparkles, Bookmark, BookmarkCheck, Plus, Heart, HeartOff, ChefHat } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// API Recipe interface (from TheMealDB)
interface ApiRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;
  strYoutube?: string;
  ingredients: { name: string; measure: string }[];
}

// Custom Recipe interface (matches App.tsx)
interface CustomRecipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  servings: number;
  isCustom: boolean;
  isBookmarked: boolean;
}

// Unified Recipe interface for display
interface DisplayRecipe extends ApiRecipe {
  isBookmarked?: boolean;
  isCustom?: boolean;
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

interface RecipesProps {
  foodItems: FoodItem[];
  customRecipes: CustomRecipe[];
  bookmarkedRecipes: string[];
  onAddCustomRecipe: (recipe: Omit<CustomRecipe, 'id' | 'isCustom'>) => void;
  onBookmarkRecipe: (recipeId: string) => void;
  initialSearchTerm?: string;
}

export function Recipes({ foodItems, customRecipes, bookmarkedRecipes, onAddCustomRecipe, onBookmarkRecipe, initialSearchTerm }: RecipesProps) {
  const [recipes, setRecipes] = useState<DisplayRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [suggestedRecipes, setSuggestedRecipes] = useState<DisplayRecipe[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [allInventoryRecipes, setAllInventoryRecipes] = useState<DisplayRecipe[]>([]);
  const [loadingAllInventory, setLoadingAllInventory] = useState(false);
  const [showCustomRecipeForm, setShowCustomRecipeForm] = useState(false);
  const [activeTab, setActiveTab] = useState(initialSearchTerm ? 'search' : 'search');
  
  // Custom recipe form state
  const [customRecipeForm, setCustomRecipeForm] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prepTime: 30,
    servings: 4
  });

  // Get ingredients that expire soon for suggestions
  const expiringSoonIngredients = foodItems
    .filter(item => {
      const daysLeft = Math.ceil((item.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 7 && daysLeft >= 0;
    })
    .map(item => item.name.toLowerCase())
    .slice(0, 3);

  const searchRecipes = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.meals) {
        const processedRecipes = data.meals.map((meal: any) => {
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
              ingredients.push({ name: ingredient, measure: measure || '' });
            }
          }
          return { 
            ...meal, 
            ingredients,
            isBookmarked: bookmarkedRecipes.includes(meal.idMeal),
            isCustom: false
          };
        });
        setRecipes(processedRecipes);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedRecipes = async () => {
    if (expiringSoonIngredients.length === 0) return;
    
    setLoadingSuggestions(true);
    try {
      const searchPromises = expiringSoonIngredients.map(ingredient =>
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(ingredient)}`)
          .then(res => res.json())
      );

      const results = await Promise.all(searchPromises);
      const allMeals = results.flatMap(result => result.meals || []);
      
      const uniqueMeals = Array.from(
        new Map(allMeals.map(meal => [meal.idMeal, meal])).values()
      ).slice(0, 6);

      const processedRecipes = uniqueMeals.map((meal: any) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            ingredients.push({ name: ingredient, measure: measure || '' });
          }
        }
        return { 
          ...meal, 
          ingredients,
          isBookmarked: bookmarkedRecipes.includes(meal.idMeal),
          isCustom: false
        };
      });

      setSuggestedRecipes(processedRecipes);
    } catch (error) {
      console.error('Error fetching suggested recipes:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const getRecipesForAllInventory = async () => {
    if (foodItems.length === 0) return;
    
    setLoadingAllInventory(true);
    try {
      const allIngredients = foodItems
        .map(item => item.name.toLowerCase())
        .slice(0, 5);

      const searchPromises = allIngredients.map(ingredient =>
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(ingredient)}`)
          .then(res => res.json())
      );

      const results = await Promise.all(searchPromises);
      const allMeals = results.flatMap(result => result.meals || []);
      
      const uniqueMeals = Array.from(
        new Map(allMeals.map(meal => [meal.idMeal, meal])).values()
      ).slice(0, 8);

      const processedRecipes = uniqueMeals.map((meal: any) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            ingredients.push({ name: ingredient, measure: measure || '' });
          }
        }
        return { 
          ...meal, 
          ingredients,
          isBookmarked: bookmarkedRecipes.includes(meal.idMeal),
          isCustom: false
        };
      });

      setAllInventoryRecipes(processedRecipes);
    } catch (error) {
      console.error('Error fetching inventory recipes:', error);
    } finally {
      setLoadingAllInventory(false);
    }
  };

  useEffect(() => {
    getSuggestedRecipes();
  }, [foodItems]);

  // Auto-search when initialSearchTerm is provided
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
      searchRecipes(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRecipes(searchTerm);
  };

  const handleBookmark = (recipeId: string) => {
    onBookmarkRecipe(recipeId);
    
    // Update local state for immediate UI feedback
    const updateRecipeBookmark = (recipes: DisplayRecipe[]) =>
      recipes.map(recipe => 
        recipe.idMeal === recipeId 
          ? { ...recipe, isBookmarked: !recipe.isBookmarked }
          : recipe
      );
    
    setRecipes(prev => updateRecipeBookmark(prev));
    setSuggestedRecipes(prev => updateRecipeBookmark(prev));
    setAllInventoryRecipes(prev => updateRecipeBookmark(prev));
  };

  const handleCustomRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customRecipeForm.name || !customRecipeForm.ingredients || !customRecipeForm.instructions) {
      return;
    }

    const ingredientsArray = customRecipeForm.ingredients
      .split('\n')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0);

    onAddCustomRecipe({
      name: customRecipeForm.name,
      ingredients: ingredientsArray,
      instructions: customRecipeForm.instructions,
      prepTime: customRecipeForm.prepTime,
      servings: customRecipeForm.servings,
      isBookmarked: false
    });

    // Reset form
    setCustomRecipeForm({
      name: '',
      ingredients: '',
      instructions: '',
      prepTime: 30,
      servings: 4
    });
    
    setShowCustomRecipeForm(false);
    setActiveTab('saved');
  };

  const handleIngredientSearch = (ingredient: string) => {
    setSearchTerm(ingredient);
    searchRecipes(ingredient);
  };

  // Get bookmarked API recipes
  const getBookmarkedApiRecipes = () => {
    const allApiRecipes = [...recipes, ...suggestedRecipes, ...allInventoryRecipes];
    const uniqueBookmarked = Array.from(
      new Map(
        allApiRecipes
          .filter(recipe => bookmarkedRecipes.includes(recipe.idMeal))
          .map(recipe => [recipe.idMeal, recipe])
      ).values()
    );
    return uniqueBookmarked;
  };

  const RecipeCard = ({ recipe, showBookmark = true }: { recipe: DisplayRecipe; showBookmark?: boolean }) => (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge>{recipe.strCategory}</Badge>
        </div>
        {showBookmark && (
          <div className="absolute top-2 left-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={() => handleBookmark(recipe.idMeal)}
            >
              {recipe.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-emerald-600" />
              ) : (
                <Bookmark className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{recipe.strMeal}</CardTitle>
        <CardDescription className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            30-45 min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            2-4 servings
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm mb-2">Ingredients:</h4>
            <div className="text-sm text-muted-foreground max-h-20 overflow-y-auto">
              {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                <div key={idx}>
                  {ing.measure} {ing.name}
                </div>
              ))}
              {recipe.ingredients.length > 5 && (
                <div className="text-xs">+ {recipe.ingredients.length - 5} more...</div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Recipe
            </Button>
            {recipe.strYoutube && (
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CustomRecipeCard = ({ recipe }: { recipe: CustomRecipe }) => (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
        <ChefHat className="h-16 w-16 text-emerald-600" />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">Custom</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{recipe.name}</CardTitle>
        <CardDescription className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.prepTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings} servings
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm mb-2">Ingredients:</h4>
            <div className="text-sm text-muted-foreground max-h-20 overflow-y-auto">
              {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                <div key={idx}>• {ing}</div>
              ))}
              {recipe.ingredients.length > 5 && (
                <div className="text-xs">+ {recipe.ingredients.length - 5} more...</div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Recipe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RecipeSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="search">Search & Discover</TabsTrigger>
          <TabsTrigger value="saved">My Recipes ({customRecipes.length + bookmarkedRecipes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Recipes
              </CardTitle>
              <CardDescription>
                Search for recipes or get suggestions based on your expiring ingredients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for recipes..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </form>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={getRecipesForAllInventory}
                    disabled={loadingAllInventory || foodItems.length === 0}
                    className="flex items-center gap-2"
                  >
                    {loadingAllInventory ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Get Recipes for All Inventory
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Recipes */}
          {expiringSoonIngredients.length > 0 && (
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-red-800 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Recipes for Your Expiring Items
                </CardTitle>
                <CardDescription className="text-red-700">
                  Click on an ingredient below to find recipes that use it before it expires
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-6">
                  {expiringSoonIngredients.map((ingredient, index) => (
                    <Button
                      key={index}
                      variant="destructive"
                      size="sm"
                      onClick={() => handleIngredientSearch(ingredient)}
                      className="destructive-gradient hover:opacity-90 transition-opacity"
                    >
                      <Search className="h-3 w-3 mr-1" />
                      {ingredient}
                    </Button>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loadingSuggestions ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <RecipeSkeleton key={index} />
                    ))
                  ) : suggestedRecipes.length > 0 ? (
                    suggestedRecipes.map((recipe) => (
                      <RecipeCard key={recipe.idMeal} recipe={recipe} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-red-600">
                      No suggested recipes found for your expiring ingredients. Try clicking on an ingredient above to search specifically for it.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Inventory Recipes */}
          {allInventoryRecipes.length > 0 && (
            <div>
              <h2 className="text-xl mb-4">Recipes Based on Your Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allInventoryRecipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {recipes.length > 0 && (
            <div>
              <h2 className="text-xl mb-4">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </div>
            </div>
          )}

          {loading && recipes.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <RecipeSkeleton key={index} />
              ))}
            </div>
          )}

          {!loading && recipes.length === 0 && searchTerm && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recipes found for "{searchTerm}". Try a different search term.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">My Saved Recipes</h2>
            <Dialog open={showCustomRecipeForm} onOpenChange={setShowCustomRecipeForm}>
              <DialogTrigger asChild>
                <Button className="primary-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Recipe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Custom Recipe</DialogTitle>
                  <DialogDescription>
                    Add your own recipe to your collection
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCustomRecipeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipe-name">Recipe Name</Label>
                    <Input
                      id="recipe-name"
                      value={customRecipeForm.name}
                      onChange={(e) => setCustomRecipeForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter recipe name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prep-time">Prep Time (minutes)</Label>
                      <Input
                        id="prep-time"
                        type="number"
                        min="5"
                        max="300"
                        value={customRecipeForm.prepTime}
                        onChange={(e) => setCustomRecipeForm(prev => ({ ...prev, prepTime: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="servings">Servings</Label>
                      <Input
                        id="servings"
                        type="number"
                        min="1"
                        max="20"
                        value={customRecipeForm.servings}
                        onChange={(e) => setCustomRecipeForm(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredients</Label>
                    <Textarea
                      id="ingredients"
                      value={customRecipeForm.ingredients}
                      onChange={(e) => setCustomRecipeForm(prev => ({ ...prev, ingredients: e.target.value }))}
                      placeholder="Enter each ingredient on a new line&#10;e.g.&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={customRecipeForm.instructions}
                      onChange={(e) => setCustomRecipeForm(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="Enter step-by-step cooking instructions..."
                      rows={8}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 primary-gradient">
                      Save Recipe
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowCustomRecipeForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Custom Recipes */}
          {customRecipes.length > 0 && (
            <div>
              <h3 className="text-lg mb-4">My Custom Recipes ({customRecipes.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customRecipes.map((recipe) => (
                  <CustomRecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}

          {/* Bookmarked Recipes */}
          {bookmarkedRecipes.length > 0 && (
            <div>
              <h3 className="text-lg mb-4">Bookmarked Recipes ({bookmarkedRecipes.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getBookmarkedApiRecipes().map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} showBookmark={false} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {customRecipes.length === 0 && bookmarkedRecipes.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg mb-2">No Saved Recipes Yet</h3>
              <p className="mb-6">Start building your recipe collection by bookmarking recipes or creating custom ones.</p>
              <Button 
                onClick={() => setActiveTab('search')} 
                variant="outline"
              >
                Discover Recipes
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}