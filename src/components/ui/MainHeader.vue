<template>
    <header class="main-header" :class="props.theme === `light` ? `main-header--light-${headerBg}` : `main-header--dark-${headerBg}`">
        <div class="wrapper">
            <h1>TODO</h1>
            <button class="button button--clear" aria-label="Update Theme Button" @click="emit('updateTheme')">
                <IconSun v-if="props.theme == `dark`" />
                <IconMoon v-else />
            </button>
        </div>
    </header>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import IconSun from "@/components/icons/IconSun.vue";
import IconMoon from "@/components/icons/IconMoon.vue";

const props = defineProps({
    theme: String,
});

const emit = defineEmits(["updateTheme"]);

const breakpoints = ref({
    mobile: 780,
    desktop: 1440,
});

const headerBg = ref(null);
const windowSize = ref(null);

watch(
    windowSize,
    (value) => {
        value > breakpoints.value.mobile ? (headerBg.value = "desktop") : (headerBg.value = "mobile");
    },
    {immediate: true}
);

onMounted(() => {
    console.log(window.innerWidth);
    window.innerWidth > breakpoints.value.mobile ? (headerBg.value = "desktop") : (headerBg.value = "mobile");

    windowSize.value = window.innerWidth;
});

window.addEventListener("resize", () => {
    windowSize.value = window.innerWidth;
});
</script>

<style scoped lang="scss">
.main-header {
    display: block;
    width: 100%;

    background-size: cover;
    background-position: 0 0;
    background-repeat: no-repeat;
    color: var(--clr-white);
    transition: all 300ms ease;
    position: relative;

    &.main-header--dark-desktop,
    &.main-header--light-desktop {
        aspect-ratio: 1440 / 300;
        height: 300px;
    }

    &.main-header--light-mobile,
    &.main-header--dark-mobile {
        aspect-ratio: 375 / 200;
        height: 375px;
    }

    &.main-header--dark-desktop {
        background-image: url("../../assets/bg-desktop-dark.jpg");
    }

    &.main-header--dark-mobile {
        background-image: url("../../assets/bg-mobile-dark.jpg");
    }

    &.main-header--light-desktop {
        background-image: url("../../assets/bg-desktop-light.jpg");
    }

    &.main-header--light-mobile {
        background-image: url("../../assets/bg-mobile-light.jpg");
    }

    .wrapper {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        z-index: 0;
        position: absolute;
        bottom: 10rem;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
