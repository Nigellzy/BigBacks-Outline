"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, ChefHat, Clock, Users, Heart, ExternalLink, Sparkles, BookOpen } from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate: string
  daysLeft: number
}

interface Recipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
  strInstructions: string
  strYoutube?: string
  strSource?: string
  ingredients: string[]
  measures: string[]
}

interface RecipeSuggestionsProps {
  inventory: InventoryItem[]
}

export function RecipeSuggestions({ inventory }: RecipeSuggestionsProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  // Get expiring ingredients for smart suggestions
  const expiringIngredients = inventory.filter((item) => item.daysLeft <= 3).map((item) => item.name.toLowerCase())

  // Fetch recipes from TheMealDB API
  const fetchRecipes = async (ingredient: string) => {
    setLoading(true)
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      const data = await response.json()

      if (data.meals) {
        // Get detailed recipe information
        const detailedRecipes = await Promise.all(
          data.meals.slice(0, 6).map(async (meal: any) => {
            const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            const detailData = await detailResponse.json()

            if (detailData.meals && detailData.meals[0]) {
              const recipe = detailData.meals[0]

              // Extract ingredients and measures
              const ingredients = []
              const measures = []

              for (let i = 1; i <= 20; i++) {
                const ingredient = recipe[`strIngredient${i}`]
                const measure = recipe[`strMeasure${i}`]

                if (ingredient && ingredient.trim()) {
                  ingredients.push(ingredient.trim())
                  measures.push(measure ? measure.trim() : "")
                }
              }

              return {
                ...recipe,
                ingredients,
                measures,
              }
            }
            return null
          }),
        )

        setRecipes(detailedRecipes.filter((recipe) => recipe !== null))
      } else {
        setRecipes([])
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
      setRecipes([])
    }
    setLoading(false)
  }

  // Search recipes by name
  const searchRecipes = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      const data = await response.json()

      if (data.meals) {
        const processedRecipes = data.meals.slice(0, 8).map((recipe: any) => {
          const ingredients = []
          const measures = []

          for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`]
            const measure = recipe[`strMeasure${i}`]

            if (ingredient && ingredient.trim()) {
              ingredients.push(ingredient.trim())
              measures.push(measure ? measure.trim() : "")
            }
          }

          return {
            ...recipe,
            ingredients,
            measures,
          }
        })

        setRecipes(processedRecipes)
      } else {
        setRecipes([])
      }
    } catch (error) {
      console.error("Error searching recipes:", error)
      setRecipes([])
    }
    setLoading(false)
  }

  // Auto-suggest recipes based on expiring ingredients
  useEffect(() => {
    if (expiringIngredients.length > 0) {
      fetchRecipes(expiringIngredients[0])
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchRecipes(searchQuery)
  }

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => (prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]))
  }

  const getMatchingIngredients = (recipe: Recipe) => {
    const userIngredients = inventory.map((item) => item.name.toLowerCase())
    return recipe.ingredients.filter((ingredient) =>
      userIngredients.some(
        (userIng) => userIng.includes(ingredient.toLowerCase()) || ingredient.toLowerCase().includes(userIng),
      ),
    )
  }

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
    const matchingIngredients = getMatchingIngredients(recipe)
    const isFavorite = favorites.includes(recipe.idMeal)

    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <img
            src={recipe.strMealThumb || "/placeholder.svg"}
            alt={recipe.strMeal}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(recipe.idMeal)
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          {matchingIngredients.length > 0 && (
            <Badge className="absolute top-2 left-2 bg-primary">
              {matchingIngredients.length} ingredients you have
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2">{recipe.strMeal}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{recipe.strCategory}</Badge>
                <Badge variant="outline">{recipe.strArea}</Badge>
              </div>
            </div>

            {matchingIngredients.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">Ingredients you have:</p>
                <div className="flex flex-wrap gap-1">
                  {matchingIngredients.slice(0, 3).map((ingredient, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                  {matchingIngredients.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{matchingIngredients.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>30-45 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>4 servings</span>
                </div>
              </div>
              <Button size="sm" onClick={() => setSelectedRecipe(recipe)} className="gap-1">
                <BookOpen className="w-3 h-3" />
                View Recipe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const RecipeModal = ({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={onClose}>
            ×
          </Button>
          <div className="flex gap-4">
            <img
              src={recipe.strMealThumb || "/placeholder.svg"}
              alt={recipe.strMeal}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <CardTitle className="text-2xl">{recipe.strMeal}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{recipe.strCategory}</Badge>
                <Badge variant="outline">{recipe.strArea}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>30-45 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>4 servings</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Ingredients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{recipe.measures[index]}</span>
                  <span>{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Instructions</h3>
            <div className="prose prose-sm max-w-none">
              {recipe.strInstructions.split("\n").map(
                (step, index) =>
                  step.trim() && (
                    <p key={index} className="mb-2">
                      {step.trim()}
                    </p>
                  ),
              )}
            </div>
          </div>

          {(recipe.strYoutube || recipe.strSource) && (
            <div className="flex gap-2">
              {recipe.strYoutube && (
                <Button variant="outline" asChild>
                  <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Watch Video
                  </a>
                </Button>
              )}
              {recipe.strSource && (
                <Button variant="outline" asChild>
                  <a href={recipe.strSource} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Original Recipe
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Smart Suggestions Alert */}
      {expiringIngredients.length > 0 && (
        <Alert className="border-primary/50 bg-primary/5">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            You have {expiringIngredients.length} ingredient{expiringIngredients.length > 1 ? "s" : ""} expiring soon:{" "}
            {expiringIngredients.slice(0, 3).join(", ")}
            {expiringIngredients.length > 3 && ` and ${expiringIngredients.length - 3} more`}. Here are some recipe
            suggestions to help you use them up!
          </AlertDescription>
        </Alert>
      )}

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Recipe Suggestions
          </CardTitle>
          <CardDescription>Find recipes based on your ingredients or search for something specific</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search for recipes (e.g., chicken, pasta, banana bread)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex gap-2 mt-4">
            <p className="text-sm text-muted-foreground">Quick suggestions:</p>
            {expiringIngredients.slice(0, 3).map((ingredient) => (
              <Button
                key={ingredient}
                variant="outline"
                size="sm"
                onClick={() => fetchRecipes(ingredient)}
                className="text-xs"
              >
                {ingredient}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recipe Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Finding delicious recipes...</p>
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || expiringIngredients.length > 0
                ? "No recipes found. Try searching for a different ingredient or dish name."
                : "Search for recipes or let us suggest some based on your expiring ingredients!"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  )
}
