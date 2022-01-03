<template>
  <div
    v-if="casts.length"
    class="timeline__container"
  >
    <ul class="timeline__list">
      <li
        v-for="(item,index) in casts"
        :key="index"
        class="timeline__item"
      >
        <img
          v-if="backdrop[index]"
          class="timeline__item__backdrop"
          :src="'https://image.tmdb.org/t/p/original' +backdrop[index]"
          alt=""
        >
        <h4
          class="timeline__item__year"
          :class="{'timeline__item__year--noImage':!backdrop[index]}"
        >
          {{ item.year||"未播出" }}
        </h4>
        <ul class="cast__list">
          <li
            v-for="cast in item.cast"
            :key="cast.id"
            class="cast__item"
          >
            <router-link :to="`/${cast.media_type}/${cast.id}`">
              {{ cast.name||cast.title }} <span v-if="cast.character">飾演 {{ cast.character }}</span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'TimeLine',
  props: {
    casts: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const backdrop = computed(() => {
      const res = []
      for (let i = 0; i < props.casts.length; i++) {
        for (let j = 0; j < props.casts[i].cast.length; j++) {
          if (props.casts[i].cast[j].backdrop_path) {
            res[i] = props.casts[i].cast[j].backdrop_path
            break
          }
        }
      }
      return res
    })
    return {
      backdrop
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline {
  &__container {
    width: 90%;
    margin: 0 auto;
    @include respond-to(pad) {
      width: 100%;
      padding: $b-space-m;
    }
  }
  &__list {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    &::before {
      content: "";
      position: absolute;
      width: 2px;
      height: 100%;
      background: rgba(255, 255, 255, 0.07);
      margin-left: -5%;
      @include respond-to(pad) {
        left: 50%;
        margin-left: 0;
        transform: translateX(-50%);
      }
    }
  }
  &__item {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0 0 $b-space-l 0;
    & li:hover {
      transform: translateX($b-space-s);
      transition: all 0.3s linear;
    }
    @include respond-to(pad) {
      width: 50%;
      padding: 0 $b-space-l $b-space-l 0;
      &:nth-of-type(even) {
        align-self: flex-end;
        padding: 0 0 $b-space-l $b-space-l;
        &::before {
          margin-left: 0;
          left: -1px;
        }
        & li:hover {
          transform: translateX($b-space-l);
          transition: all 0.3s linear;
        }
      }
      &:nth-of-type(odd) {
        text-align: end;
        &::before {
          right: -1px;
        }
        & li:hover {
          transform: translateX(-$b-space-l);
          transition: all 0.3s linear;
        }
      }
    }
    &::before {
      content: "";
      position: absolute;
      bottom: 20%;
      transform: translateY(-70%);
      background-color: $highlight;
      width: 2px;
      height: 20px;
      margin-left: -5%;
    }
    &__backdrop {
      width: 100%;
      height: 200px;
      object-fit: cover;
      object-position: center;
      @include respond-to(phone){
        width: 75%;
      }
      @include respond-to(pad){
        width: 100%;
      }
    }
    &__year {
      align-self: start;
      &::after{
        content: '';
        position: absolute;
        top: 15%;
        height: 35%;
        left: 5%;
        right: 5%;
        background-color: $secondary;
        z-index: -1;
      }
      z-index: 1;
      color: $highlight;
      padding: 0 $b-space-s*1.5;
      font-size: $b-fontSize * 3;
      margin: -$b-space-m *1.25 0 $b-space-s 0;
      position: relative;
      &--noImage {
        margin: 0 0 $b-space-s 0;
      }
    }
  }
}
.cast {
  &__item {
    margin-bottom: $b-space-s;
    transition: all 0.2s linear;
    span {
      color: $highlight;
    }
  }
}
</style>
