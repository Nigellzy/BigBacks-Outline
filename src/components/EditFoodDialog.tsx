import { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface EditFoodDialogProps {
  item: FoodItem;
  onEditItem: (itemId: string, updatedItem: Omit<FoodItem, 'id'>) => void;
  children?: React.ReactNode;
}

export function EditFoodDialog({ item, onEditItem, children }: EditFoodDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: item.name,
    expirationDate: item.expirationDate.toISOString().split('T')[0],
    quantity: item.quantity,
    unit: item.unit,
    price: item.price,
    category: item.category
  });

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

    const updatedItem = {
      name: formData.name,
      expirationDate: new Date(formData.expirationDate),
      quantity: formData.quantity,
      unit: formData.unit,
      price: formData.price,
      category: formData.category
    };

    onEditItem(item.id, updatedItem);
    setOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: item.name,
      expirationDate: item.expirationDate.toISOString().split('T')[0],
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      category: item.category
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="outline">
            <Edit3 className="h-4 w-4 sm:mr-0 lg:mr-1" />
            <span className="sm:hidden lg:inline">Edit</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Food Item</DialogTitle>
          <DialogDescription>
            Update the details for {item.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Food Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Apples, Milk, Chicken"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-category">Category</Label>
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
              <Label htmlFor="edit-expiration">Expiration Date</Label>
              <Input
                id="edit-expiration"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-unit">Unit</Label>
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
                        <SelectItem key={`edit-suggested-${unit}`} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs text-muted-foreground border-t mt-1 pt-2">All units:</div>
                    </>
                  )}
                  {units.filter(unit => !formData.category || !getSuggestedUnits(formData.category).includes(unit)).map((unit) => (
                    <SelectItem key={`edit-all-${unit}`} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="primary-gradient">
              Update Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}