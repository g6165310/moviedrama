<template>
  <div
    v-if="details.id"
    class="detail__container"
  >
    <div
      class="backdrop "
      :style="{
        'background-image': backdropPath
      }"
    />
    <div class="info__container flex-col">
      <img
        v-if="details.poster_path"
        class="info__poster"
        :src="'https://image.tmdb.org/t/p/original' + details.poster_path"
        alt=""
      >
      <img
        v-else
        src="../assets/noimage.jpg"
        alt=""
      >
      <div class="info__content">
        <h1
          class="info__title"
          :data-originalTitle="details.original_title"
        >
          {{ details.title || details.name }}
        </h1>
        <h4 v-if="details.title != details.original_title">
          {{ details.original_title }}
        </h4>
        <h4 v-else-if="details.name != details.original_name">
          {{ details.original_name }}
        </h4>
        <span class="subtitle">大綱</span>
        <p class="info__overview">
          {{ details.overview }}
        </p>
        <span class="subtitle">評分</span>
        <div class="rate">
          <img
            :style="{
              'clip-path': `inset(0 ${
                100 - (details.vote_average / 10) * 100
              }%  0 0)`,
            }"
            src="../assets/popcorn.png"
            alt=""
          >
        </div>
        <span class="rate__count">{{
          details.vote_count
            ? "共" + details.vote_count + "人投票"
            : "尚無人評分"
        }}</span>
      </div>
    </div>
    <div class="actor__container">
      <span class="subtitle">演員名單</span>
      <swiper
        v-if="details.credits.cast.length"
        ref="actorSwiper"
        class="strip"
        :slides-per-view="1"
        :space-between="20"
        :breakpoints="swiperBreakpoint"
        :lazy="true"
      >
        <swiper-slide
          v-for="actor in details.credits.cast"
          :key="actor.id"
        >
          <router-link :to="`/actor/` + actor.id" />
          <img
            v-if="actor.profile_path"
            class="swiper-lazy"
            :data-src="
              'https://image.tmdb.org/t/p/original' + actor.profile_path
            "
            alt=""
          >
          <img
            v-else
            class="swiper-lazy"
            :data-src="require('@/assets/person.png')"
            alt=""
          >
          <div class="swiper-lazy-preloader swiper-lazy-preloader-white" />
          <h4 class="actor__name">
            {{ actor.name }}
          </h4>
        </swiper-slide>
      </swiper>
      <div
        v-else
        class="swiper-container--nodata"
      >
        暫時沒有資料
      </div>
    </div>
    <div class="additionals__container">
      <div
        v-if="type === 'movie'"
        class="additionals__collection"
      >
        <span class="subtitle">系列作品</span>
        <swiper
          v-if="details.belongs_to_collection"
          ref="collectionSwiper"
          class="collection__swiper__container"
          :slides-per-view="1"
          :breakpoints="swiperBreakpoint"
        >
          <div
            v-if="details.belongs_to_collection"
            class="collection__swiper__bg"
            :style="{
              'background-image': details.belongs_to_collection.backdrop_path
                ? `url('https://image.tmdb.org/t/p/w1280_and_h720_bestv2${details.belongs_to_collection.backdrop_path}')`
                : 'none',
            }"
          />
          <swiper-slide
            v-for="movie in details.belongs_to_collection.parts"
            :key="movie.id"
          >
            <router-link :to="'/'+type+'/' + movie.id" />
            <img
              v-if="movie.poster_path"
              :src="
                'https://image.tmdb.org/t/p/original' + movie.poster_path
              "
              alt=""
            >
            <img
              v-else
              src="../assets/noimage.jpg"
              alt=""
            >
            <h4 class="actor__name">
              {{ movie.title }}
            </h4>
          </swiper-slide>
        </swiper>
        <div v-else>
          無相關系列作品
        </div>
      </div>
      <div
        v-else
        class="additionals__seasons"
      >
        <span class="subtitle">季數</span>
        <ul
          v-if="details.seasons.length"
          class="seasons__list"
        >
          <AccordionItem
            v-for="item in details.seasons"
            :key="item._id || item.id"
            :item="item"
          />
        </ul>
      </div>
      <div class="additionals__keywords">
        <span class="subtitle">關鍵字</span>
        <ul
          v-if="keywords.length"
          class="keywords__container"
        >
          <li
            v-for="(item, index) in keywords"
            :key="index"
            class="tag keywords__item"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import 'swiper/swiper-bundle.css'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { onMounted, computed, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import useData from '../methods/getData'
import AccordionItem from '../components/AccordionItem'

import SwiperCore, {
  Lazy
} from 'swiper'
SwiperCore.use(Lazy)
export default {
  components: {
    Swiper,
    SwiperSlide
  },
  setup () {
    // ---- variable ---- //
    const route = useRoute()
    const id = ref(route.params.id)
    const type = ref(route.path.split('/')[1])
    const swiperBreakpoint = {
      480: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 30
      },
      960: {
        slidesPerView: 6,
        spaceBetween: 30
      }
    }

    // ---- Details ---- //
    const { results: details, getDetails } = useData()
    const keywords = computed(() => {
      if (details.value.id && type.value === 'movie') {
        return [
          ...details.value.genres,
          ...details.value.keywords.keywords
        ]
      } else {
        return [
          ...details.value.genres,
          ...details.value.keywords.results
        ]
      }
    })
    const backdropPath = computed(() => {
      if (details.value.backdrop_path) {
        return `url('https://image.tmdb.org/t/p/w1280_and_h720_bestv2${details.value.backdrop_path}')`
      } else if (details.value.poster_path) {
        return `url('https://image.tmdb.org/t/p/original${details.value.poster_path}')`
      }
      return 'url(\'https://images.unsplash.com/photo-1540924817141-d963bdafed69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80\')'
    })
    onMounted(async () => {
      await getDetails(type.value, id.value)
    })
    onBeforeRouteUpdate(async (to, from) => {
      type.value = to.path.split('/')[1]
      id.value = to.params.id
      await getDetails(type.value, id.value)
    })

    return {
      type,
      details,
      keywords,
      backdropPath,
      AccordionItem,
      swiperBreakpoint
    }
  }
}
</script>
<style lang="scss" scoped>
.detail__container {
  margin: 0 $b-space-s;
  margin-bottom: $b-space-l;

  @include respond-to(pad) {
    margin: 0 $b-space-m;
  }
  @include respond-to(pc){
    max-width: 1024px;
    margin: 0 auto;
  }
}
.backdrop {
  content: "";
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  height: 50%;
  background-size: cover;
  background-position: center;
  z-index: -1;
  background-repeat: no-repeat;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      to bottom,
      rgba(44, 44, 44, 0.7) 0,
      rgba(75, 103, 119, 1) 100%
    );
  }
  @include respond-to(pad) {
    height: 80%;
  }
}
.subtitle {
  display: inline-block;
  font-size: $b-fontSize * 1.5;
  position: relative;
  margin-bottom: $b-space-s;
  z-index: 1;
  @include respond-to(pad) {
    font-size: $b-fontSize-2x;
  }
  &::after {
    content: "";
    position: absolute;
    width: 120%;
    height: 25%;
    bottom: 8px;
    left: 0;
    background-color: $secondary;
    z-index: -1;
  }
}
.info {
  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: $b-space-l;
    @include respond-to(pad) {
      flex-direction: row;
    }
  }
  &__poster {
    width: 100%;
    margin-bottom: $b-space-l;
    @include respond-to(phone){
      width: 50%;
    }
    @include respond-to(pad) {
      /*width設為0 確保父元素確實被平分*/
      width: 0%;
      flex:1;
    }
  }
  &__content {
    width: 100%;
    @include respond-to(pad) {
      width: 0%;
      flex: 2;
      padding: 0 $b-space-l;
    }
  }
  &__title {
    font-size: $b-fontSize*1.5;
    text-align: center;
    position: relative;
    &+h4 {
      text-align: center;
      font-size: $b-fontSize;
    }
    @include respond-to(pad){
      font-size: $b-fontSize-2x;
      &+h4{
        font-size: $b-fontSize*1.25;
      }
    }
    @include respond-to(pc) {
      font-size: $b-fontSize-3x;
      &+h4{
        font-size: $b-fontSize*1.75;
      }
    }

  }
  &__overview {
    margin: 0 $b-space-s $b-space-l $b-space-s;
    @include respond-to(pad) {
      font-size: $b-fontSize * 1.25;
    }
  }
}
.rate {
  height: 64px;
  background-image: url("../assets/popcorn_gray.png");
  background-size: contain;
  background-repeat: no-repeat;
  &__count {
    display: block;
    text-align: right;
    color: $highlight;
  }
  img {
    width: 320px;
  }
}
.swiper-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  a{
    position: absolute;
    display: block;
    width: 50%;
    height: 100%;
    z-index: 10;
    @include respond-to(phone){
      width: 100%;
    }
  }
  img {
    width:50%;
    height: 200px;
    object-fit: cover;
    object-position: 50% 30%;
    @include respond-to(phone){
      width: 100%;
    }
  }
}
.swiper-container--nodata {
  font-size: $b-fontSize * 1.5;
}

