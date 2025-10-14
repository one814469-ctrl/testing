import { useEffect, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { supabase, UserStory, Feature, Task } from './lib/supabase';
import { UserStoryItem } from './components/UserStoryItem';

function App() {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [userStoriesResult, featuresResult, tasksResult] = await Promise.all([
        supabase.from('user_stories').select('*').order('order_index'),
        supabase.from('features').select('*').order('order_index'),
        supabase.from('tasks').select('*').order('order_index'),
      ]);

      if (userStoriesResult.error) throw userStoriesResult.error;
      if (featuresResult.error) throw featuresResult.error;
      if (tasksResult.error) throw tasksResult.error;

      setUserStories(userStoriesResult.data || []);
      setFeatures(featuresResult.data || []);
      setTasks(tasksResult.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStory = async (id: string, updates: Partial<UserStory>) => {
    const { error } = await supabase
      .from('user_stories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating user story:', error);
      return;
    }

    setUserStories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const updateFeature = async (id: string, updates: Partial<Feature>) => {
    const { error } = await supabase
      .from('features')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating feature:', error);
      return;
    }

    setFeatures((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleProceedToAzureDevOps = () => {
    window.open('https://dev.azure.com', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading backlog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Backlog</h1>
          <p className="text-gray-600">
            Manage your User Stories, Features, and Tasks in a hierarchical view
          </p>
        </div>

        {userStories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No backlog items found</p>
            <p className="text-gray-400 text-sm">
              Your backlog is empty. Add some user stories to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {userStories.map((userStory) => {
              const storyFeatures = features.filter(
                (feature) => feature.user_story_id === userStory.id
              );
              const storyTasks = tasks.filter((task) =>
                storyFeatures.some((feature) => feature.id === task.feature_id)
              );

              return (
                <UserStoryItem
                  key={userStory.id}
                  userStory={userStory}
                  features={storyFeatures}
                  tasks={storyTasks}
                  onUpdateUserStory={updateUserStory}
                  onUpdateFeature={updateFeature}
                  onUpdateTask={updateTask}
                />
              );
            })}
          </div>
        )}

        <div className="flex justify-center pt-6 border-t border-gray-200">
          <button
            onClick={handleProceedToAzureDevOps}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            <span>Proceed to Azure DevOps</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
