"use client"

/**
 * Floor Plan Builder for Onboarding
 * 
 * Simplified floor plan builder that saves directly to the contract
 */

import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Zone {
  id: string;
  type: string;
  name: string;
  area: number;
  units: 'sqft' | 'sqm';
}

interface Floor {
  name: string;
  zones: Zone[];
}

interface FloorPlanBuilderProps {
  value?: Floor[];
  onChange: (floors: Floor[]) => void;
}

const ZONE_TYPES = [
  { value: 'production', label: 'Production', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { value: 'storage', label: 'Storage', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { value: 'qa', label: 'Quality Assurance', color: 'bg-green-100 border-green-300 text-green-700' },
  { value: 'shipping', label: 'Shipping/Receiving', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { value: 'office', label: 'Office', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { value: 'other', label: 'Other', color: 'bg-gray-50 border-gray-200 text-gray-600' },
];

export function FloorPlanBuilder({ value = [], onChange }: FloorPlanBuilderProps) {
  const [editingZone, setEditingZone] = useState<{ floorIndex: number; zoneIndex: number } | null>(null);
  const [newZone, setNewZone] = useState<Partial<Zone>>({
    type: 'production',
    name: '',
    area: 0,
    units: 'sqft',
  });

  const addFloor = () => {
    const newFloor: Floor = {
      name: `Floor ${value.length + 1}`,
      zones: [],
    };
    onChange([...value, newFloor]);
  };

  const removeFloor = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateFloorName = (index: number, name: string) => {
    const updated = [...value];
    updated[index].name = name;
    onChange(updated);
  };

  const addZone = (floorIndex: number) => {
    if (!newZone.name || !newZone.area) return;

    const zone: Zone = {
      id: `zone-${Date.now()}`,
      type: newZone.type || 'other',
      name: newZone.name,
      area: newZone.area,
      units: newZone.units || 'sqft',
    };

    const updated = [...value];
    updated[floorIndex].zones.push(zone);
    onChange(updated);

    // Reset form
    setNewZone({
      type: 'production',
      name: '',
      area: 0,
      units: 'sqft',
    });
  };

  const removeZone = (floorIndex: number, zoneIndex: number) => {
    const updated = [...value];
    updated[floorIndex].zones.splice(zoneIndex, 1);
    onChange(updated);
  };

  const updateZone = (floorIndex: number, zoneIndex: number, zone: Partial<Zone>) => {
    const updated = [...value];
    updated[floorIndex].zones[zoneIndex] = {
      ...updated[floorIndex].zones[zoneIndex],
      ...zone,
    };
    onChange(updated);
  };

  const getZoneTypeColor = (type: string) => {
    return ZONE_TYPES.find(t => t.value === type)?.color || ZONE_TYPES[ZONE_TYPES.length - 1].color;
  };

  return (
    <div className="space-y-6">
      {/* Floors List */}
      {value.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-600 mb-4">No floors added yet</p>
          <button
            type="button"
            onClick={addFloor}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add First Floor
          </button>
        </div>
      )}

      {value.map((floor, floorIndex) => (
        <div key={floorIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
          {/* Floor Header */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={floor.name}
              onChange={(e) => updateFloorName(floorIndex, e.target.value)}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => removeFloor(floorIndex)}
              className="text-red-600 hover:text-red-700 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Zones Grid */}
          <div className="space-y-2 mb-4">
            {floor.zones.length === 0 && (
              <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded border border-dashed border-gray-300">
                No zones added to this floor
              </p>
            )}

            {floor.zones.map((zone, zoneIndex) => (
              <div
                key={zone.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${getZoneTypeColor(zone.type)}`}
              >
                <div className="flex-1">
                  {editingZone?.floorIndex === floorIndex && editingZone?.zoneIndex === zoneIndex ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => updateZone(floorIndex, zoneIndex, { name: e.target.value })}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                        placeholder="Zone name"
                      />
                      <input
                        type="number"
                        value={zone.area}
                        onChange={(e) => updateZone(floorIndex, zoneIndex, { area: parseFloat(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                        placeholder="Area"
                      />
                      <select
                        value={zone.units}
                        onChange={(e) => updateZone(floorIndex, zoneIndex, { units: e.target.value as 'sqft' | 'sqm' })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                      >
                        <option value="sqft">sq ft</option>
                        <option value="sqm">sq m</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setEditingZone(null)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{zone.name}</span>
                      <span className="text-xs text-gray-600">
                        {zone.area.toLocaleString()} {zone.units}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-white/50 rounded">
                        {ZONE_TYPES.find(t => t.value === zone.type)?.label || zone.type}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingZone({ floorIndex, zoneIndex })}
                    className="p-1 hover:bg-white/50 rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeZone(floorIndex, zoneIndex)}
                    className="p-1 hover:bg-white/50 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Zone Form */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 grid grid-cols-4 gap-2">
                <select
                  value={newZone.type}
                  onChange={(e) => setNewZone({ ...newZone, type: e.target.value })}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                >
                  {ZONE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  placeholder="Zone name"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={newZone.area || ''}
                  onChange={(e) => setNewZone({ ...newZone, area: parseFloat(e.target.value) || 0 })}
                  placeholder="Area"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                <select
                  value={newZone.units}
                  onChange={(e) => setNewZone({ ...newZone, units: e.target.value as 'sqft' | 'sqm' })}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="sqft">sq ft</option>
                  <option value="sqm">sq m</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => addZone(floorIndex)}
                disabled={!newZone.name || !newZone.area}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Zone
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Floor Button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={addFloor}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Another Floor
        </button>
      )}
    </div>
  );
}

