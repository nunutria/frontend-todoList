<template>
    <MainHeader :theme="theme" @update-theme="themeHandler" />
    <main>
        <TodoList />
    </main>
</template>

<script setup>
import {ref, watch} from "vue";

import MainHeader from "./components/ui/MainHeader.vue";
import TodoList from "./components/TodoList.vue";

const theme = ref(localStorage.getItem("theme") || "light");

const themeHandler = () => {
    theme.value === "light" ? (theme.value = "dark") : (theme.value = "light");
    localStorage.setItem("theme", theme.value);
};

watch(
    theme,
    (value) => {
        if (value === "dark") {
            // Add data-theme="dark" to <body> for theme
            document.querySelector("body").dataset.theme = "dark";
        } else {
            document.querySelector("body").dataset.theme = "light";
        }
    },
    {immediate: true}
);
</script>

<style scoped></style>
