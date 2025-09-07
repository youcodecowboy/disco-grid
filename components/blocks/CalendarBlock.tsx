"use client"

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { generateId } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react'
import { format, addMonths, subMonths, isSameDay, isToday } from 'date-fns'

interface Event {
  id: string
  title: string
  date: Date
  type: 'meeting' | 'deadline' | 'reminder' | 'task'
  description?: string
}

interface CalendarBlockProps {
  title?: string
  events?: Event[]
  onEventAdd?: (event: Event) => void
  onEventClick?: (event: Event) => void
  className?: string
}

export function CalendarBlock({
  title = "Calendar",
  events = [],
  onEventAdd,
  onEventClick,
  className = ""
}: CalendarBlockProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const eventTypes = {
    meeting: { color: 'bg-blue-100 text-blue-800', icon: '📅' },
    deadline: { color: 'bg-red-100 text-red-800', icon: '⏰' },
    reminder: { color: 'bg-yellow-100 text-yellow-800', icon: '🔔' },
    task: { color: 'bg-green-100 text-green-800', icon: '✅' }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleAddEvent = () => {
    if (selectedDate && onEventAdd) {
      const newEvent: Event = {
        id: generateId("event"),
        title: 'New Event',
        date: selectedDate,
        type: 'meeting',
        description: ''
      }
      onEventAdd(newEvent)
    }
  }

  const renderDayContent = (date: Date) => {
    const dayEvents = getEventsForDate(date)
    const isSelected = selectedDate && isSameDay(date, selectedDate)
    const isCurrentDay = isToday(date)

    return (
      <div className={`relative w-full h-full min-h-[60px] p-1 ${isSelected ? 'bg-blue-50' : ''}`}>
        <div className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600 font-bold' : ''}`}>
          {format(date, 'd')}
        </div>
        
        {dayEvents.length > 0 && (
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${eventTypes[event.type].color}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick?.(event)
                }}
                title={event.title}
              >
                {eventTypes[event.type].icon} {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 px-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={currentDate}
          onMonthChange={setCurrentDate}
          className="w-full"
          components={{
            DayContent: ({ date }) => renderDayContent(date)
          }}
        />
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="border-t p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddEvent}
              className="h-6 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Event
            </Button>
          </div>
          
          <div className="space-y-2">
            {getEventsForDate(selectedDate).map((event) => (
              <div
                key={event.id}
                className={`p-2 rounded cursor-pointer ${eventTypes[event.type].color}`}
                onClick={() => onEventClick?.(event)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{eventTypes[event.type].icon}</span>
                    <span className="font-medium text-sm">{event.title}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                </div>
                {event.description && (
                  <p className="text-xs mt-1 opacity-75">{event.description}</p>
                )}
              </div>
            ))}
            
            {getEventsForDate(selectedDate).length === 0 && (
              <div className="text-sm text-gray-500 text-center py-4">
                No events scheduled for this date
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Type Legend */}
      <div className="border-t p-4">
        <h4 className="font-medium text-sm mb-2">Event Types</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(eventTypes).map(([type, config]) => (
            <div key={type} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
              <span className="text-xs capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
