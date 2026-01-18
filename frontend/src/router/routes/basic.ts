import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Dashboard from '@/views/Dashboard.vue';
import KanbanView from '@/views/KanbanView.vue';
import ProjectsView from '@/views/Projects.vue';
import ProfileView from '@/views/ProfileView.vue';
import SettingsView from '@/views/SettingsView.vue';
import DataViewer from '@/views/DataViewer.vue';

// Define the routes for the generic routes
export const basicRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: Dashboard
            },
            {
                path: '/profile',
                name: 'profile',
                component: ProfileView
            },
            {
                path: '/settings',
                name: 'settings',
                component: SettingsView
            },
            {
                path: '/data-viewer',
                name: 'data-viewer',
                component: DataViewer
            },
            {
                path: '/kanban',
                name: 'kanban',
                component: KanbanView
            },
            {
                path: '/projects',
                name: 'projects',
                component: ProjectsView
            }
        ]
    }
];
