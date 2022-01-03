<template>
  <li
    class="accordion__item"
    :class="{'accordion__item--last':!hasItem}"
  >
    <div
      class="accordion__title"
      @click="toggle"
    >
      <span v-if="item.episode_number">EP. {{ item.episode_number }}</span>
      {{ item.name }}
      <span
        v-if="hasItem"
        class="accordion__toggle"
      >{{ isOpen ? '-' : '+' }}</span>
    </div>
    <p class="accordion__overview">
      {{ item.overview ||'目前沒有資料' }}
    </p>
    <p
      v-if="!hasItem"
      class="accordion__airDate"
    >
      首播 : {{ item.air_date }}
    </p>
    <ul
      v-if="hasItem"
      v-show="isOpen"
    >
      <AccordionItem
        v-for="(child) in item.episodes"
        :key="(child._id||child.id)"
        :item="child"
      />
    </ul>
  </li>
</template>

<script>
import { computed, ref } from 'vue'
export default {
  name: 'AccordionItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    // ---- variable ----//
    const isOpen = ref(false)
    const hasItem = computed(() => {
      return props.item.episodes
    })

    // ---- controller ----//
    function toggle () {
      if (hasItem.value) {
        isOpen.value = !isOpen.value
      }
    }
    return {
      toggle,
      isOpen,
      hasItem
    }
  }
}
</script>

<style lang='scss' scoped>
.accordion{
  &__title{
    background-color: $secondary;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    font-size: $b-fontSize*1.25;
    margin-bottom:$b-space-s ;
    padding:0 $b-space-s ;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    @include respond-to(pad){
      font-size: $b-fontSize*1.5;
    }
  }
  &__airDate{
    margin-bottom:$b-space-s ;
    text-align: right;
  }
  &__overview{
    margin: 0 $b-space-m $b-space-m $b-space-s;
    @include respond-to(pad){
      font-size: $b-fontSize*1.25;
    }
  }
}
.accordion__item--last{
  border-left: 5px solid $highlight;
  margin-bottom: $b-space-m;
  padding-left:  $b-space-s;
  cursor: auto;
  .accordion__title{
    background: none;
    display: block;
    cursor: auto;
  }
}
</style>
