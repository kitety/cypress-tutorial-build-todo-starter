import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";
import { saveTodo } from "../lib/service";
export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: "",
      todos: [],
    };
    this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this);
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

  render() {
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
            <TodoList todos={this.state.todos} />
          </section>
          <Footer />
        </div>
      </Router>
    );
  }
}
