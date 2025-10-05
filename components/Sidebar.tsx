'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    BarChart3,
    Workflow,
    Package,
    Layers,
    Users,
    Heart,
    ShoppingCart,
    FileText,
    MessageSquare,
    CreditCard,
    Layout,
    Plus,
    CalendarClock,
    CheckSquare,
    BookUser
} from 'lucide-react';

interface SidebarProps {
  sidebarExpanded?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function Sidebar({ 
  sidebarExpanded = false, 
  onMouseEnter, 
  onMouseLeave 
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  // Mock dynamic pages - in a real app this would come from a database/API
  const [dynamicPages, setDynamicPages] = useState<Array<{ id: string; label: string; href: string }>>([
    // { id: 'v2', label: 'Dashboard V2', href: '/v2' }
  ]);

  const handleCreatePage = () => {
    if (!newPageName.trim()) return;
    
    const pageId = newPageName.toLowerCase().replace(/\s+/g, '-');
    
    // Reserved routes that shouldn't be overridden
    const reservedRoutes = ['v2', 'disco', 'billing', 'customers', 'items', 'items-v2', 'materials', 'messages', 'orders', 'planner', 'tasks', 'reports', 'teams', 'workflows', 'workflows-v2', 'workflows-test', 'workflows-wizard-test', 'workflows-grid-test', 'workflows-library', 'rolodex'];
    
    if (reservedRoutes.includes(pageId)) {
      alert(`"${newPageName}" is a reserved name. Please choose a different name.`);
      return;
    }
    
    const newPage = {
      id: pageId,
      label: newPageName,
      href: `/${pageId}`
    };
    
    setDynamicPages(prev => [...prev, newPage]);
    setNewPageName('');
    setShowNewPageInput(false);
    
    // Navigate to the new page
    router.push(newPage.href);
  };

  const coreItems = [
    { 
      icon: Layout, 
      label: "Dashboard V2", 
      href: "/v2",
      active: pathname === "/v2"
    },
    { 
      icon: Workflow, 
      label: "Workflow Builder", 
      href: "/workflows-grid-test",
      active: pathname === "/workflows-grid-test"
    },
    { 
      icon: Package, 
      label: "Items V2", 
      href: "/items-v2",
      active: pathname === "/items-v2"
    },
    { 
      icon: ShoppingCart, 
      label: "Orders", 
      href: "/orders",
      active: pathname === "/orders" || pathname.startsWith("/orders/")
    },
    { 
      icon: BookUser, 
      label: "Rolodex", 
      href: "/rolodex",
      active: pathname === "/rolodex" || pathname.startsWith("/rolodex/")
    },
    { 
      icon: CalendarClock, 
      label: "Planner", 
      href: "/planner",
      active: pathname === "/planner"
    },
    { 
      icon: CheckSquare, 
      label: "Tasks", 
      href: "/tasks",
      active: pathname === "/tasks"
    },
    { 
      icon: Users, 
      label: "Teams", 
      href: "/teams",
      active: pathname === "/teams"
    },
    { 
      icon: MessageSquare, 
      label: "Messages", 
      href: "/messages",
      active: pathname === "/messages"
    },
  ];

  const navigationItems = [
    { 
      icon: BarChart3, 
      label: "Dashboard", 
      href: "/",
      active: pathname === "/"
    },
    { 
      icon: Workflow, 
      label: "Workflows", 
      href: "/workflows",
      active: pathname === "/workflows"
    },
    { 
      icon: Package, 
      label: "Items", 
      href: "/items",
      active: pathname === "/items"
    },
    { 
      icon: Layers, 
      label: "Materials", 
      href: "/materials",
      active: pathname === "/materials"
    },
    { 
      icon: Heart, 
      label: "Customers", 
      href: "/customers",
      active: pathname === "/customers"
    },
    { 
      icon: FileText, 
      label: "Reports", 
      href: "/reports",
      active: pathname === "/reports"
    },
    { 
      icon: CreditCard, 
      label: "Billing", 
      href: "/billing",
      active: pathname === "/billing"
    },
  ];

  return (
    <aside
      className={`transition-all duration-200 border-r bg-sidebar ${sidebarExpanded ? "w-60" : "w-16"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-3 h-full overflow-y-auto flex flex-col">
        {/* CORE Section */}
        <div className="mb-6 mt-3">
          {sidebarExpanded && (
            <div className="px-2 py-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                <span>Core</span>
                <span className="text-[10px] bg-sidebar-accent px-1.5 py-0.5 rounded">New</span>
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            {coreItems.map(({ icon: Icon, label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors ${
                  active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {sidebarExpanded && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Separator */}
        {sidebarExpanded && <div className="border-t border-sidebar-border mb-4" />}

        {/* Pages Section */}
        {(dynamicPages.length > 0 || showNewPageInput || sidebarExpanded) && (
          <div className="mb-6">
            {sidebarExpanded && (
              <div className="px-2 py-2 mb-2">
                <div className="flex items-center justify-between text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                  <span>Pages</span>
                  <button
                    onClick={() => setShowNewPageInput(true)}
                    className="p-1 hover:bg-sidebar-accent rounded text-sidebar-foreground"
                    title="New Page"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            
            {!sidebarExpanded && (
              <button
                onClick={() => setShowNewPageInput(true)}
                className="w-full flex items-center justify-center px-3 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent mb-2"
                title="New Page"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {/* New Page Input */}
            {showNewPageInput && sidebarExpanded && (
              <div className="px-2 pb-2 mb-2">
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="Page name"
                    className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreatePage();
                      if (e.key === 'Escape') {
                        setShowNewPageInput(false);
                        setNewPageName('');
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleCreatePage}
                    disabled={!newPageName.trim()}
                    className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded disabled:opacity-50"
                  >
                    ✓
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Pages List */}
            {dynamicPages.length > 0 && (
              <div className="space-y-1">
                {dynamicPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors ${
                      pathname === page.href || pathname.startsWith(page.href + '/')
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground'
                    }`}
                  >
                    <Layout className="h-4 w-4 flex-shrink-0" />
                    {sidebarExpanded && (
                      <span className="text-sm font-medium whitespace-nowrap">{page.label}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Separator */}
        {sidebarExpanded && dynamicPages.length > 0 && <div className="border-t border-sidebar-border mb-4" />}

        {/* Regular Navigation */}
        <nav className="space-y-1">
          {sidebarExpanded && (
            <div className="px-2 py-2 mb-2">
              <span className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Navigation
              </span>
            </div>
          )}
          {navigationItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors ${
                active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}