.actor__container {
  margin-bottom: $b-space-l;
}
.actor__name{
  display: flex;
  justify-content: center;
  align-items: center;
  height: $b-fontSize * 4;
  text-align: center;
}
.additionals {
  &__collection {
    font-size: $b-fontSize * 1.5;
     margin-bottom: $b-space-l
  }
}
.keywords__container {
  display: flex;
  flex-wrap: wrap;
  li {
    margin-bottom: $b-space-s;
  }
}
.seasons__list {
  & > li {
    margin:0 0 $b-space-m 0;
  }
}
.strip {
    padding: $b-space-s*4 $b-space-s;
    margin: 0;
    background:
    linear-gradient(90deg, $dark 25%,$light 25%,$light 75%,$dark 75%,$dark 100%),linear-gradient(90deg, $dark 25%,$light 25%,$light 75%,$dark 75%,$dark 100%),
    $dark;
    background-size: 30px 15px;
    background-repeat: repeat-x, repeat-x, repeat;
    background-position: 10px 10px, 10px calc(100% - 10px);
    @include respond-to(pad){
      padding: $b-space-s*5 $b-space-m;
      background-size: 60px 30px, 60px 30px;

    }
}
.collection__swiper__container{
  padding: $b-space-l $b-space-m;
}
.collection__swiper__bg{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-position: center;
  background-size: cover;
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(44, 44, 44, 0.7);
  }
}
</style>
