import React, { useState } from 'react';
import PadomsDataService from '../services/padoms';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const AddPadoms = props => {

  let editing = false;
  let initialTodoTitle = "";
  let initialTodoMemo = "";

  if (props.location.state && props.location.state.currentPadoms) {
    editing = true;
    initialTodoTitle = props.location.state.currentPadoms.title;
    initialTodoMemo = props.location.state.currentPadoms.memo;
  }

  const [title, setTitle] = useState(initialTodoTitle);
  const [memo, setMemo] = useState(initialTodoMemo);
  // keeps track if todo is submitted
  const [submitted, setSubmitted] = useState(false);

  const onChangeTitle = e => {
    const title = e.target.value;
    setTitle(title);
  }

  const onChangeMemo = e => {
    const memo = e.target.value;
    setMemo(memo);
  }

  const savePadoms = () => {
    var data = {
      title: title,
      memo: memo,
      completed: false,
    }

    if (editing) {
      PadomsDataService.updateTodo(
        props.location.state.currentPadoms.id,
        data, props.token)
        .then(response => {
          setSubmitted(true);
          console.log(response.data)
        })
        .catch(e => {
          console.log(e);
        })
    }
    else {
      PadomsDataService.createPadoms(data, props.token)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  return (
    <Container>
      {submitted ? (
        <div>
          <h4>Padoms submitted successfully</h4>
          <Link to={"/todos/"}>
            Back to Padoms
          </Link>
        </div>
      ) : (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{editing ? "Edit" : "Create"} Padoms</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Title"
              value={title}
              onChange={onChangeTitle}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Pārbaudiet siltuma avotu iestatījumus"
              value={memo}
              onChange={onChangeMemo}
            />
          </Form.Group>
          <Button variant="info" onClick={savePadoms}>
            {editing ? "Edit" : "Add"} Padoms
          </Button>
        </Form>
      )}
    </Container>
  )
}

export default AddPadoms;
