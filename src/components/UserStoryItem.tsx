import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Edit2 } from 'lucide-react';
import { UserStory, Feature, Task } from '../lib/supabase';
import { FeatureItem } from './FeatureItem';

interface UserStoryItemProps {
  userStory: UserStory;
  features: Feature[];
  tasks: Task[];
  onUpdateUserStory: (id: string, updates: Partial<UserStory>) => Promise<void>;
  onUpdateFeature: (id: string, updates: Partial<Feature>) => Promise<void>;
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<void>;
}

export function UserStoryItem({
  userStory,
  features,
  tasks,
  onUpdateUserStory,
  onUpdateFeature,
  onUpdateTask,
}: UserStoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(userStory.title);
  const [description, setDescription] = useState(userStory.description);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateUserStory(userStory.id, { title, description });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(userStory.title);
    setDescription(userStory.description);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-blue-500 rounded flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </button>
            <BookOpen className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900"
                    placeholder="User Story title"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-gray-900"
                    placeholder="User Story description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 disabled:opacity-50 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">{userStory.title}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 hover:bg-blue-500 rounded"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  {userStory.description && (
                    <p className="text-blue-50 mb-2">{userStory.description}</p>
                  )}
                  {features.length > 0 && (
                    <p className="text-sm text-blue-200 font-medium">
                      {features.length} feature{features.length !== 1 ? 's' : ''} • {tasks.length}{' '}
                      task{tasks.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && features.length > 0 && (
        <div className="mt-3 space-y-2">
          {features.map((feature) => {
            const featureTasks = tasks.filter((task) => task.feature_id === feature.id);
            return (
              <FeatureItem
                key={feature.id}
                feature={feature}
                tasks={featureTasks}
                onUpdateFeature={onUpdateFeature}
                onUpdateTask={onUpdateTask}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
