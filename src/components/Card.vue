<template>
  <div
    class="card"
  >
    <slot />

    <div class="card__img">
      <img
        v-if="item['poster_path']"
        :src="`https://image.tmdb.org/t/p/w600_and_h900_bestv2`+ item['poster_path']"
        alt=""
      >
      <img
        v-else
        src="../assets/noimage.jpg"
        style="height:100%"
        alt=""
      >
    </div>
    <div class="card__content">
      <h2 class="card__title">
        {{ item.title ||item.name }}
      </h2>
      <p class="card__outline">
        {{ item.overview || "暫無資料" }}
      </p>
      <div class="card__date">
        {{ item['release_date'] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
