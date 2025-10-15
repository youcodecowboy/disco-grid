/**
 * Label Template Management
 * 
 * CRUD operations and default templates for label generation
 */

import { LabelTemplate } from './types'

const STORAGE_KEY = 'groovy:label-templates:v1'

/**
 * Default label templates
 */
export const DEFAULT_TEMPLATES: LabelTemplate[] = [
  {
    id: 'default-standard',
    name: 'Standard Label (Logo + QR + Details)',
    type: 'organization-default',
    orientation: 'landscape',
    dimensions: {
      width: 101.6,  // 4 inches
      height: 50.8,  // 2 inches
      unit: 'mm'
    },
    logo: {
      enabled: true,
      position: { x: 5, y: 5 },
      size: { width: 30, height: 12 },
      alignment: 'top-left'
    },
    qrCode: {
      position: { x: 63, y: 8 },  // 101.6 - 35 - 3.6 = 63 (fits within bounds)
      size: 35,
      errorCorrection: 'M'
    },
    textElements: [
      {
        id: 'item-name',
        type: 'field',
        fieldId: 'name',
        position: { x: 5, y: 20 },
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#000000',
          alignment: 'left'
        },
        maxWidth: 60
      },
      {
        id: 'item-code',
        type: 'field',
        fieldId: 'code',
        label: 'SKU:',
        position: { x: 5, y: 30 },
        style: {
          fontFamily: 'Arial',
          fontSize: 9,
          fontWeight: 'normal',
          color: '#333333',
          alignment: 'left'
        }
      },
      {
        id: 'serial-number',
        type: 'field',
        fieldId: 'serialNumber',
        label: 'Serial:',
        position: { x: 5, y: 38 },
        style: {
          fontFamily: 'Arial',
          fontSize: 9,
          fontWeight: 'normal',
          color: '#333333',
          alignment: 'left'
        }
      }
    ],
    styling: {
      backgroundColor: '#FFFFFF',
      borderEnabled: true,
      borderWidth: 1,
      borderColor: '#CCCCCC',
      padding: 2
    },
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'minimal-qr',
    name: 'Minimal QR Only',
    type: 'custom',
    orientation: 'portrait',
    dimensions: {
      width: 50.8,   // 2 inches
      height: 50.8,  // 2 inches
      unit: 'mm'
    },
    logo: {
      enabled: false,
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      alignment: 'top-center'
    },
    qrCode: {
      position: { x: 5, y: 5 },
      size: 40,
      errorCorrection: 'H'
    },
    textElements: [
      {
        id: 'code-only',
        type: 'field',
        fieldId: 'code',
        position: { x: 25, y: 48 },
        style: {
          fontFamily: 'Arial',
          fontSize: 7,
          fontWeight: 'normal',
          color: '#000000',
          alignment: 'center'
        }
      }
    ],
    styling: {
      backgroundColor: '#FFFFFF',
      borderEnabled: false,
      padding: 0
    },
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: 'component-tag',
    name: 'Component Tag',
    type: 'item-type',
    itemType: 'component',
    orientation: 'landscape',
    dimensions: {
      width: 76.2,   // 3 inches
      height: 50.8,  // 2 inches
      unit: 'mm'
    },
    logo: {
      enabled: true,
      position: { x: 3, y: 3 },
      size: { width: 20, height: 8 },
      alignment: 'top-left'
    },
    qrCode: {
      position: { x: 50, y: 8 },
      size: 34,
      errorCorrection: 'M'
    },
    textElements: [
      {
        id: 'component-name',
        type: 'field',
        fieldId: 'name',
        position: { x: 3, y: 15 },
        style: {
          fontFamily: 'Arial',
          fontSize: 10,
          fontWeight: 'bold',
          color: '#000000',
          alignment: 'left'
        },
        maxWidth: 44
      },
      {
        id: 'parent-item',
        type: 'field',
        fieldId: 'parentItemName',
        label: 'Part of:',
        position: { x: 3, y: 28 },
        style: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: 'normal',
          color: '#666666',
          alignment: 'left'
        },
        maxWidth: 44
      },
      {
        id: 'component-code',
        type: 'field',
        fieldId: 'code',
        position: { x: 3, y: 38 },
        style: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: 'normal',
          color: '#333333',
          alignment: 'left'
        }
      }
    ],
    styling: {
      backgroundColor: '#FFF9E6',
      borderEnabled: true,
      borderWidth: 1,
      borderColor: '#FFB800',
      padding: 2
    },
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  }
]

/**
 * Get all label templates
 */
export function getAllTemplates(): LabelTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const userTemplates = JSON.parse(stored) as LabelTemplate[]
      
      // Create a map of stored templates by ID
      const storedMap = new Map(userTemplates.map(t => [t.id, t]))
      
      // Merge: Use stored version if it exists, otherwise use default
      const mergedDefaults = DEFAULT_TEMPLATES.map(defaultTemplate => 
        storedMap.has(defaultTemplate.id) ? storedMap.get(defaultTemplate.id)! : defaultTemplate
      )
      
      // Add any user templates that aren't overrides of defaults
      const defaultIds = new Set(DEFAULT_TEMPLATES.map(t => t.id))
      const uniqueUserTemplates = userTemplates.filter(t => !defaultIds.has(t.id))
      
      return [...mergedDefaults, ...uniqueUserTemplates]
    }
  } catch (error) {
    console.error('Failed to load templates:', error)
  }
  return DEFAULT_TEMPLATES
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): LabelTemplate | undefined {
  return getAllTemplates().find(t => t.id === id)
}

/**
 * Get default template
 */
export function getDefaultTemplate(): LabelTemplate {
  return DEFAULT_TEMPLATES[0]
}

/**
 * Get template by item type
 */
export function getTemplateByItemType(itemType: string): LabelTemplate | undefined {
  return getAllTemplates().find(t => t.type === 'item-type' && t.itemType === itemType)
}

/**
 * Save template
 */
export function saveTemplate(template: LabelTemplate): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let templates: LabelTemplate[] = stored ? JSON.parse(stored) : []
    
    const existingIndex = templates.findIndex(t => t.id === template.id)
    if (existingIndex >= 0) {
      templates[existingIndex] = { ...template, updatedAt: new Date().toISOString() }
    } else {
      templates.push({ ...template, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch (error) {
    console.error('Failed to save template:', error)
  }
}

/**
 * Delete template
 */
export function deleteTemplate(id: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    
    const templates: LabelTemplate[] = JSON.parse(stored)
    const filtered = templates.filter(t => t.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete template:', error)
  }
}

/**
 * Duplicate template
 */
export function duplicateTemplate(id: string, newName: string): LabelTemplate | undefined {
  const original = getTemplateById(id)
  if (!original) return undefined
  
  const duplicate: LabelTemplate = {
    ...original,
    id: `template-${Date.now()}`,
    name: newName,
    type: 'custom',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  saveTemplate(duplicate)
  return duplicate
}

