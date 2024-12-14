const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
  fs.promises.readFile(myWay("pages", "index.html"), "utf-8").then((data) => {
    res.status(200).send(data);
  });
});

app.get("/users", (req, res) => {
  fs.promises.readFile(myWay("pages", "users.json"), "utf-8").then((data) => {
    let users = JSON.parse(data);

    if (!req.query.name && !req.query.sort) {
      res.status(200).json(users);
    } else if (req.query.name) {
      let resArr = users.filter((user) =>
        user.name
          .toLocaleLowerCase()
          .includes(req.query.name.toLocaleLowerCase())
      );
      res.status(200).json(resArr);
    } else if (req.query.sort) {
      let resArr = users.sort((a, b) => {
        if (req.query.sort === "max") return a.id - b.id;
        else if (req.query.sort === "min") return b.id - a.id;
      });
      res.status(200).json(resArr);
    } else {
      fs.promises
        .readFile(myWay("pages", "error.html"), "utf-8")
        .then((data) => {
          res.status(404).send(data);
        });
    }
  });
});

app.get("/users/:id", (req, res) => {
  fs.promises.readFile(myWay("pages", "users.json")).then((data) => {
    let users = JSON.parse(data);
    let user = users.find((user) => {
      return user.id === +req.params.id;
    });
    if (user) {
      res.status(200).json(user);
    } else {
      fs.promises
        .readFile(myWay("pages", "error.html"), "utf-8")
        .then((data) => {
          res.status(404).send(data);
        });
    }
  });
});

app.listen(3000, (err) => console.log("server is running on port 3000"));

function myWay(...args) {
  return path.join(__dirname, args.join(",").replaceAll(",", "/"));
}
