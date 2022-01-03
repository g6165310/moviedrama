<template>
  <div
    v-if="daily"
    class="nav__container"
    :class="{'nav__container--active':isNavOpen}"
  >
    <img
      :src="imgPath"
      alt=""
    >
    <nav>
      <ul
        class="nav__list"
        @click="toggleIsNavOpen"
      >
        <li
          class="list__item "
        >
          <router-link to="/popular/movie">
            熱門電影 <span data-name="MOVIE">MOVIE</span>
          </router-link>
        </li>
        <li
          class="list__item"
          data-name="DRAMA"
        >
          <router-link
            to="/popular/tv"
          >
            熱門影集 <span data-name="DRAMA">DRAMA</span>
          </router-link>
        </li>
        <li
          class="list__item"
          data-name="DRAMA"
        >
          <router-link
            v-if="daily"
            :to="'/'+daily.type+'/'+daily.id"
          >
            每日推薦 <span data-name="DAILY">DAILY</span>
          </router-link>
        </li>
      </ul>
      <div class="search-bar">
        <input
          id="searh-input"
          v-model.trim="inputSearch"
          type="text"
          name="searh-input"
          placeholder="搜尋電影、影集、演員"
          @keyup.enter="getSearch"
        >
        <div
          class="search-bar__btn"
          @click="getSearch"
        >
          <img
            src="../assets/search-solid.svg"
            alt=""
          >
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '../methods/store'
import useData from '../methods/getData'
export default {
  setup () {
    // ---- variable ---- //
    const router = useRouter()
    const imgPath = ref('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')

    // ---- Nav ---- //
    const { isNavOpen, toggleIsNavOpen } = useStore()

    // ---- Daily recommend ---- //
    const { results: daily, getDaily } = useData()
    onMounted(async () => {
      await getDaily()
      imgPath.value = daily.value.poster_path ? 'https://image.tmdb.org/t/p/original' + daily.value.poster_path : imgPath.value
    })

    // ---- Srearch ---- //
    const inputSearch = ref('')
    const getSearch = () => {
      if (inputSearch.value === '') {
        return
      }
      router.push(`/search?search=${inputSearch.value}`)
      toggleIsNavOpen()
      inputSearch.value = ''
    }

    return {
      daily,
      imgPath,
      isNavOpen,
      inputSearch,
      getSearch,
      toggleIsNavOpen
    }
  }

}
</script>

<style lang="scss" scoped>
.nav__container {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100;
  transition: all 400ms ease-in-out;
  transform: translateX(100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $secondary;
  margin: -5px;
  letter-spacing: 0px;
  > img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
    filter: blur(3px) brightness(0.6);
    @include respond-to(pad) {
      position: relative;
      width: 40%;
      filter: none;
    }
    @include respond-to(pc) {
      width: 45%;
    }
  }
  &--active {
    transform: translateX(0%);
  }
}
nav {
  padding: $b-space-l $b-space-m;
  width: 100%;
  @include respond-to(phone) {
    padding: $b-space-l $b-space-s * 4;
  }
  @include respond-to(pad) {
    padding: $b-space-l $b-space-m;
    width: 57.5%;
  }
  @include respond-to(pc) {
    width: 50%;
  }
}
.nav__list {
  display: inline-block;
  margin-bottom: $b-space-l;
}
.list__item {
  font-size: $b-fontSize * 2.5;
  color: white;
  margin-bottom: $b-space-m;
  a {
    position: relative;
    color: $light;
    transition: all 0.5s;
    width: 100%;
    &:before {
      content: "";
      position: absolute;
      width: 0px;
      left: 0;
      bottom: 15px;
      background: $secondary;
      z-index: -1;
      transition: all 0.5s;
      height: $b-space-s;
      @include respond-to(pad) {
        height: $b-space-m;
        background: $primary;
      }
    }
    &:hover {
      transform: translateX($b-space-m);
      span::before {
        width: 100%;
      }
    }
    &:hover:before {
      width: 100%;
    }
    span {
      font-size: $b-fontSize * 1.5;
      position: relative;
      &::before {
        content: attr(data-name);
        width: 0px;
        line-height: 1.25;
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        color: $highlight;
        transition: all 0.5s;
        transition-delay: 0.1s;
      }
      @include respond-to(phone) {
        font-size: $b-fontSize-2x;
        &::before {
          line-height: 1.2;
        }
      }
    }
  }
  @include respond-to(pad) {
    font-size: $b-fontSize * 4;
  }
}
.search-bar {
  position: relative;
  width: 90%;
  @include respond-to(pc) {
    width: 80%;
  }
  &__btn {
    width: 24px;
    position: absolute;
    top: $b-space-s;
    right: $b-space-m;
    cursor: pointer;
  }
}
input {
  width: 100%;
  border-radius: 50px;
  border: 3px solid $highlight;
  background: $primary;
  padding: $b-space-s $b-space-m;
  color: $light;
  &::placeholder {
    color: $highlight;
  }
}
</style>
