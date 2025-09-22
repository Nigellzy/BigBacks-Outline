import { useState } from 'react';
import { Plus, Scan } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface AddFoodProps {
  onAddFood: (food: Omit<FoodItem, 'id'>) => void;
}

export function AddFood({ onAddFood }: AddFoodProps) {
  const [formData, setFormData] = useState({
    name: '',
    expirationDate: '',
    quantity: 1,
    unit: '',
    price: 0,
    category: ''
  });

  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);
  const [barcodeScanning, setBarcodeScanning] = useState(false);

  const categories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Meat & Poultry',
    'Seafood',
    'Pantry Items',
    'Frozen Foods',
    'Beverages',
    'Snacks',
    'Bakery',
    'Other'
  ];

  const units = [
    'pieces',
    'grams',
    'kilograms',
    'milliliters',
    'liters',
    'slices',
    'cups',
    'tablespoons',
    'teaspoons',
    'ounces',
    'pounds',
    'cans',
    'bottles',
    'packages',
    'loaves',
    'bunches',
    'heads',
    'cloves'
  ];

  // Get suggested units based on category
  const getSuggestedUnits = (category: string) => {
    switch (category) {
      case 'Fruits & Vegetables':
        return ['pieces', 'grams', 'kilograms', 'bunches', 'heads'];
      case 'Dairy & Eggs':
        return ['liters', 'milliliters', 'pieces', 'cups', 'grams'];
      case 'Meat & Poultry':
        return ['grams', 'kilograms', 'pounds', 'pieces'];
      case 'Seafood':
        return ['grams', 'kilograms', 'pounds', 'pieces'];
      case 'Beverages':
        return ['liters', 'milliliters', 'bottles', 'cans'];
      case 'Bakery':
        return ['slices', 'loaves', 'pieces', 'grams'];
      case 'Pantry Items':
        return ['grams', 'kilograms', 'cups', 'tablespoons', 'teaspoons', 'cans', 'packages'];
      default:
        return ['pieces', 'grams', 'cups'];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.expirationDate || !formData.category || !formData.unit) {
      return;
    }

    const newFood = {
      name: formData.name,
      expirationDate: new Date(formData.expirationDate),
      quantity: formData.quantity,
      unit: formData.unit,
      price: formData.price,
      category: formData.category
    };

    onAddFood(newFood);
    setRecentlyAdded(prev => [formData.name, ...prev.slice(0, 4)]);
    
    // Reset form
    setFormData({
      name: '',
      expirationDate: '',
      quantity: 1,
      unit: '',
      price: 0,
      category: ''
    });
  };

  const handleBarcodeClick = () => {
    setBarcodeScanning(true);
    // Simulate barcode scanning with mock data
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: 'Organic Bananas',
        category: 'Fruits & Vegetables',
        price: 2.99
      }));
      setBarcodeScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Manual Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Food Item
          </CardTitle>
          <CardDescription>
            Manually enter food details or scan a barcode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="name">Food Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Apples, Milk, Chicken"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleBarcodeClick}
                  disabled={barcodeScanning}
                >
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {barcodeScanning && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">Scanning barcode... Point camera at product barcode.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expiration">Expiration Date</Label>
                <Input
                  id="expiration"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && (
                      <>
                        <div className="px-2 py-1 text-xs text-muted-foreground">Suggested:</div>
                        {getSuggestedUnits(formData.category).map((unit) => (
                          <SelectItem key={`suggested-${unit}`} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs text-muted-foreground border-t mt-1 pt-2">All units:</div>
                      </>
                    )}
                    {units.filter(unit => !formData.category || !getSuggestedUnits(formData.category).includes(unit)).map((unit) => (
                      <SelectItem key={`all-${unit}`} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Added</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentlyAdded.map((item, index) => (
                <Badge key={index} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}