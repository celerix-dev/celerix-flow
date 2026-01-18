<script setup lang="ts">
import { ref } from 'vue';
import DonkersClock from "@/components/DonkersClock.vue";
import BaseWidget from "./BaseWidget.vue";

interface Widget {
  id: string;
  type: 'countdown' | 'clock';
  label: string;
  isConfigured: boolean;
  clockOptions?: {
    showDate: boolean;
    showDigital: boolean;
    show24h: boolean;
  };
}

const props = defineProps<{
  widget: Widget;
}>();

const emit = defineEmits<{
  (e: 'update', widget: Widget): void;
  (e: 'remove', id: string): void;
}>();

const editLabel = ref(props.widget.label);
const editShowDate = ref(props.widget.clockOptions?.showDate ?? false);
const editShowDigital = ref(props.widget.clockOptions?.showDigital ?? true);
const editShow24h = ref(props.widget.clockOptions?.show24h ?? false);

const save = () => {
  emit('update', {
    ...props.widget,
    label: editLabel.value,
    isConfigured: true,
    clockOptions: {
      showDate: editShowDate.value,
      showDigital: editShowDigital.value,
      show24h: editShow24h.value
    }
  });
};

const enterEditMode = () => {
  emit('update', {
    ...props.widget,
    isConfigured: false
  });
};
</script>

<template>
  <BaseWidget 
    :id="widget.id" 
    :title="widget.isConfigured ? (widget.label || 'Clock') : 'Configure Clock'" 
    icon="ti-clock"
    @remove="emit('remove', $event)"
    @edit="enterEditMode"
  >
    <div class="clock-content d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <div v-if="!widget.isConfigured" class="w-100">
        <div class="mb-2">
          <label class="form-label d-block text-start">Label</label>
          <input v-model="editLabel" type="text" class="form-control form-control-sm" placeholder="Clock Label">
        </div>
        <div class="form-check form-switch mb-2 text-start">
          <input class="form-check-input" type="checkbox" id="showDate" v-model="editShowDate">
          <label class="form-check-label" for="showDate">Show Date</label>
        </div>
        <div class="form-check form-switch mb-2 text-start">
          <input class="form-check-input" type="checkbox" id="showDigital" v-model="editShowDigital">
          <label class="form-check-label" for="showDigital">Show Digital Clock</label>
        </div>
        <div class="form-check form-switch mb-3 text-start">
          <input class="form-check-input" type="checkbox" id="show24h" v-model="editShow24h">
          <label class="form-check-label" for="show24h">Show 24h Labels</label>
        </div>
        <button class="btn btn-primary btn-sm w-100" @click="save">Save Settings</button>
      </div>
      
      <div v-else class="clock-display">
        <DonkersClock 
          :id="widget.id" 
          :show-date="widget.clockOptions?.showDate" 
          :show-digital="widget.clockOptions?.showDigital" 
          :show24h="widget.clockOptions?.show24h" 
        />
      </div>
    </div>
  </BaseWidget>
</template>

<style scoped>
.clock-content {
  min-height: 200px;
}
.clock-display {
  transform: scale(1);
}
</style>
