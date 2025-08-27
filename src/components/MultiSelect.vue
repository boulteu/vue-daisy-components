<template>
  <div class="relative">
    <div
      class="input input-bordered w-full min-h-[2.5rem] max-h-32 flex flex-wrap gap-1 p-2 cursor-text overflow-y-auto focus-within:outline-none focus-within:ring-0"
      :class="{ 'input-error': error }"
      @click="openDropdown"
      @keydown="handleKeydown"
      tabindex="0"
      ref="inputRef"
    >
      <template v-if="selectedItems.length > 0">
        <div
          v-for="(item, index) in selectedItems.slice(0, 2)"
          :key="`${item}-${index}`"
          class="badge badge-sm gap-1 bg-base-300 text-base-content border border-base-300 flex-shrink-0"
          :class="getBadgeWidthClass()"
        >
          <span class="truncate" :title="item">{{ item }}</span>
          <button
            type="button"
            class="btn btn-ghost btn-xs p-0 h-4 w-4 flex-shrink-0"
            @click.stop="removeItem(item)"
            title="Remove"
          >
            <CloseIcon class="w-3 h-3" />
          </button>
        </div>
        
        <div
          v-if="selectedItems.length > 2"
          class="badge badge-sm bg-base-300 text-base-content border border-base-300 flex-shrink-0"
        >
          +{{ selectedItems.length - 2 }}
        </div>
      </template>

      <input
        v-if="!selectedItems.length || isSearching"
        ref="searchInput"
        v-model="searchTerm"
        class="flex-1 min-w-0 bg-transparent outline-none text-sm focus:outline-none focus:ring-0"
        :placeholder="selectedItems.length ? 'Search...' : placeholder"
        @focus="isSearching = true"
        @blur="handleBlur"
      />

      <button
        type="button"
        class="btn btn-ghost btn-xs p-0 h-4 w-4 ml-auto"
        @click.stop="toggleDropdown"
        :class="{ 'rotate-180': isOpen }"
      >
        <ChevronDownIcon class="w-3 h-3" />
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed bg-base-100 border border-base-300 rounded-lg shadow-lg z-[9999] max-h-60 overflow-auto"
        ref="dropdownRef"
        :style="dropdownStyle"
      >
        <div v-if="selectedItems.length" class="p-2 border-b border-base-300 focus-within:outline-none focus-within:ring-0">
          <input
            v-model="searchTerm"
            class="input input-sm input-bordered w-full focus:outline-none focus:ring-0"
            placeholder="Search options..."
            @focus="isSearching = true"
          />
        </div>

        <div class="py-1">
          <div
            v-for="option in filteredOptions"
            :key="option"
            class="px-3 py-2 cursor-pointer hover:bg-base-200 flex items-center gap-2"
            :class="{ 'bg-base-300 text-base-content': isSelected(option) }"
            @click="toggleOption(option)"
          >
            <CheckBox
              :checked="isSelected(option)"
              @update:checked="toggleOption(option)"
              @click.stop
            />
            
            <span class="flex-1">{{ option || '(Empty)' }}</span>
          </div>

          <div
            v-if="filteredOptions.length === 0"
            class="px-3 py-2 text-base-content/70 text-sm"
          >
            No options found
          </div>
        </div>

        <div v-if="selectedItems.length" class="p-2 border-t border-base-300 flex justify-between">
          <button
            type="button"
            class="btn btn-ghost btn-xs"
            @click="clearSelection"
          >
            Clear all
          </button>
          <span class="text-xs text-base-content/70">
            {{ selectedItems.length }} selected
          </span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
  import { ChevronDownIcon, CloseIcon } from '../icons';
  import CheckBox from './CheckBox.vue';

  const props = withDefaults(defineProps<{
    modelValue: string[];
    options: string[];
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
  }>(), {
    placeholder: 'Select options...',
    error: false,
    disabled: false
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string[]];
  }>();

  const inputRef = ref<HTMLDivElement>();
  const searchInput = ref<HTMLInputElement>();
  const dropdownRef = ref<HTMLDivElement>();
  const isOpen = ref(false);
  const isSearching = ref(false);
  const searchTerm = ref('');
  const dropdownStyle = ref({
    top: '0px',
    left: '0px',
    width: '0px'
  });

  const selectedItems = computed(() => props.modelValue || []);
  const filteredOptions = computed(() => {
    if (!searchTerm.value) return props.options;
    
    return props.options.filter(option => 
      option.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  });

  const calculateDropdownPosition = () => {
    if (!inputRef.value || !dropdownRef.value) return;

    const inputRect = inputRef.value.getBoundingClientRect();
    const dropdownHeight = Math.min(240, filteredOptions.value.length * 40 + 100); // Approximate height
    const windowHeight = window.innerHeight;
    
    const spaceBelow = windowHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;
    const openBelow = spaceBelow >= dropdownHeight || spaceBelow > spaceAbove;
    
    const top = openBelow 
      ? inputRect.bottom + 4 
      : inputRect.top - dropdownHeight - 4;
    
    dropdownStyle.value = {
      top: `${top}px`,
      left: `${inputRect.left}px`,
      width: `${inputRect.width}px`
    };
  }

  const openDropdown = () => {
    if (props.disabled) return;
    isOpen.value = true;
    nextTick(() => {
      calculateDropdownPosition();
      if (searchInput.value) {
        searchInput.value.focus();
      }
    });
  }

  const toggleDropdown = () => {
    if (props.disabled) return;
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      nextTick(() => {
        calculateDropdownPosition();
        if (searchInput.value) {
          searchInput.value.focus();
        }
      });
    }
  }

  const closeDropdown = () => {
    isOpen.value = false;
    isSearching.value = false;
    searchTerm.value = '';
  }

  const isSelected = (option: string): boolean => selectedItems.value.includes(option);

  const toggleOption = (option: string) => {
    const newValue = [...selectedItems.value];
    const index = newValue.indexOf(option);
    
    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(option);
    }
    
    emit('update:modelValue', newValue);
  }

  const removeItem = (item: string) => {
    const newValue = selectedItems.value.filter(i => i !== item);
    emit('update:modelValue', newValue);
  }

  const clearSelection = () => {
    emit('update:modelValue', []);
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDropdown();
    } else if (event.key === 'Escape') {
      closeDropdown();
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      isSearching.value = false;
    }, 150);
  }

  const getBadgeWidthClass = (): string | undefined => {
    const count = selectedItems.value.length;
    if (count > 2) return 'max-w-20';
    if (count > 1) return 'max-w-24';
  }

  const handleClickOutside = (event: Event) => {
    if (
      inputRef.value && 
      !inputRef.value.contains(event.target as Node) &&
      dropdownRef.value && 
      !dropdownRef.value.contains(event.target as Node)
    ) {
      closeDropdown();
    }
  }

  const handleResize = () => {
    if (isOpen.value) {
      calculateDropdownPosition();
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleResize);
  });
</script>
