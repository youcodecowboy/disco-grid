'use client';

interface DiscoHeaderProps {
  isEditMode: boolean;
  onToggleEdit: () => void;
}

const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
)

const SaveIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
)

export function DiscoHeader({ isEditMode, onToggleEdit }: DiscoHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <img src="/groovy-logo.png" alt="Groovy" className="h-8" />
        </div>
        
        <button
          onClick={onToggleEdit}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            isEditMode 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isEditMode ? 'Save Layout' : 'Edit Layout'}
        >
          {isEditMode ? <SaveIcon /> : <EditIcon />}
        </button>
      </div>
    </header>
  );
}
