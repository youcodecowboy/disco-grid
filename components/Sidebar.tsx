'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    BarChart3,
    Workflow,
    Package, Users, ShoppingCart, MessageSquare, Layout,
    Plus,
    CalendarClock,
    CheckSquare,
    BookUser,
    Sparkles,
    X,
    Zap,
    QrCode,
    Map,
    Smartphone,
    FileText
} from 'lucide-react';

interface SidebarProps {
  sidebarExpanded?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const PAGES_STORAGE_KEY = 'groovy-custom-pages';

export default function Sidebar({ 
  sidebarExpanded = false, 
  onMouseEnter, 
  onMouseLeave 
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  // Dynamic pages with localStorage persistence
  const [dynamicPages, setDynamicPages] = useState<Array<{ id: string; label: string; href: string }>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved pages from localStorage on mount
  useEffect(() => {
    const savedPages = localStorage.getItem(PAGES_STORAGE_KEY);
    if (savedPages) {
      try {
        const pages = JSON.parse(savedPages);
        setDynamicPages(pages);
      } catch (error) {
        console.error('Error loading saved pages:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save pages to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(dynamicPages));
    }
  }, [dynamicPages, isLoaded]);

  const handleCreateDashboard = async () => {
    // Import dashboard storage utilities
    const { createBlankDashboard } = await import('@/lib/dashboard-generation/storage')
    
    const name = prompt('Enter dashboard name:')
    if (!name || !name.trim()) return
    
    try {
      const dashboard = createBlankDashboard(name.trim())
      
      // Update the list
      setCustomDashboards(prev => [...prev, {
        id: dashboard.id,
        label: dashboard.name,
        href: `/${dashboard.id}`
      }])
      
      // Navigate to the new dashboard
      router.push(`/${dashboard.id}`)
    } catch (error) {
      console.error('Error creating dashboard:', error)
      alert('Failed to create dashboard. Please try again.')
    }
  }

  const handleCreatePage = () => {
    if (!newPageName.trim()) return;
    
    const pageId = newPageName.toLowerCase().replace(/\s+/g, '-');
    
    // Reserved routes that shouldn't be overridden
    const reservedRoutes = ['v2', 'disco', 'floor', 'billing', 'customers', 'items', 'items-v2', 'materials', 'messages', 'orders', 'planner', 'tasks', 'tasks-v2', 'playbooks', 'reports', 'map', 'teams', 'workflows', 'workflows-v2', 'workflows-test', 'workflows-wizard-test', 'workflows-grid-test', 'workflows-library', 'rolodex', 'playground', 'notes'];
    
    if (reservedRoutes.includes(pageId)) {
      alert(`"${newPageName}" is a reserved name. Please choose a different name.`);
      return;
    }
    
    // Check if page already exists
    if (dynamicPages.some(page => page.id === pageId)) {
      alert(`A page with the name "${newPageName}" already exists. Please choose a different name.`);
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

  const handleDeletePage = (pageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const page = dynamicPages.find(p => p.id === pageId);
    if (!page) return;
    
    if (confirm(`Are you sure you want to delete "${page.label}"? This will also delete all content on this page.`)) {
      // Remove the page from the list
      setDynamicPages(prev => prev.filter(p => p.id !== pageId));
      
      // Remove the page's stored data
      localStorage.removeItem(`page-${pageId}`);
      
      // If currently on this page, navigate to home
      if (pathname === page.href) {
        router.push('/playground');
      }
    }
  };

  // Load dashboards from new storage system
  const [customDashboards, setCustomDashboards] = useState<Array<{ id: string; label: string; href: string }>>([])
  
  useEffect(() => {
    // Import dashboard storage utilities
    import('@/lib/dashboard-generation/storage').then(({ getAllDashboards }) => {
      const dashboards = getAllDashboards()
      const dashboardItems = dashboards.map(d => ({
        id: d.id,
        label: d.name,
        href: `/${d.id}`
      }))
      setCustomDashboards(dashboardItems)
    })
  }, [isLoaded])

  const handleDeleteDashboard = async (dashboardId: string, dashboardName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm(`Are you sure you want to delete "${dashboardName}"? This cannot be undone.`)) {
      // Import delete function
      const { deleteDashboard } = await import('@/lib/dashboard-generation/storage')
      deleteDashboard(dashboardId)
      
      // Update the list
      setCustomDashboards(prev => prev.filter(d => d.id !== dashboardId))
      
      // If currently on this dashboard, navigate to playground
      if (pathname === `/${dashboardId}`) {
        router.push('/playground')
      }
    }
  }

  // Organized navigation sections
  const dashboardItems: Array<{
    icon: any
    label: string
    href: string
    active: boolean
    isDeletable?: boolean
    dashboardId?: string
  }> = [
    { 
      icon: Layout, 
      label: "Dashboard", 
      href: "/playground",
      active: pathname === "/playground"
    },
    ...customDashboards.map(dash => ({
      icon: Layout,
      label: dash.label,
      href: dash.href,
      active: pathname === dash.href,
      isDeletable: true,
      dashboardId: dash.id
    }))
  ];

  const operationsItems = [
    { 
      icon: Zap, 
      label: "Playbooks", 
      href: "/playbooks",
      active: pathname === "/playbooks" || pathname.startsWith("/playbooks/")
    },
    { 
      icon: Workflow, 
      label: "Workflows", 
      href: "/workflows-v3",
      active: pathname === "/workflows-v3" || pathname.startsWith("/workflows-v3/")
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
      href: "/tasks-v2",
      active: pathname === "/tasks-v2" || pathname.startsWith("/tasks-v2/")
    },
  ];

  const omsItems = [
    { 
      icon: Package, 
      label: "Items", 
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
      icon: QrCode, 
      label: "Labels", 
      href: "/labels",
      active: pathname === "/labels" || pathname.startsWith("/labels/")
    },
  ];

  const utilitiesItems = [
    { 
      icon: Map, 
      label: "Map", 
      href: "/map",
      active: pathname === "/map" || pathname.startsWith("/map/")
    },
    { 
      icon: FileText, 
      label: "Notes", 
      href: "/notes",
      active: pathname === "/notes"
    },
    { 
      icon: Sparkles, 
      label: "Disco", 
      href: "/disco",
      active: pathname === "/disco"
    },
    { 
      icon: Users, 
      label: "Teams", 
      href: "/teams",
      active: pathname === "/teams"
    },
    { 
      icon: BarChart3, 
      label: "Reports", 
      href: "/reports",
      active: pathname === "/reports" || pathname.startsWith("/reports/")
    },
  ];

  const communicationsItems = [
    { 
      icon: BookUser, 
      label: "Rolodex", 
      href: "/rolodex",
      active: pathname === "/rolodex" || pathname.startsWith("/rolodex/")
    },
    { 
      icon: MessageSquare, 
      label: "Messages", 
      href: "/messages",
      active: pathname === "/messages"
    },
  ];


  // Helper to render a navigation section
  const renderSection = (
    items: typeof dashboardItems,
    sectionTitle?: string,
    badge?: string
  ) => (
    <div className={sidebarExpanded ? "mb-4" : "mb-1"}>
      {sidebarExpanded && sectionTitle && (
        <div className="px-2 py-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
            <span>{sectionTitle}</span>
            {badge && <span className="text-[10px] bg-sidebar-accent px-1.5 py-0.5 rounded">{badge}</span>}
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        {items.map(({ icon: Icon, label, href, active }) => (
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
  );

  return (
    <aside
      className={`transition-all duration-200 border-r bg-sidebar ${sidebarExpanded ? "w-60" : "w-16"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-3 h-full overflow-y-auto flex flex-col">
        {/* Dashboards Section */}
        <div className="mt-3">
          {sidebarExpanded ? (
            <div className="mb-4">
              <div className="px-2 py-2 mb-2">
                <div className="flex items-center justify-between text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                  <span>Dashboards</span>
                  <button
                    onClick={handleCreateDashboard}
                    className="p-1 hover:bg-sidebar-accent rounded text-sidebar-foreground"
                    title="New Dashboard"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                {dashboardItems.map((item) => (
                  <div
                    key={item.label}
                    className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent transition-colors ${
                      item.active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    </Link>
                    {item.isDeletable && (
                      <button
                        onClick={(e) => handleDeleteDashboard(item.dashboardId!, item.label, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600"
                        title="Delete Dashboard"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-1">
              <button
                onClick={handleCreateDashboard}
                className="w-full flex items-center justify-center px-3 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent mb-1"
                title="New Dashboard"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="space-y-1">
                {dashboardItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors ${
                      item.active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        {sidebarExpanded ? <div className="border-t border-sidebar-border my-4" /> : <div className="h-2" />}

        {/* Operations Section */}
        {renderSection(operationsItems, "Operations")}

        {/* Separator */}
        {sidebarExpanded ? <div className="border-t border-sidebar-border my-4" /> : <div className="h-2" />}

        {/* OMS Section */}
        {renderSection(omsItems, "OMS")}

        {/* Separator */}
        {sidebarExpanded ? <div className="border-t border-sidebar-border my-4" /> : <div className="h-2" />}

        {/* Utilities Section */}
        {renderSection(utilitiesItems, "Utilities")}

        {/* Separator */}
        {sidebarExpanded ? <div className="border-t border-sidebar-border my-4" /> : <div className="h-2" />}

        {/* Communications Section */}
        {renderSection(communicationsItems, "Communications")}

        {/* Separator */}
        {sidebarExpanded ? <div className="border-t border-sidebar-border my-4" /> : <div className="h-2" />}

        {/* Floor Input Section */}
        {renderSection(
          [{
            icon: Smartphone,
            label: "Floor",
            href: "/floor",
            active: pathname === "/floor" || pathname.startsWith("/floor/")
          }],
          "Floor Input",
          "Mobile"
        )}

        {/* Separator */}
        {sidebarExpanded ? <div className="border-t border-sidebar-border my-4" /> : <div className="h-2" />}
      </div>
    </aside>
  );
}