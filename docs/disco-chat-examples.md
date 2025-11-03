# Disco Chat Assistant - Example Prompts & Expected Outputs

This document provides example interactions with Disco, showing user prompts, AI responses, actions triggered, and expected results.

---

## Example 1: Create a Workflow

### User Input:
```
"Create a workflow for processing customer orders"
```

### AI Response:
```json
{
  "text": "I'll help you create a workflow for processing customer orders. Let me gather some details and then navigate you to the workflow builder where you can configure the stages.",
  "action": "create_workflow",
  "actionParams": {
    "description": "Customer order processing workflow",
    "initialDescription": "Create a workflow for processing customer orders"
  },
  "navigation": "/workflows-v3/new"
}
```

### UI Behavior:
1. **Chat Message Displayed**: Shows the AI's response in the chat
2. **Action Confirmation UI Appears**: Shows a confirmation card at the bottom of the drawer with:
   - Title: "Confirm Create Workflow"
   - Message: "I'll help you create a workflow for processing customer orders..."
   - Preview: Shows the description
   - Buttons: "Confirm" and "Cancel"

### User Clicks "Confirm":
1. **Navigation**: Browser navigates to `/workflows-v3/new`
2. **API Call**: Calls `/api/nlp/workflow/generate` with the description
3. **Chat Message**: Shows "Workflow created successfully! You can now configure it in the builder."
4. **Workflow Builder**: Opens with generated workflow stages

### Result:
- User is on the workflow builder page
- Workflow stages are generated from the description
- User can refine and configure the workflow

---

## Example 2: Create a Task

### User Input:
```
"Make a task for Sarah to review the inventory report by Friday"
```

### AI Response:
```json
{
  "text": "I'll create a task for Sarah to review the inventory report with a deadline of Friday. Let me set that up for you.",
  "action": "create_task",
  "actionParams": {
    "goal": "Review the inventory report",
    "assignees": ["Sarah"],
    "dueDate": "Friday",
    "priority": "medium"
  },
  "navigation": "/tasks-v2/new"
}
```

### UI Behavior:
1. **Chat Message Displayed**: Shows AI's response
2. **Action Confirmation UI**: Shows confirmation with:
   - Task goal: "Review the inventory report"
   - Assignee: Sarah
   - Due date: Friday
   - Priority: Medium

### User Clicks "Confirm":
1. **Navigation**: Browser navigates to `/tasks-v2/new`
2. **API Call**: Calls `/api/tasks-v2/llm-suggest` to generate task details
3. **Chat Message**: Shows "Task creation initiated! You can review and complete it on the task page."
4. **Task Creation Page**: Opens with pre-filled form based on LLM suggestions

### Result:
- User is on the task creation page
- Form is pre-filled with task details
- User can review and finalize the task

---

## Example 3: Send a Message

### User Input:
```
"Send a message to John asking about the project status"
```

### AI Response:
```json
{
  "text": "I'll help you send a message to John about the project status. Let me navigate you to the messages page.",
  "action": "send_message",
  "actionParams": {
    "recipient": "John",
    "subject": "Project Status",
    "content": "Can you provide an update on the project status?"
  },
  "navigation": "/messages"
}
```

### UI Behavior:
1. **Chat Message Displayed**: Shows AI's response
2. **Action Confirmation UI**: Shows confirmation with message preview

### User Clicks "Confirm":
1. **Navigation**: Browser navigates to `/messages`
2. **Message Compose**: Opens compose modal with pre-filled recipient and content
3. **Chat Message**: Confirmation message in chat

### Result:
- User is on the messages page
- Compose modal is open with draft message
- User can send or edit before sending

---

## Example 4: Create a Dashboard

### User Input:
```
"Create a dashboard showing sales metrics and order status"
```

### AI Response:
```json
{
  "text": "I'll create a dashboard with sales metrics and order status visualizations. This will include charts and KPIs for monitoring your business performance.",
  "action": "create_dashboard",
  "actionParams": {
    "description": "Sales metrics and order status dashboard",
    "requirements": [
      "Sales metrics charts",
      "Order status breakdown",
      "KPI cards"
    ]
  }
}
```

### UI Behavior:
1. **Chat Message Displayed**: Shows AI's response
2. **Action Confirmation UI**: Shows dashboard preview

### User Clicks "Confirm":
1. **API Call**: Calls `/api/dashboard/generate` to create dashboard
2. **Chat Message**: Shows "Dashboard created successfully!"
3. **Dashboard Created**: New dashboard appears in dashboard list

### Result:
- Dashboard is created with requested components
- User can navigate to the dashboard
- Components are populated with relevant data

---

## Example 5: Create a Playbook

### User Input:
```
"Create a playbook that automatically assigns tasks when orders are received"
```

### AI Response:
```json
{
  "text": "I'll create a playbook that automatically assigns tasks when new orders are received. This will help streamline your order processing workflow.",
  "action": "create_playbook",
  "actionParams": {
    "description": "Automatically assign tasks when orders are received",
    "triggers": ["order_received"],
    "actions": ["assign_task"]
  }
}
```

### UI Behavior:
1. **Chat Message Displayed**: Shows AI's response
2. **Action Confirmation UI**: Shows playbook configuration preview

### User Clicks "Confirm":
1. **API Call**: Calls `/api/nlp/playbook/generate` to create playbook
2. **Chat Message**: Shows "Playbook created successfully!"
3. **Playbook Created**: Playbook appears in playbooks list

