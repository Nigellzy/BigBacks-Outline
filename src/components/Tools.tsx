import { useState } from 'react';
import { Bot, Calculator, Clock, Thermometer, Send, Lightbulb, Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface FoodItem {
  id: string;
  name: string;
  expirationDate: Date;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface ToolsProps {
  foodItems: FoodItem[];
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function Tools({ foodItems }: ToolsProps) {
  const [activeTool, setActiveTool] = useState('chatbot');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your FoodSaver AI assistant. Ask me anything about food storage, expiration dates, calories, or cooking tips!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [calorieFood, setCalorieFood] = useState('');
  const [calorieQuantity, setCalorieQuantity] = useState(100);
  const [calorieUnit, setCalorieUnit] = useState('grams');
  const [storageFood, setStorageFood] = useState('');

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isBot: false,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(chatInput);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setChatInput('');
  };

  const generateBotResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('store') || lowercaseInput.includes('storage')) {
      return "Here are some general storage tips:\n\n🥬 Vegetables: Most should be stored in the refrigerator crisper drawer\n🍎 Fruits: Apples, berries in fridge; bananas, citrus at room temp\n🥛 Dairy: Always refrigerate at 40°F or below\n🍞 Bread: Room temp for 2-3 days, freeze for longer storage\n🥩 Meat: Refrigerate immediately, use within 1-2 days or freeze";
    }
    
    if (lowercaseInput.includes('expir') || lowercaseInput.includes('last')) {
      return "Typical expiration guidelines:\n\n🥛 Milk: 5-7 days past sell-by date if refrigerated\n🥬 Leafy greens: 3-7 days in fridge\n🍞 Bread: 5-7 days at room temp, 3-6 months frozen\n🥩 Raw chicken: 1-2 days in fridge, 9 months frozen\n🧀 Hard cheese: 3-4 weeks past date if stored properly";
    }
    
    if (lowercaseInput.includes('calorie') || lowercaseInput.includes('nutrition')) {
      return "Average calories per 100g:\n\n🍎 Apple: ~52 calories\n🥛 Whole milk: ~60 calories\n🍞 White bread: ~265 calories\n🥩 Chicken breast: ~165 calories\n🥬 Lettuce: ~15 calories\n🍌 Banana: ~89 calories\n\nUse the calorie calculator tool for specific amounts!";
    }
    
    if (lowercaseInput.includes('recipe') || lowercaseInput.includes('cook')) {
      return "Cooking tips:\n\n🔥 Always preheat your oven for best results\n🧂 Season food during cooking, not just at the end\n🌡️ Use a meat thermometer for safety\n⏰ Don't rush - good food takes time\n🥬 Add delicate herbs at the end of cooking\n\nCheck the Recipes tab for specific meal ideas!";
    }

    return "That's a great question! I can help with:\n\n🏪 Food storage tips\n📅 Expiration date guidance\n🔢 Calorie calculations\n👨‍🍳 Cooking advice\n🥗 Recipe suggestions\n\nTry asking something like 'How should I store bananas?' or 'How many calories are in rice?'";
  };

  const calculateCalories = () => {
    const calorieData: { [key: string]: number } = {
      'apple': 52, 'banana': 89, 'orange': 47, 'chicken': 165, 'beef': 250,
      'milk': 60, 'bread': 265, 'rice': 130, 'pasta': 131, 'cheese': 113,
      'lettuce': 15, 'tomato': 18, 'potato': 77, 'carrot': 41, 'broccoli': 34
    };

    const foodKey = calorieFood.toLowerCase();
    let baseCalories = 0;

    for (const [key, calories] of Object.entries(calorieData)) {
      if (foodKey.includes(key)) {
        baseCalories = calories;
        break;
      }
    }

    if (baseCalories === 0) {
      return "Sorry, I don't have calorie data for that food item. Try common foods like apple, chicken, rice, etc.";
    }

    // Convert quantity to grams if needed
    let quantityInGrams = calorieQuantity;
    switch (calorieUnit) {
      case 'kg': quantityInGrams = calorieQuantity * 1000; break;
      case 'ounces': quantityInGrams = calorieQuantity * 28.35; break;
      case 'pounds': quantityInGrams = calorieQuantity * 453.6; break;
      case 'cups': quantityInGrams = calorieQuantity * 240; break; // approximate
    }

    const totalCalories = Math.round((baseCalories * quantityInGrams) / 100);
    return `${calorieQuantity} ${calorieUnit} of ${calorieFood} contains approximately ${totalCalories} calories.`;
  };

  const getStorageTips = () => {
    const storageTips: { [key: string]: string } = {
      'apple': 'Store in refrigerator crisper drawer. Can last 1-2 months when properly stored.',
      'banana': 'Store at room temperature. Refrigerate once ripe to slow ripening.',
      'milk': 'Keep refrigerated at 40°F or below. Store in main body of fridge, not door.',
      'bread': 'Store at room temperature for 2-3 days, freeze for longer storage.',
      'chicken': 'Refrigerate immediately. Use within 1-2 days or freeze for up to 9 months.',
      'lettuce': 'Wrap in paper towels, store in crisper drawer. Lasts 3-7 days.',
      'tomato': 'Ripe tomatoes at room temp, unripe ones can ripen on counter.',
      'potato': 'Store in cool, dark, well-ventilated place. Do not refrigerate.',
      'cheese': 'Wrap in wax paper or parchment, then plastic. Store in cheese drawer.',
      'fish': 'Use within 1-2 days. Store on ice in refrigerator.'
    };

    const foodKey = storageFood.toLowerCase();
    for (const [key, tip] of Object.entries(storageTips)) {
      if (foodKey.includes(key)) {
        return tip;
      }
    }
    return "For general storage: Keep cold foods cold (40°F or below), store dry goods in airtight containers, and keep fruits and vegetables separate as some fruits release ethylene gas that speeds ripening.";
  };

  const tools = [
    {
      id: 'chatbot',
      name: 'AI Food Assistant',
      icon: Bot,
      description: 'Ask questions about food storage, expiration, and cooking'
    },
    {
      id: 'calories',
      name: 'Calorie Calculator',
      icon: Calculator,
      description: 'Calculate calories for specific food portions'
    },
    {
      id: 'storage',
      name: 'Storage Guide',
      icon: Thermometer,
      description: 'Get optimal storage tips for different foods'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl">Food Tools</h1>
        <p className="text-muted-foreground">Helpful tools to manage your food better</p>
      </div>

      {/* Tool Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeTool === tool.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveTool(tool.id)}
            >
              <CardContent className="p-4 text-center">
                <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">{tool.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Tool Content */}
      <Card>
        <CardContent className="p-6">
          {activeTool === 'chatbot' && (
            <div className="space-y-4">
              <div className="h-96 border rounded-lg p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isBot
                          ? 'bg-white text-gray-800 border dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600'
                          : 'primary-gradient text-white'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me about food storage, calories, expiration dates..."
                  className="flex-1"
                />
                <Button type="submit">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {activeTool === 'calories' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="food-name">Food Item</Label>
                  <Input
                    id="food-name"
                    value={calorieFood}
                    onChange={(e) => setCalorieFood(e.target.value)}
                    placeholder="e.g., apple, chicken, rice"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={calorieQuantity}
                    onChange={(e) => setCalorieQuantity(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={calorieUnit} onValueChange={setCalorieUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grams">Grams</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="ounces">Ounces</SelectItem>
                      <SelectItem value="pounds">Pounds</SelectItem>
                      <SelectItem value="cups">Cups</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => {
                const result = calculateCalories();
                setChatMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  text: result,
                  isBot: true,
                  timestamp: new Date()
                }]);
                setActiveTool('chatbot');
              }}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Calories
              </Button>
            </div>
          )}

          {activeTool === 'storage' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="storage-food">Food Item</Label>
                <Input
                  id="storage-food"
                  value={storageFood}
                  onChange={(e) => setStorageFood(e.target.value)}
                  placeholder="e.g., tomatoes, milk, bread"
                />
              </div>
              <Button onClick={() => {
                const tips = getStorageTips();
                setChatMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  text: `Storage tips for ${storageFood}:\n\n${tips}`,
                  isBot: true,
                  timestamp: new Date()
                }]);
                setActiveTool('chatbot');
              }}>
                <Thermometer className="h-4 w-4 mr-2" />
                Get Storage Tips
              </Button>
            </div>
          )}


        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Storage Basics</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Keep fridge at 40°F (4°C) or below</li>
                <li>• Store raw meat on bottom shelf</li>
                <li>• Don't wash produce until ready to eat</li>
                <li>• Use FIFO: First In, First Out</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Signs of Spoilage</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Off smells or unusual odors</li>
                <li>• Slimy texture or mold growth</li>
                <li>• Color changes or discoloration</li>
                <li>• When in doubt, throw it out</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}