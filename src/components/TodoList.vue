<template>
    <div class="wrapper">
        <div :class="`todo-list ${windowWidth < 800 ? 'todo-list--mobile' : ''}`">
            <header class="add-todo list-group">
                <div class="todo-list__wrapper">
                    <div class="list-group__item list-group__item--disable-drag">
                        <div class="checkbox"></div>
                        <input
                            type="text"
                            placeholder="Create a new todo..."
                            id="add-todo"
                            name="add-todo"
                            v-model="newTodoItem"
                            v-on:keyup.enter="addTodo(newTodoItem)"
                        />
                        <button aria-label="Add Todo" class="button add-todo-handler" @click="addTodo(newTodoItem)" :disabled="!newTodoItem">
                            <Icon icon="uil:plus" />
                        </button>
                    </div>
                </div>
            </header>
            <div class="todo-list__wrapper">
                <div class="list-group__item" v-if="showMessage">
                    <div class="message">{{ message }}</div>
                </div>
                <draggable class="list-group" v-model="filteredList" v-bind="dragOptions" @start="drag = true" @end="drag = false" item-key="order">
                    <template #item="{element}">
                        <li class="list-group__item" :data-order="element.order">
                            <button
                                aria-label="Complete Todo"
                                :class="`checkbox ${element.checked ? `checkbox--checked` : ``}`"
                                data-item-id=""
                                @click="completeTodo(element.order)"
                            >
                                <div class="checkbox-icon">
                                    <Icon icon="uil:check" v-if="element.checked" />
                                </div>
                                <div class="checkbox-hover-bg"></div>
                            </button>
                            <input type="checkbox" />
                            <span :class="`todo-name ${element.checked ? `text--strike` : ``}`">{{ element.name }}</span>
                            <button aria-label="Remove Todo" class="button remove-todo-handler" @click="removeTodo(element.order)">
                                <Icon icon="material-symbols-light:close-rounded" />
                            </button>
                        </li>
                    </template>
                    <li class="list-group__item"></li>
                </draggable>
                <footer :class="`todo-list-footer ${windowWidth > 800 ? 'cols--3' : 'cols--2'}`">
                    <div class="todo-list-footer__left">
                        <span class="todo-list-footer__left--count">{{ activeItemsLeft }} items left</span>
                    </div>
                    <div class="todo-list-footer__center" v-if="windowWidth > 800">
                        <button
                            aria-label="Filter All"
                            :class="`button button--clear ${activeFilter === 'all' ? 'button--active' : ''}`"
                            @click="filterTodoList('all')"
                        >
                            All
                        </button>
                        <button
                            aria-label="Filter Active"
                            :class="`button button--clear ${activeFilter === 'active' ? 'button--active' : ''}`"
                            @click="filterTodoList('active')"
                        >
                            Active
                        </button>
                        <button
                            aria-label="Filter Completed"
                            :class="`button button--clear ${activeFilter === 'completed' ? 'button--active' : ''}`"
                            @click="filterTodoList('completed')"
                        >
                            Completed
                        </button>
                    </div>
                    <div class="todo-list-footer__right">
                        <button class="button button--clear" aria-label="Clear Completed Button" @click="clearCompleted">Clear Completed</button>
                    </div>
                </footer>
            </div>
        </div>
        <footer class="todo-list-footer todo-list-footer--mobile todo-list__wrapper" v-if="windowWidth < 800">
            <div class="todo-list-footer__center">
                <button
                    aria-label="Filter All"
                    :class="`button button--clear ${activeFilter === 'all' ? 'button--active' : ''}`"
                    @click="filterTodoList('all')"
                >
                    All
                </button>
                <button
                    aria-label="Filter Active"
                    :class="`button button--clear ${activeFilter === 'active' ? 'button--active' : ''}`"
                    @click="filterTodoList('active')"
                >
                    Active
                </button>
                <button
                    aria-label="Filter Completed"
                    :class="`button button--clear ${activeFilter === 'completed' ? 'button--active' : ''}`"
                    @click="filterTodoList('completed')"
                >
                    Completed
                </button>
            </div>
        </footer>
    </div>
</template>

<script setup>
import {ref, watch, onMounted} from "vue";
import draggable from "vuedraggable";
import {useTodoListStore} from "@/stores/todoList";
import {Icon} from "@iconify/vue";

const store = useTodoListStore();

const windowWidth = ref(window.innerWidth);
const showMessage = ref(false);
const message = ref("All Done!");
const todoList = ref(store.getTodoList());
const newTodoItem = ref(null);

const drag = ref(false);

const dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "item--moving",
    tag: "ul",
};

