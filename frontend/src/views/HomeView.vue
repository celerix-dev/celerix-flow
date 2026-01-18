<script setup lang="ts">
import ApplicationHeader from '@/components/Basic/ApplicationHeader.vue';
import { useRoute } from 'vue-router';
import logo from '@/assets/celerix-logo.png';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { storageService } from '@/services/storage';

const route = useRoute();
const userStore = useUserStore();

const projects = ref<any[]>([]);
const isLoadingProjects = ref(true);

onMounted(async () => {
  if (!userStore.isInitialized) {
    await userStore.loadUser();
  }
  await loadProjects();
});

const loadProjects = async () => {
  try {
    const data = await storageService.load<any>('PROJECTS');
    if (data && data.projects) {
      projects.value = data.projects;
    } else if (Array.isArray(data)) {
      projects.value = data;
    }
  } catch (e) {
    console.warn('Failed to load projects in sidebar', e);
  } finally {
    isLoadingProjects.value = false;
  }
};

const activeProject = computed(() => {
  return projects.value.find(p => p.id === userStore.activeProjectId) || null;
});

const selectProject = (projectId: string | null) => {
  userStore.setActiveProject(projectId);
};

const isLinkActive = (itemPath: string) => {
  const currentPath = route.path;
  if (itemPath === '/' && currentPath === '/') return true;
  if (itemPath !== '/' && currentPath.startsWith(itemPath)) return true;
  return false;
};
</script>

<template>
  <nav class="sidebar offcanvas-start offcanvas-md" tabindex="-1" id="donkers-sidebar">
    <div class="offcanvas-body p-0 d-flex flex-column">
      <div class="sidebar-management-section p-3">
        <div class="mb-4">
          <label class="sidebar-header d-block mb-2">Active Project</label>
          <div class="dropdown">
            <button 
              class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-between dropdown-toggle shadow-none"
              type="button" 
              data-bs-toggle="dropdown" 
              data-bs-display="static"
              aria-expanded="false"
            >
              <div class="d-flex align-items-center gap-2 overflow-hidden">
                <i v-if="activeProject" :class="['ti', activeProject.icon]" :style="{ color: activeProject.color }"></i>
                <i v-else class="ti ti-layers-intersect text-muted"></i>
                <span class="text-truncate">{{ activeProject ? activeProject.name : 'All Projects' }}</span>
              </div>
            </button>
            <ul class="dropdown-menu w-100 shadow-sm">
              <li>
                <a class="dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="selectProject(null)">
                  <i class="ti ti-layers-intersect text-muted"></i> All Projects
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li v-for="project in projects" :key="project.id">
                <a class="dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="selectProject(project.id)">
                  <i :class="['ti', project.icon]" :style="{ color: project.color }"></i>
                  <span class="text-truncate">{{ project.name }}</span>
                </a>
              </li>
              <li v-if="projects.length > 0"><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item d-flex align-items-center gap-2 " href="/projects">
                  <i class="ti ti-settings"></i> Manage Projects
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="sidebar-group">
          <h6 class="sidebar-header">Actions</h6>
          <div class="list-group list-group-flush">
            <RouterLink to="/" :class="['list-group-item list-group-item-action d-flex align-items-center border-0 rounded mb-1', isLinkActive('/') ? 'active' : '']">
              <i class="ti ti-dashboard me-2"></i>
              <span>Dashboard</span>
            </RouterLink>
            <RouterLink to="/kanban" :class="['list-group-item list-group-item-action d-flex align-items-center border-0 rounded mb-1', isLinkActive('/kanban') ? 'active' : '']">
              <i class="ti ti-layout-kanban me-2"></i>
              <span>Kanban</span>
            </RouterLink>
            <RouterLink to="/projects" :class="['list-group-item list-group-item-action d-flex align-items-center border-0 rounded mb-1', isLinkActive('/projects') ? 'active' : '']">
              <i class="ti ti-archive me-2"></i>
              <span>Projects</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="mt-auto p-3 border-top">
         <div class="d-flex align-items-center">
          <img draggable="false" :src="logo" alt="Logo" width="32" height="32" />
          <div class="ps-2 fw-bold">Celerix Flow</div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Sidebar toggle -->
  <button type="button" data-bs-toggle="offcanvas" data-bs-target="#donkers-sidebar"
          class="position-absolute btn btn-secondary mt-3 m-1 d-md-none" style="z-index: 1021"><i
      class="ti ti-menu-2"></i></button>

  <ApplicationHeader/>

  <div class="p-2" style="height: calc(100% - 61px)">
    <RouterView/>
  </div>
</template>

<style scoped>
.sidebar {
  //background-color: var(--bs-tertiary-bg);
  //border-right: 1px solid var(--bs-border-color);
}

.sidebar-header {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--bs-secondary-color);
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
  }
  
  :global(body) {
    padding-left: 280px;
  }
}
</style>
