"use client"

import { Contact, getCategoryColor, getRelationshipIcon, getRelationshipColor, getAvatarInitials, getAvatarColor } from "@/lib/data/contacts"

type ContactCardProps = {
  contact: Contact
  onClick?: () => void
}

const MailIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PhoneIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const GlobeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ShoppingBagIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

const CalendarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const MessageIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const PhoneCallIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const QRCodeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
)

const FlagIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

const NoteIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const avatarInitials = getAvatarInitials(contact.name)
  const avatarColor = getAvatarColor(contact.name)
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border-2 border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className={`${avatarColor} w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}>
          {contact.avatar ? (
            <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            avatarInitials
          )}
        </div>

        {/* Name and Title */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
            {contact.displayName || contact.name}
          </h3>
          {contact.title && (
            <p className="text-sm text-gray-600 mb-1">{contact.title}</p>
          )}
          {contact.organization && contact.category !== "Client" && (
            <p className="text-sm text-gray-500">{contact.organization}</p>
          )}
        </div>

        {/* Category Badge */}
        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(contact.category)}`}>
            {contact.category}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MailIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition-colors truncate" onClick={(e) => e.stopPropagation()}>
            {contact.email}
          </a>
        </div>
        
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a href={`tel:${contact.phone}`} className="hover:text-blue-600 transition-colors" onClick={(e) => e.stopPropagation()}>
              {contact.phone}
            </a>
          </div>
        )}
        
        {contact.website && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GlobeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors truncate" onClick={(e) => e.stopPropagation()}>
              {contact.website.replace('https://', '')}
            </a>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-center gap-1 mb-4 pt-3 border-t border-gray-200">
        <button
          onClick={(e) => {
            e.stopPropagation()
            alert(`Send message to ${contact.name}`)
          }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          title="Send Message"
        >
          <MessageIcon className="w-3.5 h-3.5" />
          <span>Message</span>
        </button>
        
        {contact.phone && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `tel:${contact.phone}`
            }}
            className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Call"
          >
            <PhoneCallIcon className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            alert(`QR Code for ${contact.name} - Save to phone or scan on device`)
          }}
          className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Show QR Code"
        >
          <QRCodeIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            alert(`Add note for ${contact.name}`)
          }}
          className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Add Note"
        >
          <NoteIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            alert(`Flag ${contact.name}`)
          }}
          className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
          title="Flag Contact"
        >
          <FlagIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Tags */}
      {contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {contact.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats for Clients */}
      {contact.category === "Client" && (contact.totalOrders || contact.totalValue) && (
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
          {contact.totalOrders !== undefined && (
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Orders</div>
              <div className="font-semibold text-gray-900">{contact.totalOrders}</div>
            </div>
          )}
          {contact.activeOrders !== undefined && (
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Active</div>
              <div className="font-semibold text-blue-600">{contact.activeOrders}</div>
            </div>
          )}
          {contact.totalValue !== undefined && (
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Value</div>
              <div className="font-semibold text-green-600">${(contact.totalValue / 1000).toFixed(0)}k</div>
            </div>
          )}
        </div>
      )}

      {/* Footer with Relationship and Last Contact */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getRelationshipColor(contact.relationshipStrength)}`}>
            {getRelationshipIcon(contact.relationshipStrength)}
          </span>
          <span className="text-xs text-gray-500">{contact.relationshipStrength}</span>
        </div>
        
        {contact.lastContactDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
            {formatDate(contact.lastContactDate)}
          </div>
        )}
      </div>
    </div>
  )
}