### Result:
- Playbook is created with automation rules
- Rules are configured based on the description
- Playbook is active and ready to use

---

## Example 6: General Query / Help

### User Input:
```
"What can you help me with?"
```

### AI Response:
```json
{
  "text": "I can help you with many things! Here's what I can do:\n\n• Create workflows - Build business process workflows\n• Create tasks - Assign tasks to team members\n• Send messages - Communicate with your team\n• Create dashboards - Build custom analytics dashboards\n• Create playbooks - Set up automation rules\n• Answer questions - Get help with the platform\n\nWhat would you like to do?",
  "action": "help",
  "suggestedActions": [
    "Create a workflow",
    "Create a task",
    "Send a message",
    "Create a dashboard"
  ]
}
```

### UI Behavior:
1. **Chat Message Displayed**: Shows helpful response with bullet points
2. **No Action Confirmation**: Just informational response
3. **Conversation Continues**: User can ask follow-up questions

### Result:
- User receives helpful information
- Can continue conversation
- Can ask for specific actions

---

## Example 7: Multi-turn Conversation

### Turn 1 - User:
```
"I need to track order fulfillment"
```

### AI Response:
```json
{
  "text": "I can help you track order fulfillment. Would you like me to:\n1. Create a workflow for order fulfillment\n2. Create a dashboard to track fulfillment metrics\n3. Create tasks for fulfillment tracking\n\nWhich would be most helpful?",
  "action": null
}
```

### Turn 2 - User:
```
"Create a workflow please"
```

### AI Response:
```json
{
  "text": "I'll create a workflow for order fulfillment tracking. This workflow will help you manage the entire order fulfillment process from start to finish.",
  "action": "create_workflow",
  "actionParams": {
    "description": "Order fulfillment tracking workflow",
    "initialDescription": "Track order fulfillment"
  },
  "navigation": "/workflows-v3/new"
}
```

### UI Behavior:
- **Context Maintained**: AI remembers the previous conversation about order fulfillment
- **Action Triggered**: Creates workflow based on full context

### Result:
- Workflow is created with context from both messages
- More accurate and relevant workflow generated

---

## Example 8: Clarification Request

### User Input:
```
"Make a task"
```

### AI Response:
```json
{
  "text": "I'd be happy to create a task for you! To make sure I create it correctly, could you tell me:\n• What needs to be done? (the task goal)\n• Who should it be assigned to?\n• When is it due?\n• What's the priority level?\n\nFor example: 'Create a task for John to review the inventory by Friday with high priority'",
  "action": null
}
```

### UI Behavior:
1. **Chat Message Displayed**: Shows helpful clarification request
2. **No Action**: Waiting for more information
3. **User Can Respond**: Continue conversation

### Result:
- User provides more details
- AI can then create a more complete task

---

## Example 9: Error Handling

### User Input:
```
"Create a workflow for something complicated"
```

### AI Response (if API fails):
```json
{
  "text": "Sorry, I encountered an error while creating the workflow. Please try again or provide more details about what you'd like the workflow to do.",
  "error": "API error: 500"
}
```

### UI Behavior:
1. **Error Message Displayed**: Shows error in chat
2. **Error Styling**: Red/error styling for the message
3. **User Can Retry**: Can try again with different input

### Result:
- User sees clear error message
- Can retry or ask for help
- System logs error for debugging

---

## Example 10: Complex Request with Multiple Actions

### User Input:
```
"Create a workflow for order processing and then make a task for the team to review it"
```

### AI Response:
```json
{
  "text": "I'll help you create an order processing workflow first, and then we can create a task for your team to review it. Let me start with the workflow.",
  "action": "create_workflow",
  "actionParams": {
    "description": "Order processing workflow",
    "initialDescription": "Create a workflow for order processing"
  },
  "navigation": "/workflows-v3/new"
}
```

### UI Behavior:
- **First Action**: Creates workflow
- **After Confirmation**: Can follow up with task creation
- **Sequential Actions**: Handles one action at a time

### Follow-up (after workflow is created):
User: "Now create the task"

AI Response:
```json
{
  "text": "I'll create a task for your team to review the order processing workflow.",
  "action": "create_task",
  "actionParams": {
    "goal": "Review the order processing workflow",
    "assignees": ["team"]
  },
  "navigation": "/tasks-v2/new"
}
```

### Result:
- Workflow created first
- Task created second
- Both actions completed successfully

---

## Key Features Demonstrated

1. **Action Detection**: AI correctly identifies user intent
2. **Parameter Extraction**: Extracts relevant details from natural language
3. **Confirmation Flow**: Always asks for confirmation before executing
4. **Context Awareness**: Remembers conversation history
5. **Error Handling**: Gracefully handles errors
6. **Navigation**: Intelligently navigates to relevant pages
7. **API Integration**: Uses existing API endpoints seamlessly
8. **Multi-turn Conversations**: Maintains context across messages

---

## Testing Scenarios

### Basic Actions:
- ✅ Create workflow
- ✅ Create task
- ✅ Send message
- ✅ Create dashboard
- ✅ Create playbook

### Edge Cases:
- ✅ Vague requests (asks for clarification)
- ✅ Multi-action requests (handles sequentially)
- ✅ Error scenarios (shows helpful error messages)
- ✅ Help requests (provides guidance)

### Advanced Features:
- ✅ Context-aware responses
- ✅ Multi-turn conversations
- ✅ Action confirmation
- ✅ Navigation integration

