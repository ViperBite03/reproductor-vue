<script setup lang="ts">
  import { watch, computed, ComputedRef, onBeforeUnmount, onMounted, ref, Ref } from 'vue'
  import { useMusicStore } from '@/modules/shared/constants/godStore'
  import { PANEL_OPTIONS } from '@/modules/settings/constants/settings'
  import Svg from '@/modules/shared/components/Svg.vue'
  import Switch from '@/modules/shared/components/Switch.vue'
  import Search from '@/modules/songlist/components/Search.vue'
  import { player } from '@/modules/player/scripts/player'
  import { setColor } from '@/modules/shared/scripts/generic'
  import type { ITag } from '@/modules/player/interfaces/ITag'
  import type { IOrderOptions, IDropdownOptions } from '@/modules/shared/interfaces/IToolbarOptions'

  const musicStore = useMusicStore()

  const currentDropdown: Ref<string> = ref('')
  const isOrderDesc: Ref<boolean> = ref(false)
  const HTMLToolbar = ref(null)

  const toggleSettings = () => {
    if (musicStore.panel === PANEL_OPTIONS.settings) {
      musicStore.panel = ''
      return
    }

    musicStore.panel = PANEL_OPTIONS.settings
  }

  const toggleTagEditor = () => {
    if (musicStore.panel === PANEL_OPTIONS.tagEditor) {
      musicStore.panel = ''
      return
    }

    musicStore.panel = PANEL_OPTIONS.tagEditor
  }

  const toggleOrder = (newOrder: IOrderOptions) => {
    musicStore.orderBy = newOrder
    player.order(isOrderDesc.value)
  }

  const toggleAz = () => {
    isOrderDesc.value = !isOrderDesc.value
    player.order(isOrderDesc.value)
  }

  const toggleDropdown = (newDropdown: IDropdownOptions) => {
    if (newDropdown === currentDropdown.value) {
      currentDropdown.value = ''
      return
    }

    currentDropdown.value = newDropdown
  }

  const toggleTag = (tagName: string) => {
    musicStore.tags = musicStore.tags.map((tag: ITag) => {
      if (tag.name === tagName) {
        tag.active = !tag.active
      }

      return tag
    })

    player.filter()
  }

  const handleClickOutside = (event) => {
    const isSearch = event.target.classList.value === 'search'
    if ((HTMLToolbar.value && !HTMLToolbar.value.contains(event.target)) || isSearch) {
      currentDropdown.value = ''
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  watch(
    () => musicStore.tagsSwitch,
    () => player.filter()
  )

  const activeTags: ComputedRef<ITag[]> = computed(() => musicStore.tags.filter((t) => t.active))
</script>

<style lang="scss">
  #toolbar {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 10px;

    .left {
      display: flex;
      align-items: center;
      width: 100%;

      .tags {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;

        .g-tag {
          width: fit-content;
        }
      }

      .count {
        justify-self: left;
        display: flex;
        align-items: center;
        gap: 6px;
        line-height: 0;
        color: var(--colorPrimary);
        font-family: var(--fontPrimary);
        font-size: 30px;

        .svg-container {
          transform: translateY(-3px);
        }
      }
    }

    .tool {
      border: unset;
      background-color: unset;
      padding: 0;
    }

    .dropdown {
      position: absolute;
      border-radius: var(--radius);
      background-color: var(--colorSecondary);
      backdrop-filter: blur(20px);
      padding: 20px;
      top: 70px;
      width: 400px;
      z-index: 3;

      .g-title {
        font-size: 20px;
      }

      .tag-list {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        padding-bottom: 20px;
      }

      .g-tag {
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }

      .buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;

        .az {
          grid-column: span 2;
        }
      }

      .switch-container {
        display: flex;
        align-items: center;
        width: fit-content;
        padding-bottom: 20px;
        gap: 10px;

        span {
          width: fit-content;
        }
      }
    }
  }
</style>

<template>
  <div id="toolbar" ref="HTMLToolbar">
    <div class="left">
      <div class="count">
        <Svg name="Music" fill="transparent" stroke="var(--colorPrimary)" width="30" height="30"></Svg>
        {{ musicStore.songsFiltered.length }}
      </div>

      <div class="tags">
        <div
          class="g-tag active"
          v-for="tag in activeTags"
          :style="{ 'background-color': tag.color, color: setColor(tag.color) }"
        >
          {{ tag.name }}
        </div>
      </div>
    </div>

    <Search />

    <button class="tool" @click="() => toggleDropdown('filters')">
      <Svg name="Filters" fill="transparent" stroke="var(--colorPrimary)"></Svg>
    </button>

    <div class="dropdown filters" v-show="currentDropdown === 'filters'">
      <h2 class="g-title">Filtros</h2>
      <div class="buttons">
        <button>Repre</button>
        <button>No tags</button>
      </div>

      <h2 class="g-title" style="padding-top: 40px">Ordenar por</h2>
      <div class="buttons">
        <button :class="{ active: musicStore.orderBy === 'title' }" @click="() => toggleOrder('title')">Título</button>
        <button :class="{ active: musicStore.orderBy === 'artist' }" @click="() => toggleOrder('artist')">
          Artista
        </button>
        <button :class="{ active: musicStore.orderBy === 'date' }" @click="() => toggleOrder('date')">Fecha</button>
        <button :class="{ active: musicStore.orderBy === 'shuffle' }" @click="() => toggleOrder('shuffle')">
          Mezclar
        </button>

        <button class="az" @click="toggleAz">{{ isOrderDesc ? 'Z - A' : 'A - Z' }}</button>
      </div>
    </div>

    <button class="tool" @click="() => toggleDropdown('tags')">
      <Svg name="SingleTag" fill="transparent" stroke="var(--colorPrimary)"></Svg>
    </button>

    <div class="dropdown filters" v-if="currentDropdown === 'tags'">
      <h2 class="g-title">Filter Tags</h2>

      <div class="switch-container">
        <span>Todos</span>
        <Switch v-model="musicStore.tagsSwitch" />
        <span>Al menos uno</span>
      </div>

      <div class="tag-list">
        <div
          class="g-tag"
          v-for="tag in musicStore.tags"
          :class="{ active: tag.active }"
          :style="{ 'background-color': tag.color, color: setColor(tag.color) }"
          @click="() => toggleTag(tag.name)"
        >
          {{ tag.name }}
        </div>
      </div>

      <button @click="toggleTagEditor" style="width: 100%">Edit tags</button>
    </div>

    <button class="tool" @click="toggleSettings">
      <Svg customClass="count-songs" name="Settings" fill="transparent" stroke="var(--colorPrimary)"></Svg>
    </button>
  </div>
</template>
