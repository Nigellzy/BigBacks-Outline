"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scan, Plus } from "lucide-react"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAddItem: (item: any) => void
}

const categories = ["Fruits", "Vegetables", "Dairy", "Meat", "Grains", "Pantry", "Frozen", "Other"]

const units = ["pieces", "grams", "kilograms", "liters", "milliliters", "cartons", "bottles", "cans", "packages"]

export function AddItemModal({ isOpen, onClose, onAddItem }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    expiryDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddItem({
      ...formData,
      quantity: Number.parseFloat(formData.quantity),
    })
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      expiryDate: "",
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Add a new item to your food inventory</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="scan">Scan Barcode</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Bananas, Milk, Bread"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
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

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleChange("unit", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="scan">
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <Scan className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Barcode Scanner</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use the Smart Tools tab to access the barcode scanner for quick item entry with automatic product
                  details.
                </p>
                <Button variant="outline" onClick={onClose}>
                  Go to Smart Tools
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
