"use strict";
const md5  = require('md5');
// const bcrypt = require('bcrypt');
// const salt = 10;
// const { CLIENT_NO_SCHEMA } = require("mysql/lib/protocol/constants/client");
const response = require("./../response");
const db = require("./../settings/db");

exports.getAllUsers = (req, res) => {
  db.query(
    "SELECT `id`, `name`, `surname`, `patronymic`, `email`, `login` FROM `users`",
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.signup = (req, res) => {
  db.query("SELECT `id`, `name`, `login` FROM `users` WHERE `login` = '" + req.body.login +"'", (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } 
      else if (typeof rows !== "undefined" && rows.length > 0) {
        const row = JSON.parse(JSON.stringify(rows));
        row.map((rw) => {response.status(306,{message: `Пользователь с там login - ${rw.login} уже существует. Придумайте новый login.`},res);
          return true;
        });
        row.map((rw) => {response.status(306,{message: `Эта почта - ${rw.email} уже используется. Укажите другую почту.`},res);
          return true;
        });
      }
      // else if (rows !== "undefined" && rows.length > 0) {
      //   const row = JSON.parse(JSON.stringify(rows));
      //   row.map((rw) => {response.status(306,{message: `Эта почта - ${rw.email} уже используется. Укажите другую почту.`},res);
      //     return true;
      //   });
      // }
      else {
        const email = req.body.email;
        const name = req.body.name;
        const surname = req.body.surname;
        const patronymic = req.body.patronymic !== "" ? req.body.surname : "He указано";

        const password = md5(req.body.password) ;
        
        const password_repeat = req.body.password_repeat;

        

        const login = req.body.login;

      

        const sql =
          "INSERT INTO `users`(`name`, `surname`, `patronymic`, `email`, `password`, `password_repeat`, `login`) VALUES('" + name + "','" + surname + "','" + patronymic + "','" + email + "','" + password + "','" + password_repeat + "','" + login + "')";
        db.query(sql, (error, result) => {
          if (error) {
            response.status(400, error, res)
          } 
          else if(email == ""){
            response.status(400, {message: `Укажите email`}, res)
          }
          else if(name == ""){
            response.status(400, {message: `Укажите имя`}, res)
          }
          else if(surname == ""){
            response.status(400, {message: `Укажите фамилию`}, res)
          }
          else if(login == ""){
            response.status(400, {message: `Укажите login`}, res)
          }
          else {
            response.status(200, {message: `Регистрация прошла успешно`, result}, res);
          }
        });
      }
    }
  );
}

exports.signin = (req, res) => {
    db.query("SELECT `id`, `login`,`password` FROM `users` WHERE `login` = '" + req.body.login + "'", (error, rows, fields) => {
        if(error){
            response.status(400, error, res)
        }
        else if(rows.length <= 0){
            response.status(401, {message: `Пользователь с login - ${req.body.login} не найден. Пройдите регистрацию`}, res)
        }
        else{
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                response.status(200, {id: rw.id, login: rw.login, password: rw.password}, res)
                return true
            })
            
        }
    })
}
