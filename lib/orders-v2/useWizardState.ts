// Wizard state management hook

import { useState, useMemo } from "react"
import type { OrderInfo, ItemProfile, WizardStep } from "./types"

export function useWizardState() {
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    name: "",
    client: "",
    startDate: "", // Required field
    shipDate: "",
    contacts: [],
    owner: "",
    team: "",
    orderNumber: "",
    symbol: "",
    priority: undefined,
    flags: [],
  })
  
  const [items, setItems] = useState<ItemProfile[]>([
    {
      id: `item-${Date.now()}`,
      name: "",
      code: "",
      quantity: 0,
      complexity: "simple",
      attributes: [],
      traceability: {
        enabled: false,
        complianceRegions: [],
        shareWithPartners: false,
        includeLifecycleStages: false,
        includeMaterialCertificates: false,
        includeCarbonAccounting: false,
      },
      labelFields: [],
      includeLogo: false,
      components: [],
      attachments: [],
      workflow: "",
      location: "",
      startDate: "",
      endDate: "",
    }
  ])
  
  const [currentStep, setCurrentStep] = useState(0) // 0 = order info, 1..N = items, N+1 = review
  
  // Calculate total steps: 1 (order info) + items.length + 1 (review)
  const totalSteps = useMemo(() => 1 + items.length + 1, [items.length])
  
  // Calculate progress percentage
  const progress = useMemo(() => (currentStep / (totalSteps - 1)) * 100, [currentStep, totalSteps])
  
  // Determine current wizard step type
  const stepType: WizardStep = useMemo(() => {
    if (currentStep === 0) return "order-info"
    if (currentStep === totalSteps - 1) return "review"
    return "item"
  }, [currentStep, totalSteps])
  
  // Get active item index (for item steps)
  const activeItemIndex = useMemo(() => {
    if (stepType === "item") {
      return currentStep - 1 // Subtract 1 for order info step
    }
    return 0
  }, [currentStep, stepType])
  
  const activeItem = items[activeItemIndex]
  
  // Navigation
  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const goPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step)
    }
  }
  
  // Item management
  const updateItem = (itemId: string, updates: Partial<ItemProfile>) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ))
  }
  
  const addItem = () => {
    const newItem: ItemProfile = {
      id: `item-${Date.now()}`,
      name: "",
      code: "",
      quantity: 0,
      complexity: "simple",
      attributes: [],
      traceability: {
        enabled: false,
        complianceRegions: [],
        shareWithPartners: false,
        includeLifecycleStages: false,
        includeMaterialCertificates: false,
        includeCarbonAccounting: false,
      },
      labelFields: [],
      includeLogo: false,
      components: [],
      attachments: [],
      workflow: "",
      location: "",
      startDate: "",
      endDate: "",
    }
    setItems([...items, newItem])
  }
  
  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }
  
  // Validation
  const canProceed = useMemo(() => {
    if (stepType === "order-info") {
      return orderInfo.name.trim() !== "" && 
             orderInfo.client.trim() !== "" &&
             orderInfo.startDate.trim() !== ""
    }
    if (stepType === "item") {
      return activeItem && activeItem.name.trim() !== "" && activeItem.quantity > 0
    }
    return true // Review step can always proceed
  }, [stepType, orderInfo, activeItem])
  
  return {
    // State
    orderInfo,
    setOrderInfo,
    items,
    setItems,
    currentStep,
    totalSteps,
    progress,
    stepType,
    activeItemIndex,
    activeItem,
    
    // Navigation
    goNext,
    goPrevious,
    goToStep,
    canProceed,
    
    // Item management
    updateItem,
    addItem,
    removeItem,
  }
}

