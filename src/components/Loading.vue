<template>
  <div
    class="loading overlay d-flex-center"
  >
    <div
      class="loading__animation d-flex-center"
    >
      <span>L</span>
      <span>O</span>
      <span>A</span>
      <span>D</span>
      <span>I</span>
      <span>N</span>
      <span>G</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading{
  font-family: 'Anton', sans-serif;
    z-index: 5000;
    &__animation{
        position: relative;
        background-color: rgba(#000,0.8);
        overflow: hidden;
        color: #fff;
        width: 100%;
        height: 150px;
        font-size:$b-fontSize *4 ;
        @include respond-to(pad){
          &{
            height: 300px;
            font-size: $b-fontSize *8;
          }
        }
        &::before,&::after{
            content: '';
            position: absolute;
            width: 120%;
            height: 100%;
            animation: loading 200ms infinite;
            left: 0;
        }
        &::before{
            top: 10px;
            border-top: 5px dashed #fff;
        }
        &::after{
            border-bottom: 5px dashed #fff;
            bottom: 10px;
        }
    }
    span{
        animation: text-wave 0.7s infinite;

        @for $i from 1 to 7{
            &:nth-child(#{$i}){
                animation-delay: 0.1s*$i;
            }
        }

    }
}
.overlay{
    position: fixed;
    background-color: rgba($secondary,0.8);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

</style>
