<template>
  <div class="responsive-list">
    <div class="responsive-list__desktop">
      <slot name="desktop" />
    </div>
    <div class="responsive-list__mobile">
      <slot name="mobile" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.responsive-list {
  min-width: 0;

  &__desktop {
    display: block;
  }

  &__mobile {
    display: none;
  }

  @include mobile {
    &__desktop {
      display: none;
    }

    &__mobile {
      display: block;
    }
  }
}
</style>
