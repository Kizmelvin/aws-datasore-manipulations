import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Post } from "../models";
import { DataStore } from "@aws-amplify/datastore";
import { IoCloseOutline } from "react-icons/io5";

const editPostState = { title: "", body: "" };

function UpdatePost({ post: { id }, setShowEditModel }) {
  const [updatePost, setUpdatePost] = useState(editPostState);

  const handleChange = (e) => {
    setUpdatePost({ ...updatePost, [e.target.name]: e.target.value });
  };

  async function editPost(e, id) {
    e.preventDefault();
    const original = await DataStore.query(Post, `${id}`);
    if (!updatePost.title && !updatePost.body) return;
    await DataStore.save(
      Post.copyOf(original, (updated) => {
        updated.title = `${updatePost.title}`;
        updated.body = `${updatePost.body}`;
      })
    );
    setUpdatePost(editPostState);
    setShowEditModel(false);
  }

  return (
    <div className="container">
      <Form
        className="mt-5 border border-secondary p-3"
        onSubmit={(e) => editPost(e, id)}
      >
        <h1
          className="d-md-flex justify-content-md-end"
          onClick={() => setShowEditModel(false)}
        >
          <IoCloseOutline />
        </h1>

        <Form.Group className="mt-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Enter title"
            className="fs-3"
            value={updatePost.title}
            onChange={handleChange}
            name="title"
          />
        </Form.Group>
        <Form.Group className="mb-3 " controlId="exampleForm.ControlTextarea1">
          <Form.Control
            size="lg"
            as="textarea"
            required
            name="body"
            className="fs-4"
            onChange={handleChange}
            value={updatePost.body}
            placeholder="Write post"
          />
        </Form.Group>
        <div>
          <Button variant="primary" type="submit">
            Update Post
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdatePost;
