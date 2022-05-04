import React, { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Post } from "./models";
import { Form, Button, Card } from "react-bootstrap";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import "./App.css";
import UpdatePost from "./Components/UpdatePost";

const initialState = { title: "", body: "" };

const App = () => {
  const [formData, setFormData] = useState(initialState);
  const [posts, setPost] = useState([]);
  const [showEditModel, setShowEditModel] = useState(false);
  const [postToEdit, setPostToEdit] = useState({});
  //useEffect function here
  useEffect(() => {
    getPost();
    const subs = DataStore.observe(Post).subscribe(() => getPost());
    return () => subs.unsubscribe();
  });
  //handleChange function here
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //getPost function here
  async function getPost() {
    const post = await DataStore.query(Post);
    setPost(post);
  }
  //createPost function here
  async function createPost(e) {
    e.preventDefault();
    if (!formData.title) return;
    await DataStore.save(new Post({ ...formData }));
    setFormData(initialState);
  }
  //deletePost function here
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
        {/* Form Inputs here */}
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
              <Card.Body>
                <Card.Title className="fs-1 text-center">
                  {post.title}
                </Card.Title>
                <Card.Text className="fs-4 text-justify">{post.body}</Card.Text>
              </Card.Body>
              <div className="d-md-flex justify-content-md-end fs-2 p-3 ">
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
            <UpdatePost post={postToEdit} setShowEditModel={setShowEditModel} />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
