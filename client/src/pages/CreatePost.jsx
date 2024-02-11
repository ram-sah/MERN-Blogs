import React from "react";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const CreatePost = () => {
  return (
    <div className="min-h-screen mx-auto p-4 max-w-2xl ">
      <h1 className="text-center my-5 font-semibold text-3xl ">
        Create a post{" "}
      </h1>
      <form className="flex flex-col gap-5 ">
        <div className="flex gap-5 flex-col sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized"> Select a category</option>
            <option value="NodeJs"> Nodejs</option>
            <option value="ReactJs"> ReactJs</option>
            <option value="JavaScript"> JavaScript</option>
            <option value="ExpressJs"> ExpressJs</option>
          </Select>
        </div>
        <div className="flex gap-5 border-2 border-solid rounded border-violet-400 p-4 items-center justify-between">
          <FileInput typeof="file" accept="image/*" />
          <Button type="button" gradientDuoTone="purpleToBlue" size="sm">
            {" "}
            Upload image{" "}
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-64 mb-12"
          required
        />
        <Button type="button" gradientDuoTone="purpleToBlue" outline>
          Publish
        </Button>
      </form>
    </div>
  );
};