const addTodo = (name) => {
    console.log(`Add Todo: ${newTodoItem.value}`);
    //const order = todoList.value.length + 1;

    // Check if todo order number is already in use and increment from there if it is
    let order = todoList.value.length + 1;
    while (todoList.value.some((todo) => todo.order === order)) {
        order++;
    }

    const newTodo = {
        name,
        order,
        checked: false,
    };
    todoList.value.push(newTodo);
    filteredList.value = todoList.value;
    localStorage.setItem("todoList", JSON.stringify(todoList.value));
    newTodoItem.value = null;
};

const removeTodo = (order) => {
    const index = filteredList.value.findIndex((todo) => todo.order === order);
    console.log(`Remove Todo: ${index}`);
    if (index !== -1) {
        filteredList.value.splice(index, 1);
        store.setTodoList(filteredList.value);
        localStorage.setItem("todoList", JSON.stringify(filteredList.value));
    }
};

const completeTodo = (order) => {
    const index = filteredList.value.findIndex((todo) => todo.order === order);
    console.log(`Complete Todo: ${index}`);
    if (index !== -1) {
        filteredList.value[index].checked = !filteredList.value[index].checked;
        store.setTodoList(filteredList.value);
        localStorage.setItem("todoList", JSON.stringify(filteredList.value));
    }
};

const activeFilter = ref("all");
const activeItemsLeft = ref(0);
const filteredList = ref(todoList.value);
const filterTodoList = (filter) => {
    console.log(`Filter Todo List By: ${filter}`);
    switch (filter) {
        case "all":
            activeFilter.value = "all";
            return (filteredList.value = todoList.value);
        case "active":
            activeFilter.value = "active";
            return (filteredList.value = todoList.value.filter((todo) => !todo.checked));
        case "completed":
            activeFilter.value = "completed";
            return (filteredList.value = todoList.value.filter((todo) => todo.checked));
        default:
            activeFilter.value = "all";
            return (filteredList.value = todoList.value);
    }
};

const clearCompleted = () => {
    console.log("Clear Completed");
    todoList.value = todoList.value.filter((todo) => !todo.checked);
    filteredList.value = todoList.value;
    localStorage.setItem("todoList", JSON.stringify(todoList.value));
    filterTodoList(activeFilter.value);
};

watch(
    filteredList,
    () => {
        filteredList.value.length === 0 || todoList.value.length === 0 ? (showMessage.value = true) : (showMessage.value = false);

        console.log("Filtered List Changed");
        console.log(filteredList.value.length);

        switch (activeFilter.value) {
            case "all":
                message.value = "No Todos!";
                break;
            case "active":
                message.value = "No Active Todos.";
                break;
            case "completed":
                message.value = "No Completed Todos.";
                break;
            default:
                message.value = "No Todos!";
                break;
        }

        activeItemsLeft.value = todoList.value.filter((todo) => !todo.checked).length;
    },
    {immediate: false, deep: true}
);

watch(newTodoItem, () => {
    console.log(`New Todo Item: ${newTodoItem.value}`);
});

// Watch Drag and when Drag is completed update the todoList order data attributes
watch(
    drag,
    (value) => {
        if (!value) {
            const listItems = document.querySelectorAll(".list-group__item");
            listItems.forEach((item, index) => {
                item.dataset.order = index;
            });

            // Update filteredList Order values
            filteredList.value.forEach((todo, index) => {
                todo.order = index + 1;
            });

            console.table(filteredList.value);
            localStorage.setItem("todoList", JSON.stringify(filteredList.value));
        }
    },
    {immediate: false}
);

onMounted(() => {
    if (localStorage.getItem("todoList") !== null) {
        store.setTodoList(JSON.parse(localStorage.getItem("todoList")));
    }

    filteredList.value = todoList.value = store.getTodoList();
});

window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
});
</script>

