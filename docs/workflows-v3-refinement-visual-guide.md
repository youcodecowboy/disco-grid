# Workflows V3: Refinement Questions - Visual Guide

## How It Appears to Users

### Step 1: Stage Created (Missing Information)

When a stage is first created (either by LLM or manually), and fields are missing:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: Cutting                                                      [v] [x]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ○ SECTION 1: STAGE INFO (Top Bun)                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Type: ● Sequential   Team: [____________]  Duration: [____] mins     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ○ SECTION 2: INPUTS (What begins this stage)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ No inputs defined yet                                                 │   │
│  │ [+ Add Input]                                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ○ SECTION 3: DEPENDENCIES (The meat - core logic)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ No dependencies defined yet                                           │   │
│  │ [+ Add Dependency]                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ○ SECTION 4: OUTPUTS (What completes this stage)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ No outputs defined yet                                                │   │
│  │ [+ Add Output]                                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
├═════════════════════════════════════════════════════════════════════════════┤
│  ✨ REFINEMENT QUESTIONS                                          1 of 5     │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%                    │
│                                                                               │
│  Which team or department is responsible for the "Cutting" stage?           │
│  Missing: No team assigned                                                   │
│                                                                               │
│  [Type your answer...                                    ] [Submit ⌘↵]       │
│                                                                               │
│  Press Cmd+Enter to submit                                                   │
├═════════════════════════════════════════════════════════════════════════════┤
│  ⚠️ Add stage name, at least one input, and one output to complete          │
│                                            [✓ Complete stage configuration]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 2: User Answers First Question

User types: **"the cutting team"**

```
├═════════════════════════════════════════════════════════════════════════════┤
│  ✨ REFINEMENT QUESTIONS                                          1 of 5     │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%                    │
│                                                                               │
│  Which team or department is responsible for the "Cutting" stage?           │
│  Missing: No team assigned                                                   │
│                                                                               │
│  [the cutting team                                   ] [Submit ⌘↵]           │
│  ▲ User's answer                                                             │
│                                                                               │
│  Press Cmd+Enter to submit                                                   │
├═════════════════════════════════════════════════════════════════════════════┤
```

User presses **Cmd+Enter** → System shows loading state:

```
├═════════════════════════════════════════════════════════════════════════════┤
│  ✨ REFINEMENT QUESTIONS                                          1 of 5     │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 20%                    │
│                                                                               │
│  Which team or department is responsible for the "Cutting" stage?           │
│  Missing: No team assigned                                                   │
│                                                                               │
│  [the cutting team                                   ] [⟳ Processing]        │
│                                                                               │
│  Processing your answer...                                                   │
├═════════════════════════════════════════════════════════════════════════════┤
```

### Step 3: Answer Processed, Next Question Appears

