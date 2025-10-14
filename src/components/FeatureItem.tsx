import { useState } from 'react';
import { ChevronDown, ChevronRight, Box, Edit2 } from 'lucide-react';
import { Feature, Task } from '../lib/supabase';
import { TaskItem } from './TaskItem';

interface FeatureItemProps {
  feature: Feature;
  tasks: Task[];
  onUpdateFeature: (id: string, updates: Partial<Feature>) => Promise<void>;
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<void>;
}

export function FeatureItem({ feature, tasks, onUpdateFeature, onUpdateTask }: FeatureItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(feature.title);
  const [description, setDescription] = useState(feature.description);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateFeature(feature.id, { title, description });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(feature.title);
    setDescription(feature.description);
    setIsEditing(false);
  };

  return (
    <div className="ml-8 mb-2">
      <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-blue-100 rounded flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-blue-700" />
              ) : (
                <ChevronRight className="w-5 h-5 text-blue-700" />
              )}
            </button>
            <Box className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Feature title"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Feature description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-blue-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  {feature.description && (
                    <p className="text-sm text-gray-700">{feature.description}</p>
                  )}
                  {tasks.length > 0 && (
                    <p className="text-xs text-blue-700 font-medium mt-1">
                      {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && tasks.length > 0 && (
        <div className="mt-2 space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={onUpdateTask} />
          ))}
        </div>
      )}
    </div>
  );
}
