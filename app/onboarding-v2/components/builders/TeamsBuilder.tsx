"use client"

/**
 * Teams Builder for Onboarding
 * 
 * Departments, roles, and access levels using Lego UI pattern
 */

import { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

export interface TeamMember {
  role: string;
  count: number;
  department: string;
  accessLevel: 'viewer' | 'editor' | 'admin';
}

interface TeamsBuilderProps {
  value?: TeamMember[];
  onChange: (teams: TeamMember[]) => void;
}

const DEPARTMENTS = [
  'Production',
  'Quality',
  'Logistics',
  'Warehouse',
  'Engineering',
  'Planning',
  'Sales',
  'Management',
  'Other',
];

const ACCESS_LEVELS = [
  { value: 'viewer', label: 'Viewer', description: 'View only, no edits', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'editor', label: 'Editor', description: 'Can view and edit', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'admin', label: 'Admin', description: 'Full access', color: 'bg-purple-100 text-purple-700 border-purple-300' },
];

const DEFAULT_TEAMS: TeamMember[] = [
  { role: 'Production Manager', count: 2, department: 'Production', accessLevel: 'editor' },
  { role: 'Production Worker', count: 15, department: 'Production', accessLevel: 'editor' },
  { role: 'Quality Inspector', count: 3, department: 'Quality', accessLevel: 'editor' },
  { role: 'Warehouse Staff', count: 5, department: 'Warehouse', accessLevel: 'editor' },
];

export function TeamsBuilder({ value, onChange }: TeamsBuilderProps) {
  const teams = value && value.length > 0 ? value : DEFAULT_TEAMS;
  const [newTeam, setNewTeam] = useState<Partial<TeamMember>>({
    role: '',
    count: 1,
    department: 'Production',
    accessLevel: 'editor',
  });

  const addTeam = () => {
    if (!newTeam.role) return;

    const team: TeamMember = {
      role: newTeam.role,
      count: newTeam.count || 1,
      department: newTeam.department || 'Production',
      accessLevel: newTeam.accessLevel || 'editor',
    };

    onChange([...teams, team]);

    // Reset form
    setNewTeam({
      role: '',
      count: 1,
      department: 'Production',
      accessLevel: 'editor',
    });
  };

  const removeTeam = (index: number) => {
    const updated = teams.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateTeam = (index: number, updates: Partial<TeamMember>) => {
    const updated = [...teams];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const getTotalMembers = () => {
    return teams.reduce((sum, team) => sum + team.count, 0);
  };

  const getDepartmentCount = () => {
    return new Set(teams.map(t => t.department)).size;
  };

  const getAccessLevelColor = (level: string) => {
    return ACCESS_LEVELS.find(al => al.value === level)?.color || ACCESS_LEVELS[1].color;
  };

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-sm text-purple-900 font-medium">{getTotalMembers()} People</div>
              <div className="text-xs text-purple-700">Total Team Size</div>
            </div>
          </div>
          <div className="border-l border-purple-300 pl-6">
            <div className="text-sm text-purple-900 font-medium">{getDepartmentCount()} Departments</div>
            <div className="text-xs text-purple-700">Across organization</div>
          </div>
          <div className="border-l border-purple-300 pl-6">
            <div className="text-sm text-purple-900 font-medium">{teams.length} Roles</div>
            <div className="text-xs text-purple-700">Unique positions</div>
          </div>
        </div>
      </div>

      {/* Teams List */}
      <div className="space-y-2">
        {teams.map((team, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
          >
            {/* Role */}
            <div className="flex-1">
              <input
                type="text"
                value={team.role}
                onChange={(e) => updateTeam(index, { role: e.target.value })}
                className="w-full px-2 py-1 text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                placeholder="Role name"
              />
            </div>

            {/* Count */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={team.count}
                onChange={(e) => updateTeam(index, { count: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
              />
            </div>

            {/* Department */}
            <select
              value={team.department}
              onChange={(e) => updateTeam(index, { department: e.target.value })}
              className="px-3 py-1 text-xs border border-gray-300 rounded bg-white"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Access Level */}
            <select
              value={team.accessLevel}
              onChange={(e) => updateTeam(index, { accessLevel: e.target.value as any })}
              className={`px-3 py-1 text-xs border rounded font-medium ${getAccessLevelColor(team.accessLevel)}`}
            >
              {ACCESS_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeTeam(index)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Team Form */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 grid grid-cols-4 gap-2">
            <input
              type="text"
              value={newTeam.role}
              onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && addTeam()}
              placeholder="Role name (e.g., Shift Supervisor)"
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              value={newTeam.count}
              onChange={(e) => setNewTeam({ ...newTeam, count: parseInt(e.target.value) || 1 })}
              min="1"
              placeholder="Count"
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
            <select
              value={newTeam.department}
              onChange={(e) => setNewTeam({ ...newTeam, department: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={newTeam.accessLevel}
              onChange={(e) => setNewTeam({ ...newTeam, accessLevel: e.target.value as any })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              {ACCESS_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addTeam}
            disabled={!newTeam.role}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Role
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter or click "Add Role" to add a new team member role
        </p>
      </div>

      {/* Access Level Guide */}
      <div className="grid grid-cols-3 gap-2">
        {ACCESS_LEVELS.map(level => (
          <div key={level.value} className={`p-2 border rounded-lg ${level.color}`}>
            <div className="text-xs font-medium mb-0.5">{level.label}</div>
            <div className="text-xs opacity-80">{level.description}</div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Tip:</strong> List all the different roles in your organization. You can assign multiple people to the same role using the count field.
        </p>
      </div>
    </div>
  );
}

