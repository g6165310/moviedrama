<template>
  <div class="notFound--container" />
  <h2 class="d-flex-center">
    發生錯誤或是找不到相符的頁面
  </h2>
</template>
<style lang="scss" scoped>
.notFound--container{
  background-image: url('https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 60vh;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(44, 44, 44, 0.5);
  }
   @include respond-to(phone){
     height: 70vh;
  }
}
h2{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-size: $b-fontSize;
  @include respond-to(phone){
    font-size: $b-fontSize*1.5;
  }
  @include respond-to(pad){
    font-size: $b-fontSize-2x;
  }
}
</style>
