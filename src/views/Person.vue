<template>
  <div
    v-if="person.id"
    class="person__container"
  >
    <div
      class="backdrop"
    />
    <div class="person__img">
      <img
        v-if="person.profile_path"
        :src="'https://image.tmdb.org/t/p/original' + person.profile_path"
        alt=""
      >
      <img
        v-else
        src="../assets/person.png"
        alt=""
      >
    </div>
    <div class="person__info">
      <h2 class="person__name">
        {{ person.name }}
      </h2>
      <div class="person__birth">
        <span>{{ person.birthday }}</span>
        <span>{{ person.place_of_birth }}</span>
      </div>
      <div class="person__biography">
        <span class="subtitle">簡介</span>
        <p
          v-for="(paragraph,index) in person.biography.split('\n\n')"
          :key="index"
        >
          {{ paragraph===''?"目前無資料":paragraph }}
        </p>
      </div>
    </div>
    <div class="person__casts">
      <span class="subtitle ">演出作品</span>
      <TimeLine
        class="strip"
        :casts="adjustedCast"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import useData from '../methods/getData'
import TimeLine from '../components/TimeLine'
export default {
  name: 'Person',
  components: {
    TimeLine
  },
  setup () {
    // ---- variable ---- //
    const route = useRoute()
    const id = route.params.id
    // ---- Person Details ---- //
    const person = ref({})
    const { results, getPerson } = useData()
    const adjustedCast = computed(() => {
      let res = []
      let minYear = 9999
      const notReleased = { cast: [] }
      const len = person.value.combined_credits.cast.length
      for (let i = 0; i < len; i++) {
        const item = person.value.combined_credits.cast[i]
        const year = item.release_date
          ? item.release_date
          : item.first_air_date
        if (year && parseInt(year.split('-')[0]) < minYear) {
          minYear = parseInt(year.split('-')[0])
        }
      }
      for (let i = 0; i < len; i++) {
        const item = person.value.combined_credits.cast[i]
        let year = item.release_date ? item.release_date : item.first_air_date
        if (!year) {
          notReleased.cast.push(item)
        } else {
          year = year.split('-')[0]
          if (!res[year - minYear]) {
            res[year - minYear] = { cast: [] }
          }
          res[year - minYear].cast.push(item)
        }
      }
      const temp = []
      for (let i = 0; i < res.length; i++) {
        if (res[i]) {
          res[i].year = i + minYear
          temp.push(res[i])
        }
      }
      res = temp
      if (notReleased.cast.length) {
        res.push(notReleased)
      }
      return res.reverse()
    })
    onMounted(async () => {
      await getPerson(id)
      person.value = results.value
    })
    onBeforeRouteUpdate(async (to, from) => {
      const id = to.params.id
      await getPerson(id)
      person.value = results.value
    })
    return {
      person,
      adjustedCast
    }
  }
}
</script>

<style lang="scss" scoped>
.person {
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $b-space-m;
    @include respond-to(pad) {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
  &__img {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: $b-space-m;
    img {
      width: 80%;
      align-self: flex-start;
    }
    @include respond-to(phone) {
      img{
        width: 50%;
      }
    }
    @include respond-to(pad) {
      width: 50%;
      padding-top: 100px;
      img{
        width: 75%;
      }
    }
  }
  &__info {
    @include respond-to(pad) {
      width: 50%;
    }
  }
  &__name {
    text-align: center;
    font-size: $b-fontSize*1.5;
    @include respond-to(pad){
      font-size: $b-fontSize-2x;
    }
  }
  &__birth {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: $b-space-m;
    span {
      color: $highlight;
      text-align: center;
    }
    > span:first-child {
      margin-right: $b-space-s;
    }
  }
  &__biography {
    margin-bottom: $b-space-m;
    > p {
      margin-bottom: $b-space-s;
    }
  }
  &__casts {
    > span {
      margin-bottom: $b-space-l;
    }
    @include respond-to(pad) {
      display: flex;
      flex-direction: column;
      align-items: center;
      > .subtitle::after {
        width: 100%;
      }
    }
    @include respond-to(pc){
      width: 80%;
    }
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
.backdrop {
  content: "";
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  height: 70%;
  background-image: url('https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80');
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
      rgba(44, 44, 44, 0.7) 0px,
      rgba(75, 103, 119, 1) 100%
    );
  }
}
.strip{
  @include respond-to(pad){
    padding: 20px 60px;
    background:
      linear-gradient(180deg, $dark 25%,$light 25%,$light 75%,$dark 75%,$dark 100%),linear-gradient(180deg, $dark 25%,$light 25%,$light 75%,$dark 75%,$dark 100%),
      $dark;
    background-size: 30px 60px,30px 60px;
    background-position: 10px 10px,calc(100% - 10px) 10px;
    background-repeat: repeat-y,repeat-y;
  }
}
</style>
