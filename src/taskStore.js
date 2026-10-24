import { create } from 'zustand';

const API_URL = 'https://6adb18477512f497b3007202.mockapi.io/api/v1/tasks';

const useTaskStore = create((set) => ({
    tasks: [],
    loading: false,
    error: null,

    fetchTasks: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Failed to fetch tasks!');
            }

            const tasks = await response.json();

            set({ tasks, loading: false });
        } catch (error) {
            set({
                error: error.message,
                loading: false
            });
        }
    },

    addTask: async (title) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    completed: false
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const newTask = await response.json();

            set((state) => ({
                tasks: [...state.tasks, newTask],
                error: null
            }));

            return true;

        } catch (error) {
            set({ error: error.message });
            return false;
        }
    },

    editTask: async (id, title) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                throw new Error('Failed to edit task!');
            }

            const updatedTask = await response.json();

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? updatedTask : task
                ),
                error: null
            }));

            return true;
        } catch (error) {
            console.error('Edit task error:', error);
            set({ error: error.message });
            return false;
        }
    },

    toggleTask: async (id) => {
        const task = useTaskStore.getState().tasks.find(
            (task) => task.id === id
        );

        if (!task) return false;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: !task.completed
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update task status!");
            }

            const updatedTask = await response.json();

            set((state) => ({
                tasks: state.tasks.map((item) =>
                    item.id === id ? updatedTask : item
                ),
                error: null
            }));

            return true;
        } catch (error) {
            console.error('Toggle task error:', error);
            set({ error: error.message });
            return false;
        }
    },

    deleteTask: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id),
                error: null
            }));

            return true;
        } catch (error) {
            set({ error: error.message });
            return false;
        }
    }
}));

export default useTaskStore;