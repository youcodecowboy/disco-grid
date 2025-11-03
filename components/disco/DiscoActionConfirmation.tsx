'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiscoChatStore } from '@/lib/disco/store/useDiscoChatStore';
import type { ActionConfirmation } from '@/lib/disco/types';
import { orchestrateAction } from '@/lib/disco/orchestrator';

interface DiscoActionConfirmationProps {
  action: ActionConfirmation;
}

export function DiscoActionConfirmation({ action }: DiscoActionConfirmationProps) {
  const { confirmAction, cancelAction, setPendingNavigation, addMessage, setLoading } = useDiscoChatStore();
  const router = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleConfirm = async () => {
    setIsExecuting(true);
    setLoading(true);

    try {
      // Navigate if needed
      if (action.action === 'create_workflow') {
        // Execute workflow creation first
        const result = await orchestrateAction(action.action, action.params);
        if (result.success && result.data) {
          // Save the generated workflow to localStorage so the builder can load it
          const workflowId = `wf-disco-${Date.now()}`;
          const generatedWorkflow = result.data;
          
          // Store the generated workflow data in sessionStorage for the builder page
          sessionStorage.setItem('disco-generated-workflow', JSON.stringify({
            id: workflowId,
            name: generatedWorkflow.suggestedName || 'Generated Workflow',
            description: action.params.description || action.params.initialDescription || '',
            industry: generatedWorkflow.suggestedIndustry,
            generatedData: generatedWorkflow,
          }));
          
          // Navigate to builder with the workflow ID
          router.push(`/workflows-v3/${workflowId}`);
          setPendingNavigation(`/workflows-v3/${workflowId}`);
          
          addMessage({
            role: 'assistant',
            type: 'text',
            content: `Workflow created successfully! I've generated the workflow structure and opened it in the builder for you to review and configure.`,
          });
        } else {
          addMessage({
            role: 'assistant',
            type: 'error',
            content: `Failed to create workflow: ${result.error}`,
            error: result.error,
          });
        }
      } else if (action.action === 'create_task') {
        router.push('/tasks-v2/new');
        setPendingNavigation('/tasks-v2/new');
        
        // Execute task creation
        const result = await orchestrateAction(action.action, action.params);
        if (result.success) {
          addMessage({
            role: 'assistant',
            type: 'text',
            content: `Task creation initiated! You can review and complete it on the task page.`,
          });
        } else {
          addMessage({
            role: 'assistant',
            type: 'error',
            content: `Failed to create task: ${result.error}`,
            error: result.error,
          });
        }
      } else if (action.action === 'send_message') {
        router.push('/messages');
        setPendingNavigation('/messages');
      } else if (action.action === 'create_playbook') {
        // Execute playbook creation first
        const result = await orchestrateAction(action.action, action.params);
        if (result.success && result.data) {
          // Save the generated playbook to sessionStorage so the builder can load it
          const playbookId = `playbook-disco-${Date.now()}`;
          const generatedPlaybook = result.data;
          
          // Store the generated playbook data in sessionStorage for the builder page
          sessionStorage.setItem('disco-generated-playbook', JSON.stringify({
            id: playbookId,
            name: generatedPlaybook.suggestedName || 'Generated Playbook',
            description: generatedPlaybook.suggestedDescription || action.params.description || action.params.initialDescription || '',
            generatedData: generatedPlaybook,
          }));
          
          // Navigate to builder with the playbook ID
          router.push(`/playbooks/${playbookId}`);
          setPendingNavigation(`/playbooks/${playbookId}`);
          
          addMessage({
            role: 'assistant',
            type: 'text',
            content: `Playbook created successfully! I've generated the playbook structure and opened it in the builder for you to review and configure.`,
          });
        } else {
          addMessage({
            role: 'assistant',
            type: 'error',
            content: `Failed to create playbook: ${result.error}`,
            error: result.error,
          });
        }
      } else if (action.action === 'create_dashboard') {
        const result = await orchestrateAction(action.action, action.params);
        if (result.success) {
          addMessage({
            role: 'assistant',
            type: 'text',
            content: `Dashboard created successfully!`,
          });
        } else {
          addMessage({
            role: 'assistant',
            type: 'error',
            content: `Failed to create dashboard: ${result.error}`,
            error: result.error,
          });
        }
      }
      
      confirmAction();
    } catch (error) {
      addMessage({
        role: 'assistant',
        type: 'error',
        content: `Error executing action: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsExecuting(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    cancelAction();
  };

  const getActionLabel = (actionType: string) => {
    return actionType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="bg-white border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-amber-600 font-bold text-sm">!</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">
            Confirm {getActionLabel(action.action)}
          </h3>
          <p className="text-sm text-slate-600">{action.message}</p>
        </div>
      </div>

      {/* Preview */}
      {action.preview && (
        <div className="bg-slate-50 rounded-md p-3 mb-4 border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-2">Preview:</p>
          <pre className="text-xs text-slate-600 whitespace-pre-wrap">
            {typeof action.preview === 'string' 
              ? action.preview 
              : JSON.stringify(action.preview, null, 2)}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleConfirm}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
          disabled={isExecuting}
        >
          <Check className="w-4 h-4 mr-2" />
          {isExecuting ? 'Processing...' : 'Confirm'}
        </Button>
        <Button
          onClick={handleCancel}
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={isExecuting}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

