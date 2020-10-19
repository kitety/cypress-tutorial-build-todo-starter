import axios from "axios";

export const saveTodo = (todo) =>
  axios.post("http://localhost:3030/api/todos", todo);
export const loadTodo = () =>
  axios.get("http://localhost:3030/api/todos");