<style scoped lang="scss">
.todo-list__wrapper {
    background: var(--todo-list-background);
    border-radius: var(--global-border-radius);
    overflow: hidden;
    box-shadow: 0 0 1.5rem 0 rgba(0, 0, 0, 0.2);
}
.todo-list {
    margin-top: -9rem;
    z-index: 1;
    position: relative;
    margin-bottom: 4rem;

    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }

    .item--moving {
        opacity: 0.5;
        background: var(--light-grayish-blue);
    }

    .list-group {
        min-height: 20px;
        list-style-type: none;
        margin: 0;
        padding: 0;

        &.add-todo {
            box-shadow: unset;
            margin-bottom: 1.5rem;

            .list-group__item {
                border-bottom: none;
            }

            input[type="text"] {
                width: 100%;
                border: none;
                outline: none;
                font-size: 1.125rem;
                color: var(--clr-list-item-color);
                background: transparent;
                caret-color: var(--add-todo-caret-color);
            }
        }
    }

    .list-group__item {
        cursor: move;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        padding: 1rem;
        font-size: 1.125rem;
        color: var(--list-item-color);
        border-top: 1px solid var(--clr-list-item-border);

        &:first-child {
            border-top: none;
        }

        &:last-child {
            border-bottom: 1px solid var(--clr-list-item-border);
        }

        input[type="checkbox"] {
            display: none;
        }

        span {
            flex: 1; // Grow to fit content
        }

        &.list-group__item--disable-drag {
            cursor: default;

            .checkbox {
                cursor: default;
            }
        }

        .todo-name {
            transition: all 300ms ease;
        }
    }

    .checkbox {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        position: relative;
        --_size: 1.874rem;
        width: var(--_size);
        height: var(--_size);
        border-radius: 50%;
        border: 1px solid var(--clr-list-item-border);
        margin-right: 1.5rem;
        background-color: var(--checkbox-background-color);
        flex: 0 0 var(--_size);
        cursor: pointer;
        transition: all 300ms ease;

        &.checkbox--checked {
            color: var(--clr-white);
            background: var(--check-background);

            &:hover {
                .checkbox-hover-bg {
                    visibility: hidden;
                    opacity: 0;
                    pointer-events: none;
                }
            }
        }

        .checkbox-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            position: relative;
        }

        .checkbox-hover-bg {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            --_bg-size: 100%;
            width: var(--_bg-size);
            height: var(--_bg-size);
            color: var(--clr-white);
            background: var(--check-background);
            border-radius: 50%;
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
            transition: opacity 300ms ease;
            z-index: 0;

            &::after {
                display: block;
                --_inner-size: calc(100% - 2px);
                width: var(--_inner-size);
                height: var(--_inner-size);
                content: "";
                position: absolute;
                z-index: 1;
                background: var(--check-hover-bg-color);
                border-radius: 50%;
                border: none;
            }
        }

        &:hover {
            .checkbox-hover-bg {
                visibility: visible;
                opacity: 1;
                pointer-events: all;
            }
        }
    }

    .list-group__item i {
        cursor: pointer;
    }

    .add-todo-handler {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        --_size: 2.125rem;
        width: var(--_size);
        height: var(--_size);
        border-radius: 50%;
        border: 1px solid transparent;
        margin-right: 0;
        background-color: var(--add-todo-base-color);
        flex: 0 0 var(--_size);
        color: var(--clr-list-item-color);
        cursor: pointer;
        transition: all 300ms ease;

        &:hover {
            background-color: var(--clr-add-todo-button-hover);
        }
    }

    .remove-todo-handler {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        font-size: 1.875rem;
        border-radius: 50%;
        border: 1px solid transparent;
        margin-right: 0;
        background-color: transparent;
        flex: 0 0 var(--_size);
        color: var(--clr-remove-item-icon);
        transition: all 300ms ease;
        margin: 0;
        padding: 0;
        pointer-events: none;
        visibility: hidden;
        opacity: 0;
    }

    .list-group__item:hover {
        .remove-todo-handler {
            cursor: pointer;
            pointer-events: all;
            visibility: visible;
            opacity: 1;
        }
    }
}

.todo-list--mobile {
    margin-bottom: 1rem;

    .list-group__item:last-child {
        border-bottom: none;
    }
}

.todo-list-footer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 1rem;
    position: relative;
    font-size: 0.875rem;
    color: var(--footer-button-text-color);

    &.cols--3 {
        grid-template-columns: repeat(3, 1fr);
    }

    &.cols--2 {
        grid-template-columns: repeat(2, 1fr);
        text-align: center;
    }

    .todo-list-footer__left {
        text-align: left;
    }

    .todo-list-footer__right {
        text-align: right;
    }

    button {
        font-weight: 700;
        color: var(--footer-button-text-color);
        transition: all 300ms ease;

        &:hover {
            color: var(--footer-button-text-color-hover);
        }

        &.button--active {
            color: var(--clr-bright-blue);
        }
    }
}

.todo-list-footer--mobile {
    margin-top: 1.5rem;
    grid-template-columns: 1fr;
    text-align: center;

    &.todo-list__wrapper {
        background-color: var(--todo-list-background);
    }
}

.message {
    text-align: center;
    width: 100%;
    font-size: 0.875rem;
    color: var(--list-item-color);
}

.text--strike {
    text-decoration: line-through;
    color: var(--list-item-strike-color);
}
</style>