Stage updated with `teamId: "Cutting Team"` → Next question loads:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: Cutting                                                      [v] [x]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ○ SECTION 1: STAGE INFO (Top Bun)                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Type: ● Sequential   Team: [Cutting Team ✓]  Duration: [____] mins  │   │
│  │                              ▲ Updated!                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ... other sections ...                                                      │
│                                                                               │
├═════════════════════════════════════════════════════════════════════════════┤
│  ✨ REFINEMENT QUESTIONS                                          2 of 5     │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 40%                    │
│                                                                               │
│  What input or action is required to BEGIN the "Cutting" stage?             │
│  (e.g., QR scan, form submission, photo upload)                             │
│  Missing: No inputs defined                                                  │
│                                                                               │
│  [Type your answer...                                    ] [Submit ⌘↵]       │
│                                                                               │
│  Press Cmd+Enter to submit                                                   │
├═════════════════════════════════════════════════════════════════════════════┤
```

### Step 4: User Answers Second Question

User types: **"scan the fabric roll QR code"**

```
├═════════════════════════════════════════════════════════════════════════════┤
│  ✨ REFINEMENT QUESTIONS                                          2 of 5     │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 40%                    │
│                                                                               │
│  What input or action is required to BEGIN the "Cutting" stage?             │
│  Missing: No inputs defined                                                  │
│                                                                               │
│  [scan the fabric roll QR code                       ] [Submit ⌘↵]           │
│                                                                               │
│  Press Cmd+Enter to submit                                                   │
├═════════════════════════════════════════════════════════════════════════════┤
```

After processing, the **Inputs section updates**:

```
│  ○ SECTION 2: INPUTS (What begins this stage)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. QR Scan - Scan fabric roll QR code                       [Edit]  │   │
│  │     Required: ✓                                               [Remove]│   │
│  │     ▲ Auto-created from answer!                                       │   │
│  │                                                                        │   │
│  │ [+ Add Another Input]                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
```

### Step 5: Third Question (Dependencies)

```
├═════════════════════════════════════════════════════════════════════════════┤
│  ✨ REFINEMENT QUESTIONS                                          3 of 5     │
│  ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 60%                    │
│                                                                               │
│  Are there any conditions or dependencies that must be met before           │
│  "Cutting" can start?                                                        │
│  (e.g., previous tasks, approvals, time delays, material arrival)           │
│  Missing: No dependencies defined                                            │
│                                                                               │
│  Answer "none" if there are no dependencies.                                │
│                                                                               │
│  [Type your answer...                                    ] [Submit ⌘↵]       │
│                                                                               │
│  Press Cmd+Enter to submit                                                   │
├═════════════════════════════════════════════════════════════════════════════┤
```

User types: **"fabric must arrive first"**

After processing:

```
│  ○ SECTION 3: DEPENDENCIES (The meat - core logic)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. Material Arrival - Fabric must arrive                    [Edit]  │   │
│  │     Required: ✓                                               [Remove]│   │
│  │     Material: Fabric                                                  │   │
│  │     ▲ Auto-created from answer!                                       │   │
│  │                                                                        │   │
│  │ [+ Add Another Dependency]                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
```

### Step 6: All Questions Answered

After answering all 5 questions, the refinement section shows success:

```
├═════════════════════════════════════════════════════════════════════════════┤
│  ✓ Stage information complete                                                │
├═════════════════════════════════════════════════════════════════════════════┤
│                                              [✓ Complete stage configuration]│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 7: Stage Collapsed

When user clicks "Complete stage configuration":

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ◉ 1  Cutting                        Sequential  ✓                    [>]    │
│                                                                               │
│  Team: Cutting Team  •  Input: Scan fabric roll QR code  •                  │
│  Output: Complete cutting checklist  •  1 dependency                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Color Scheme

- **Purple background** (`bg-purple-50`): Refinement section background
- **Purple borders** (`border-purple-200`): Section borders
- **Purple text** (`text-purple-600`): Question text and hints
- **Purple progress** (`bg-purple-600`): Progress bar fill
- **Purple button** (`bg-purple-600`): Submit button

This **purple theme** visually distinguishes the refinement section from the main stage content (which uses blue/slate colors).

## Keyboard Shortcuts

- **Cmd+Enter** or **Ctrl+Enter**: Submit answer
- **Tab**: Navigate between fields
- **Escape**: (Future) Skip question

## Mobile View

On mobile, the refinement section adapts:

```
┌───────────────────────────┐
│ ✨ Questions        1 of 5 │
│ ████░░░░░░░░░░░░░░░░ 20%  │
│                            │
│ Which team is responsible  │
│ for the "Cutting" stage?   │
│                            │
│ Missing: No team assigned  │
│                            │
│ ┌─────────────────────────┐│
│ │Type answer...           ││
│ └─────────────────────────┘│
│                            │
│        [Submit ⌘↵]         │
│                            │
└───────────────────────────┘
```

## Animation Details

1. **Question transition**: Smooth fade-in/fade-out when switching questions
2. **Progress bar**: Animated width transition (300ms)
3. **Success badge**: Fade-in with check icon
4. **Processing state**: Spinning loader icon
5. **Field updates**: Highlight field briefly when updated

## Accessibility Features

- **ARIA labels**: "Question 2 of 5", "Progress: 40%"
- **Focus management**: Auto-focus on input after question loads
- **Screen reader announcements**: "Question processed successfully"
- **High contrast**: Purple meets WCAG AA standards
- **Keyboard navigation**: Full keyboard support









