<template>
    <button
      :class="[
        'inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl',
        variant === 'primary'
          ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/50'
          : variant === 'secondary'
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white',
        disabled && 'opacity-50 cursor-not-allowed',
      ]"
      :disabled="disabled"
    >
      <slot />
    </button>
  </template>

  <script setup lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    variant: 'primary',
    disabled: false,
  });
  </script>
