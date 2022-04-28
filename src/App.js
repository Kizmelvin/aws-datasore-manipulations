import React, { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Post } from "./models";
import { Form, Button, Card } from "react-bootstrap";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import "./App.css";
import UpdateData from "./Components/UpdateData";

const initialState = { title: "", body: "" };

const App = () => {
  const [formData, setFormData] = useState(initialState);
  const [posts, setPost] = useState([]);
  const [showEditModel, setShowEditModel] = useState(false);
  const [postToEdit, setPostToEdit] = useState({});

  useEffect(() => {
    getPost();
    const subs = DataStore.observe(Post).subscribe(() => getPost());
    return () => subs.unsubscribe();
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function getPost() {
    const post = await DataStore.query(Post);
    setPost(post);
  }

  async function createPost(e) {
    e.preventDefault();
    if (!formData.title) return;
    await DataStore.save(new Post({ ...formData }));
    setFormData(initialState);
  }

  async function deletePost(id) {
    const auth = window.prompt(
      "Are sure you want to delete this post? : Type yes to proceed"
    );
    if (auth !== "yes") return;
    const post = await DataStore.query(Post, `${id}`);
    DataStore.delete(post);
  }

  return (
    <>
      <div className="container-md">
        <Form className="mt-5" onSubmit={(e) => createPost(e)}>
          <h1 className="text-center">AWS Datastore Real-time Manipulations</h1>
          <Form.Group className="mt-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={formData.title}
              className="fs-2"
              onChange={handleChange}
              name="title"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control
              size="lg"
              as="textarea"
              rows={3}
              required
              className="fs-5"
              name="body"
              onChange={handleChange}
              value={formData.body}
              placeholder="Write post"
            />
          </Form.Group>
          <div className="d-md-flex justify-content-md-end">
            <Button variant="primary" type="submit">
              Create Post
            </Button>
          </div>
        </Form>
        <div>
          {posts.map((post) => (
            <Card key={post.id} className="mt-5 mb-5 p-2">
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Body>
                <Card.Title className="fs-1 text-center">
                  {post.title}
                </Card.Title>
                <Card.Text className="fs-4 text-justify">{post.body}</Card.Text>
                {/* <Button variant="primary">Go somewhere</Button> */}
              </Card.Body>
              <div className="d-md-flex justify-content-md-end fs-2 p-3 ">
                {/* <h3>{post.id}</h3> */}
                <h1
                  onClick={() => {
                    setPostToEdit(post);
                    setShowEditModel(true);
                  }}
                >
                  <IoCreateOutline style={{ cursor: "pointer" }} />
                </h1>

                <h1 onClick={() => deletePost(post.id)}>
                  <IoTrashOutline style={{ cursor: "pointer" }} />
                </h1>
              </div>
            </Card>
          ))}
          {showEditModel && (
            <UpdateData
              post={postToEdit}
              handleChange={handleChange}
              setShowEditModel={setShowEditModel}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
