import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";
import { saveTodo, loadTodo, destroyTodo, updateTodo } from "../lib/service";
import { filterTodos } from "../lib/utils";
export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: "",
      todos: [],
    };
    this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleNewTodoChange(e) {
    this.setState({ currentTodo: e.target.value });
  }
  handleTodoSubmit(e) {
    e.preventDefault();
    saveTodo({
      name: this.state.currentTodo,
      isComplete: false,
    })
      .then(({ data }) => {
        this.setState({
          todos: this.state.todos.concat(data),
          currentTodo: "",
          error: false,
        });
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }
  componentDidMount() {
    loadTodo()
      .then(({ data: todos }) => {
        this.setState({
          todos,
          error: false,
        });
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }
  handleDelete(id) {
    destroyTodo(id).then(() => {
      this.setState({
        todos: this.state.todos.filter((i) => i.id !== id),
      });
    });
  }
  handleUpdate(id) {
    const target = this.state.todos.find((i) => i.id === id);
    const update = { ...target, isComplete: !target.isComplete };
    updateTodo(update).then(({ data }) => {
      const todos = this.state.todos.map((i) => (i.id === data.id ? data : i));
      this.setState({
        todos,
      });
    });
  }

  render() {
    const remaining = this.state.todos.filter((d) => !d.isComplete);
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error && <span className="error">OH!NO!</span>}
            <TodoForm
              currentTodo={this.state.currentTodo}
              handleNewTodoChange={this.handleNewTodoChange}
              handleTodoSubmit={this.handleTodoSubmit}
            />
          </header>
          <section className="main">
            <Route
              path="/:filter?"
              render={({ match }) => (
                <TodoList
                  todos={filterTodos(match.params.filter, this.state.todos)}
                  handleDelete={this.handleDelete}
                  handleUpdate={this.handleUpdate}
                />
              )}
            />
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    );
  }
}
