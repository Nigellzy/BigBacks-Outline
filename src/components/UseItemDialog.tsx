import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface UseItemDialogProps {
  item: FoodItem;
  onUseItem: (itemId: string, usedQuantity?: number) => void;
  children: React.ReactNode;
}

export function UseItemDialog({ item, onUseItem, children }: UseItemDialogProps) {
  const [usedQuantity, setUsedQuantity] = useState(Math.min(1, item.quantity));
  const [inputValue, setInputValue] = useState(Math.min(1, item.quantity).toString());
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUseItem(item.id, usedQuantity);
    setOpen(false);
    const resetValue = Math.min(1, item.quantity);
    setUsedQuantity(resetValue);
    setInputValue(resetValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Only update usedQuantity if the value is a valid number
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setUsedQuantity(numValue);
    }
  };

  const handleUseAll = () => {
    onUseItem(item.id, item.quantity);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle>Use {item.name}</DialogTitle>
          <DialogDescription>
            How much of this item did you use? Current amount: {item.quantity} {item.unit}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="used-quantity">Quantity Used ({item.unit})</Label>
            <Input
              id="used-quantity"
              type="number"
              min="0.1"
              max={item.quantity}
              step="0.1"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`Max: ${item.quantity}`}
            />
            <p className="text-xs text-muted-foreground">
              Remaining: {Math.max(0, item.quantity - usedQuantity).toFixed(1)} {item.unit}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full primary-gradient" 
              disabled={!inputValue || usedQuantity <= 0 || usedQuantity > item.quantity}
            >
              Use Custom Amount ({usedQuantity > 0 ? usedQuantity : '?'} {item.unit})
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleUseAll}
              className="w-full"
            >
              Use All ({item.quantity} {item.unit})
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}