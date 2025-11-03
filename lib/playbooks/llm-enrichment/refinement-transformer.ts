/**
 * Playbook Refinement Transformer
 * 
 * Applies refinement operations to existing playbook
 */

import type { Playbook, Play } from '../types';
import { transformLLMPlayToPlay } from '../llm-transformer';
import type { LLMPlayResponse } from '../llm-transformer';

export interface RefinementOperation {
  action: 'add' | 'edit' | 'remove';
  playId?: string;
  playTitle?: string;
  newPlay?: LLMPlayResponse;
  modifications?: Partial<Play>;
  reasoning?: string;
}

export interface RefinementResult {
  operations: RefinementOperation[];
  summary?: string;
}

/**
 * Apply refinement operations to playbook
 */
export function applyRefinementOperations(
  playbook: Playbook,
  operations: RefinementOperation[]
): { updatedPlaybook: Playbook; changes: string[] } {
  const changes: string[] = [];
  let updatedPlaybook: Playbook = JSON.parse(JSON.stringify(playbook)); // Deep clone

  console.log(`🔧 Applying ${operations.length} refinement operations to playbook "${playbook.name}"`);
  console.log(`📋 Current plays: ${playbook.plays.length}`);

  operations.forEach((op, index) => {
    try {
      const opDesc = `${op.action}${op.playTitle ? ` - "${op.playTitle}"` : op.playId ? ` - ID: ${op.playId}` : ''}`;
      console.log(`  Operation ${index + 1}/${operations.length}: ${opDesc}`);
      if (op.reasoning) {
        console.log(`    Reasoning: ${op.reasoning}`);
      }
      
      switch (op.action) {
        case 'add':
          changes.push(applyAddOperation(updatedPlaybook, op));
          break;
        case 'edit':
          changes.push(applyEditOperation(updatedPlaybook, op));
          break;
        case 'remove':
          changes.push(applyRemoveOperation(updatedPlaybook, op));
          break;
      }
    } catch (error) {
      const errorMsg = `Failed to apply operation ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`  ❌ ${errorMsg}`);
      changes.push(errorMsg);
    }
  });

  // Re-sequence plays after modifications
  updatedPlaybook.plays = updatedPlaybook.plays
    .sort((a, b) => a.sequence - b.sequence)
    .map((play, index) => ({
      ...play,
      sequence: index + 1
    }));

  console.log(`✅ Refinement complete: ${changes.length} changes applied, ${updatedPlaybook.plays.length} total plays`);

  return { updatedPlaybook, changes };
}

/**
 * Apply add operation
 */
function applyAddOperation(playbook: Playbook, op: RefinementOperation): string {
  if (!op.newPlay) {
    throw new Error('Add operation requires newPlay');
  }

  console.log(`    ➕ Adding new play: "${op.newPlay.title || 'Untitled'}"`);

  // Transform LLM play to Play type
  const newPlay = transformLLMPlayToPlay(
    op.newPlay,
    playbook.id,
    playbook.createdBy,
    playbook.plays // Pass existing plays for dependency resolution
  );

  // Set sequence to end if not specified
  if (!op.newPlay.sequence || op.newPlay.sequence === 0) {
    newPlay.sequence = playbook.plays.length + 1;
    console.log(`    📍 Setting sequence to end: ${newPlay.sequence}`);
  } else {
    // Insert at specified sequence (adjust existing sequences)
    const insertIndex = Math.min(op.newPlay.sequence - 1, playbook.plays.length);
    playbook.plays.forEach((play, index) => {
      if (play.sequence >= op.newPlay!.sequence!) {
        play.sequence = play.sequence + 1;
      }
    });
    newPlay.sequence = op.newPlay.sequence;
    console.log(`    📍 Inserting at sequence: ${newPlay.sequence}`);
  }

  playbook.plays.push(newPlay);
  playbook.updatedAt = new Date().toISOString();

  console.log(`    ✅ Successfully added play: "${newPlay.title}" (ID: ${newPlay.id})`);
  return `Added play: "${newPlay.title}"`;
}

/**
 * Apply edit operation
 */
function applyEditOperation(playbook: Playbook, op: RefinementOperation): string {
  if (!op.modifications) {
    throw new Error('Edit operation requires modifications');
  }

  console.log(`    ✏️ Editing play: ${op.playTitle || op.playId}`);
  console.log(`    📝 Modifications:`, Object.keys(op.modifications));

  // Find play to edit
  let playToEdit: Play | undefined;
  
  if (op.playId) {
    playToEdit = playbook.plays.find(p => p.id === op.playId);
    console.log(`    🔍 Searching by ID: ${op.playId}`);
  } else if (op.playTitle) {
    // Try exact match first
    playToEdit = playbook.plays.find(p => 
      p.title.toLowerCase() === op.playTitle!.toLowerCase()
    );
    console.log(`    🔍 Searching by title (exact): "${op.playTitle}"`);
    // Try partial match
    if (!playToEdit) {
      playToEdit = playbook.plays.find(p => 
        p.title.toLowerCase().includes(op.playTitle!.toLowerCase()) ||
        op.playTitle!.toLowerCase().includes(p.title.toLowerCase())
      );
      console.log(`    🔍 Searching by title (partial): "${op.playTitle}"`);
    }
  }

  if (!playToEdit) {
    const availablePlays = playbook.plays.map(p => `"${p.title}" (${p.id})`).join(', ');
    console.error(`    ❌ Play not found. Available plays: ${availablePlays}`);
    throw new Error(`Play not found: ${op.playTitle || op.playId}`);
  }

  console.log(`    ✅ Found play: "${playToEdit.title}" (ID: ${playToEdit.id})`);

  // Apply modifications
  if (op.modifications.title) {
    playToEdit.title = op.modifications.title;
  }
  if (op.modifications.description !== undefined) {
    playToEdit.description = op.modifications.description;
  }
  if (op.modifications.trigger) {
    // Merge trigger updates (for partial updates like just changing workflowId)
    if (playToEdit.trigger.type === op.modifications.trigger.type) {
      // Same trigger type - merge properties
      playToEdit.trigger = {
        ...playToEdit.trigger,
        ...op.modifications.trigger
      } as Play['trigger'];
    } else {
      // Different trigger type - replace entirely
      playToEdit.trigger = op.modifications.trigger;
    }
  }
  if (op.modifications.taskTemplate) {
    playToEdit.taskTemplate = {
      ...playToEdit.taskTemplate,
      ...op.modifications.taskTemplate
    };
  }
  if (op.modifications.assignment) {
    playToEdit.assignment = op.modifications.assignment;
  }
  if (op.modifications.dependencies) {
    // Resolve dependencies by play title
    playToEdit.dependencies = op.modifications.dependencies.map(dep => {
      const depPlay = playbook.plays.find(p => 
        p.title.toLowerCase() === dep.playTitle.toLowerCase()
      );
      return {
        ...dep,
        playId: depPlay?.id || dep.playId || ''
      };
    });
  }
  if (op.modifications.sequence !== undefined) {
    // Re-sequence other plays
    const oldSequence = playToEdit.sequence;
    const newSequence = op.modifications.sequence;
    
    playbook.plays.forEach(play => {
      if (play.id === playToEdit!.id) return;
      
      if (oldSequence < newSequence) {
        // Moving forward
        if (play.sequence > oldSequence && play.sequence <= newSequence) {
          play.sequence = play.sequence - 1;
        }
      } else {
        // Moving backward
        if (play.sequence >= newSequence && play.sequence < oldSequence) {
          play.sequence = play.sequence + 1;
        }
      }
    });
    
    playToEdit.sequence = newSequence;
  }

  playToEdit.updatedAt = new Date().toISOString();
  playbook.updatedAt = new Date().toISOString();

  console.log(`    ✅ Successfully edited play: "${playToEdit.title}"`);
  return `Edited play: "${playToEdit.title}"`;
}

/**
 * Apply remove operation
 */
function applyRemoveOperation(playbook: Playbook, op: RefinementOperation): string {
  console.log(`    🗑️ Removing play: ${op.playTitle || op.playId}`);
  
  // Find play to remove
  let playToRemove: Play | undefined;
  
  if (op.playId) {
    playToRemove = playbook.plays.find(p => p.id === op.playId);
    console.log(`    🔍 Searching by ID: ${op.playId}`);
  } else if (op.playTitle) {
    playToRemove = playbook.plays.find(p => 
      p.title.toLowerCase() === op.playTitle!.toLowerCase() ||
      p.title.toLowerCase().includes(op.playTitle!.toLowerCase())
    );
    console.log(`    🔍 Searching by title: "${op.playTitle}"`);
  }

  if (!playToRemove) {
    const availablePlays = playbook.plays.map(p => `"${p.title}" (${p.id})`).join(', ');
    console.error(`    ❌ Play not found. Available plays: ${availablePlays}`);
    throw new Error(`Play not found: ${op.playTitle || op.playId}`);
  }

  const playTitle = playToRemove.title;
  console.log(`    ✅ Found play to remove: "${playTitle}" (ID: ${playToRemove.id})`);

  // Remove play
  playbook.plays = playbook.plays.filter(p => p.id !== playToRemove!.id);

  // Remove dependencies on this play
  playbook.plays.forEach(play => {
    play.dependencies = play.dependencies.filter(dep => dep.playId !== playToRemove!.id);
  });

  // Re-sequence remaining plays
  playbook.plays.forEach((play, index) => {
    play.sequence = index + 1;
  });

  playbook.updatedAt = new Date().toISOString();

  console.log(`    ✅ Successfully removed play: "${playTitle}"`);
  return `Removed play: "${playTitle}"`;
}

