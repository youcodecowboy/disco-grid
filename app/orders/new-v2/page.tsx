"use client"

import { useRouter } from "next/navigation"
import { LayoutScaffold } from "@/components/grid-v2/LayoutScaffold"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/orders-v2/ProgressBar"
import { OrderInfoStep } from "./steps/OrderInfoStep"
import { ItemBuilderStep } from "./steps/ItemBuilderStep"
import { ReviewCalendarStep } from "./steps/ReviewCalendarStep"
import { useWizardState } from "@/lib/orders-v2/useWizardState"
import { ArrowLeft, ArrowRight, Plus } from "lucide-react"

export default function NewOrderV2Page() {
  const router = useRouter()
  const wizard = useWizardState()

  const handleSubmit = () => {
    // Create order and navigate
    console.log("Creating order:", {
      orderInfo: wizard.orderInfo,
      items: wizard.items,
    })
    router.push("/orders")
  }

  return (
    <LayoutScaffold
      pageTitle="Create New Order"
      pageSubtext="Build your order step by step"
      headerActions={
        <Button variant="ghost" onClick={() => router.push("/orders")}>
          Cancel
        </Button>
      }
    >
      <div className="max-w-6xl mx-auto py-6 pb-32 space-y-6">
        {/* Progress Bar */}
        <ProgressBar
          progress={wizard.progress}
          currentStep={wizard.currentStep}
          totalSteps={wizard.totalSteps}
        />

        {/* Step Content */}
        <div className="min-h-[600px]">
          {wizard.stepType === "order-info" && (
            <OrderInfoStep
              orderInfo={wizard.orderInfo}
              onChange={(updates) => wizard.setOrderInfo({ ...wizard.orderInfo, ...updates })}
            />
          )}

          {wizard.stepType === "item" && wizard.activeItem && (
            <ItemBuilderStep
              item={wizard.activeItem}
              itemIndex={wizard.activeItemIndex}
              totalItems={wizard.items.length}
              onChange={(updates) => wizard.updateItem(wizard.activeItem.id, updates)}
            />
          )}

          {wizard.stepType === "review" && (
            <ReviewCalendarStep
              orderInfo={wizard.orderInfo}
              items={wizard.items}
              onEditOrderInfo={() => wizard.goToStep(0)}
              onEditItem={(index) => wizard.goToStep(1 + index)}
            />
          )}
        </div>
      </div>

      {/* Sticky Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={wizard.goPrevious}
            disabled={wizard.currentStep === 0}
            className="rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {/* Right side actions - different per step type */}
          <div className="flex items-center gap-3">
            {wizard.stepType === "order-info" && (
              <Button
                onClick={wizard.goNext}
                disabled={!wizard.canProceed}
                className="rounded-full bg-sky-600 hover:bg-sky-700 text-white px-6"
              >
                Continue to Items
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {wizard.stepType === "item" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    wizard.addItem()
                    wizard.goNext()
                  }}
                  disabled={!wizard.canProceed}
                  className="rounded-full border-sky-200 text-sky-700 hover:bg-sky-50 px-5"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Item
                </Button>
                <Button
                  onClick={() => {
                    // Jump to review step
                    wizard.goToStep(wizard.totalSteps - 1)
                  }}
                  disabled={!wizard.canProceed}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                >
                  Complete Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {wizard.stepType === "review" && (
              <Button
                onClick={handleSubmit}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6"
              >
                Submit Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </LayoutScaffold>
  )
}

