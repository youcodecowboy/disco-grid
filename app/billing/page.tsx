'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Package, 
  CheckCircle, 
  MessageSquare, 
  Plus,
  ArrowRight,
  Lightbulb,
  Zap,
  Target,
  Settings,
  X,
  Search,
  Filter,
  Tag,
  Calendar,
  TrendingUp,
  UserPlus,
  Shield,
  Clock,
  Heart,
  Star,
  FileText,
  DollarSign,
  PieChart,
  Activity,
  Send,
  Bell,
  CreditCard,
  Receipt
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function BillingPage() {
  const [billingInput, setBillingInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBilling = () => {
    if (billingInput.trim()) {
      setIsCreating(true);
      // Simulate AI processing
      setTimeout(() => setIsCreating(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
            </div>
            <div className="text-sm text-muted-foreground">Usage & Billing</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <Input 
                type="text" 
                placeholder="Search billing..." 
                className="pl-10 pr-4 py-1.5 text-sm border-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10 h-4 w-4" />
            </div>
            <Button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 text-sm">
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Title Section */}
          <div className="mb-4 pb-2 border-b-2">
            <div className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Usage & Billing</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Manage your subscription and usage</span>
            </div>
          </div>

          {/* Grid Canvas */}
          <div className="relative bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px]" style={{ minHeight: '1300px' }}>
            
            {/* Welcome Section */}
            <div className="absolute group cursor-move" style={{ left: 'calc(0% + 0px)', top: '0px', width: 'calc(100% - 0px)', height: '180px', zIndex: 1 }} draggable="true">
              <Card className="bg-card text-card-foreground flex flex-col gap-6 py-6 h-full shadow-sm border-2 rounded-none relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 border-b-2 h-8">
                  <CardTitle className="font-medium text-sm">Welcome to Billing Management! 💳</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-yellow-100" title="Set Notifications">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-blue-100" title="AI Assistant">
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-green-100" title="Edit Block">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-purple-100" title="Extend Block">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-red-100" title="Delete Block">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center">
                        <CreditCard className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Manage Your Subscription with AI</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Track usage, manage billing, and optimize costs with intelligent insights!
                      </p>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Badge variant="secondary" className="text-xs">Try it now</Badge>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Billing Creation */}
            <div className="absolute group cursor-move" style={{ left: 'calc(0% + 0px)', top: '196px', width: 'calc(100% - 0px)', height: '160px', zIndex: 1 }} draggable="true">
              <Card className="bg-card text-card-foreground flex flex-col gap-6 py-6 h-full shadow-sm border-2 rounded-none relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 border-b-2 h-8">
                  <CardTitle className="font-medium text-sm">Generate Billing Report</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-yellow-100" title="Set Notifications">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-blue-100" title="AI Assistant">
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-green-100" title="Edit Block">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-purple-100" title="Extend Block">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-red-100" title="Delete Block">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col justify-center h-full">
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Describe your billing needs... (e.g., 'Monthly usage report with cost optimization recommendations')"
                        value={billingInput}
                        onChange={(e) => setBillingInput(e.target.value)}
                        className="h-12 text-sm pl-4 pr-12 rounded-lg border-2 focus:border-gray-500 transition-colors"
                      />
                      <Button 
                        onClick={handleCreateBilling}
                        disabled={!billingInput.trim() || isCreating}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-500 hover:bg-gray-600 rounded-md"
                      >
                        {isCreating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Usage reports
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Cost analysis
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Invoice generation
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Payment tracking
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Billing Overview */}
            <div className="absolute group cursor-move" style={{ left: 'calc(0% + 0px)', top: '372px', width: 'calc(50% - 8px)', height: '200px', zIndex: 1 }} draggable="true">
              <Card className="bg-card text-card-foreground flex flex-col gap-6 py-6 h-full shadow-sm border-2 rounded-none relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 border-b-2 h-8">
                  <CardTitle className="font-medium text-sm">Billing Overview</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-yellow-100" title="Set Notifications">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-blue-100" title="AI Assistant">
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-green-100" title="Edit Block">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-purple-100" title="Extend Block">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-red-100" title="Delete Block">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="flex flex-col justify-center text-center">
                      <div className="text-3xl font-bold text-gray-600">$299</div>
                      <div className="text-sm text-muted-foreground">Monthly Plan</div>
                    </div>
                    <div className="flex flex-col justify-center text-center">
                      <div className="text-3xl font-bold text-blue-600">85%</div>
                      <div className="text-sm text-muted-foreground">Usage</div>
                    </div>
                    <div className="flex flex-col justify-center text-center">
                      <div className="text-3xl font-bold text-green-600">$45</div>
                      <div className="text-sm text-muted-foreground">Saved This Month</div>
                    </div>
                    <div className="flex flex-col justify-center text-center">
                      <div className="text-3xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-muted-foreground">Team Members</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Invoices */}
            <div className="absolute group cursor-move" style={{ left: 'calc(50% + 8px)', top: '372px', width: 'calc(50% - 0px)', height: '200px', zIndex: 1 }} draggable="true">
              <Card className="bg-card text-card-foreground flex flex-col gap-6 py-6 h-full shadow-sm border-2 rounded-none relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 border-b-2 h-8">
                  <CardTitle className="font-medium text-sm">Recent Invoices</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-yellow-100" title="Set Notifications">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-blue-100" title="AI Assistant">
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-green-100" title="Edit Block">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-purple-100" title="Extend Block">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-red-100" title="Delete Block">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Invoice #2024-001</div>
                        <div className="text-xs text-muted-foreground">December 2024</div>
                      </div>
                      <Badge variant="outline" className="text-xs">$299</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Invoice #2024-002</div>
                        <div className="text-xs text-muted-foreground">November 2024</div>
                      </div>
                      <Badge variant="outline" className="text-xs">$299</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Invoice #2024-003</div>
                        <div className="text-xs text-muted-foreground">October 2024</div>
                      </div>
                      <Badge variant="outline" className="text-xs">$299</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Categories */}
            <div className="absolute group cursor-move" style={{ left: 'calc(0% + 0px)', top: '588px', width: 'calc(100% - 0px)', height: '200px', zIndex: 1 }} draggable="true">
              <Card className="bg-card text-card-foreground flex flex-col gap-6 py-6 h-full shadow-sm border-2 rounded-none relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 border-b-2 h-8">
                  <CardTitle className="font-medium text-sm">Usage Categories</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-yellow-100" title="Set Notifications">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-blue-100" title="AI Assistant">
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-green-100" title="Edit Block">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-purple-100" title="Extend Block">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-red-100" title="Delete Block">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="grid grid-cols-4 gap-4 h-full">
                    <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <Users className="h-8 w-8 text-blue-600 mb-2" />
                      <div className="text-sm font-medium">Team Members</div>
                      <div className="text-xs text-muted-foreground">12 users</div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <Activity className="h-8 w-8 text-green-600 mb-2" />
                      <div className="text-sm font-medium">API Calls</div>
                      <div className="text-xs text-muted-foreground">45K/month</div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <Package className="h-8 w-8 text-orange-600 mb-2" />
                      <div className="text-sm font-medium">Storage</div>
                      <div className="text-xs text-muted-foreground">85GB used</div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <Zap className="h-8 w-8 text-purple-600 mb-2" />
                      <div className="text-sm font-medium">AI Features</div>
                      <div className="text-xs text-muted-foreground">Unlimited</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Notes */}
            <div className="absolute group cursor-move" style={{ left: 'calc(0% + 0px)', top: '804px', width: 'calc(100% - 0px)', height: '200px', zIndex: 1 }} draggable="true">
              <Card className="bg-card text-card-foreground flex flex-col gap-6 py-6 h-full shadow-sm border-2 rounded-none relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 border-b-2 h-8">
                  <CardTitle className="font-medium text-sm">Billing Tips</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-yellow-100" title="Set Notifications">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-blue-100" title="AI Assistant">
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-green-100" title="Edit Block">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-purple-100" title="Extend Block">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 hover:bg-red-100" title="Delete Block">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="grid grid-cols-2 gap-6 h-full">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div className="text-sm">
                          <strong>Describe your billing needs</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            "Monthly usage report with cost optimization"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div className="text-sm">
                          <strong>AI provides cost insights</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            Automatic optimization recommendations
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-green-500 mt-0.5" />
                        <div className="text-sm">
                          <strong>Track usage patterns</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            Monitor team and feature usage
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard className="h-4 w-4 text-purple-500 mt-0.5" />
                        <div className="text-sm">
                          <strong>Manage payments</strong>
                          <p className="text-xs text-muted-foreground mt-1">
                            Automatic invoicing and payment tracking
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add Block Zone */}
            <div className="mt-8 border-2 border-dashed border-muted-foreground/25 p-12 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors" style={{ position: 'relative', top: '1020px' }}>
              <div className="flex flex-col items-center gap-2">
                <Plus className="h-6 w-6" />
                <span className="text-sm text-muted-foreground">Add Billing Component</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
