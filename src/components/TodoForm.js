import React from "react";

export default (props) => (
  <form onSubmit={props.handleTodoSubmit}>
    <input
      autoFocus
      value={props.currentTodo}
      onChange={props.handleNewTodoChange}
      type="text"
      className="new-todo"
      placeholder="What needs to be done?"
    />
  </form>
);
