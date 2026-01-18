<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmationModal from './ConfirmationModal.vue';
import AlertModal from './AlertModal.vue';
import { eventBus } from '@/services/events';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const userStore = useUserStore();
const showResetConfirm = ref(false);
const isCapturing = ref(false);

const showAlert = ref(false);
const alertTitle = ref('');
const alertMessage = ref('');
const alertVariant = ref<'primary' | 'danger' | 'warning' | 'info' | 'success'>('primary');

const triggerAlert = (title: string, message: string, variant: 'primary' | 'danger' | 'warning' | 'info' | 'success' = 'primary') => {
    alertTitle.value = title;
    alertMessage.value = message;
    alertVariant.value = variant;
    showAlert.value = true;
};

onMounted(async () => {
    if (!userStore.isInitialized) {
        await userStore.loadUser();
    }
});

const handleResetConfirm = () => {
    eventBus.emit('reset-dashboard');
    showResetConfirm.value = false;
};
</script>

<template>
    <div class="navbar navbar-expand-md docs-navbar sticky-top justify-content-between p-3 border-bottom glass-bg" style="height: 61px;z-index:1024">
        <div id="breadcrumbs" class="align-content-center ps-4 ps-md-0" style="height: 20px"></div>
        <div id="page-context"></div>
        <div class="d-flex">
            <div class="d-flex gap-1">

                <div class="dropdown">
                    <button class="btn btn-outline-info dropdown-toggle" style="min-width: 120px" type="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                        <i class="ti ti-user-circle me-1"></i>
                        <span>{{ userStore.userDisplayName }}</span>
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><h6 class="dropdown-header">Your account</h6></li>
                        <li>
                            <RouterLink :to="{ name: 'profile' }" class="dropdown-item" aria-current="true" data-bs-dismiss="dropdown"> <i class="ti ti-user-star"></i> Profile </RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ name: 'settings' }" class="dropdown-item" aria-current="true" data-bs-dismiss="dropdown"> <i class="ti ti-adjustments-cog"></i> Settings </RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ name: 'data-viewer' }" class="dropdown-item" aria-current="true" data-bs-dismiss="dropdown"> <i class="ti ti-database"></i> Data Viewer </RouterLink>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><h6 class="dropdown-header">Dashboard</h6></li>
                        <li>
                            <a href="#" class="dropdown-item text-danger" @click.prevent="showResetConfirm = true" data-bs-dismiss="dropdown">
                                <i class="ti ti-refresh"></i> Reset Dashboard
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <ConfirmationModal
        :show="showResetConfirm"
        title="Reset Dashboard"
        message="Are you sure you want to reset the dashboard? All widgets will be removed."
        confirm-text="Reset Dashboard"
        variant="danger"
        @close="showResetConfirm = false"
        @confirm="handleResetConfirm"
    />

    <AlertModal
        :show="showAlert"
        :title="alertTitle"
        :message="alertMessage"
        :variant="alertVariant"
        @close="showAlert = false"
    />
</template>

<style scoped></style>
