import {ref, computed} from "vue";
import {defineStore} from "pinia";

export const useTodoListStore = defineStore("todoList", () => {
    const todos = ref([]);
    const completedTodos = computed(() => todos.value.filter((todo) => todo.completed));
    const activeTodos = computed(() => todos.value.filter((todo) => !todo.completed));

    function setTodoList(newTodos) {
        todos.value = newTodos;
    }
    function getTodoList() {
        return todos.value;
    }
    function add(todo) {
        todos.value.push(todo);
    }
    function remove(todo) {
        todos.value.splice(todos.value.indexOf(todo), 1);
    }
    function toggle(todo) {
        todo.completed = !todo.completed;
    }
    function clearCompleted() {
        todos.value = todos.value.filter((todo) => !todo.completed);
    }
    return {
        todos,
        completedTodos,
        activeTodos,
        setTodoList,
        getTodoList,
        add,
        remove,
        toggle,
        clearCompleted,
    };
});
