<script setup lang="ts">
interface Props {
  id: string;
  title: string;
  icon?: string;
  isConfigured?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'ti-component',
  isConfigured: true
});

const emit = defineEmits<{
  (e: 'remove', id: string): void;
  (e: 'edit', id: string): void;
}>();
</script>

<template>
  <div class="card base-widget h-100 position-relative widget-card shadow-sm border-0 overflow-hidden">
    <div class="card-header d-flex justify-content-between align-items-center border-0">
      <div class="d-flex align-items-center gap-2 text-truncate pe-2">
        <i :class="['ti', icon, 'text-primary']"></i>
        <span class="fw-bold text-truncate">{{ title }}</span>
      </div>
      <div class="dropdown">
        <button 
          class="btn btn-sm p-0 text-muted shadow-none no-caret"
          type="button"
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          <i class="ti ti-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="emit('edit', id)">
              <i class="ti ti-edit"></i> Edit
            </a>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2 text-danger" href="#" @click.prevent="emit('remove', id)">
              <i class="ti ti-trash"></i> Remove
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="card-body d-flex flex-column p-3">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.base-widget {
  min-height: 250px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.base-widget:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  cursor: grab;
  z-index: 10;
}

.card-header:active {
  cursor: grabbing;
}

.no-caret::after {
  display: none !important;
}

.dropdown-item {
  cursor: pointer;
}
</style>
