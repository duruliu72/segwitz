const express = require('express');
const router=express.Router();
const _ = require('lodash');
const {validate } = require("../models/sale");
const {getCon} = require("../dbCon");
router.get('/',(req, res) => {
    getCon().query("SELECT id,userName,amount,date FROM sales ORDER BY id DESC",(err, sales)=>{
        if (err) throw err;
        res.send(sales);
    });
});
router.post("/", (req, res) => {
    let date=req.body.date?req.body.date:new Date();
    const { error } = validate({...req.body,date});
    if (error) return res.status(400).send(error.details[0].message);
    let userName = req.body.userName;
    let amount = req.body.amount;
    var sql = "INSERT INTO sales (userName,amount,date) VALUES (?,?,?)";
    getCon().query(sql,[userName,amount,date],function(err, result){
        if (err) throw err;
        getCon().query("SELECT * FROM sales WHERE id=?",[result.insertId], function (err, sales, fields) {
            if (err) throw err;
            return res.send(sales[0]);
        });
    })
})  
router.get("/:fillter", (req, res) => {
    let fillterType=req.params.fillter;
    if(fillterType==="daily"){
        let currentDate=req.body.date?req.body.date:new Date();
        var sql = `SELECT date,SUM(amount) AS amount,HOUR(date)+1 AS hour FROM sales WHERE date(date)=date(?) GROUP BY YEAR(date),month(date),day(date), HOUR(date)`;
        getCon().query(sql,[currentDate],function(err, result){
            if (err) throw err;
            return res.send(result);
        })
    }
    if(fillterType==="weekly"){
        getCon().query("select WEEK(NOW()) AS weekno",function(err, weeks){
            if (err) throw err;
            let weeknumber=req.body.weeknumber?req.body.weeknumber:weeks[0].weekno;
            var sql = `SELECT date,SUM(amount) AS amount FROM sales
            WHERE date(date)>=date(DATE_ADD(NOW(), INTERVAL +((6-WEEKDAY(NOW()))+(?-1)*7)-6 DAY)) && date(date)<=date(DATE_ADD(NOW(), INTERVAL +((6-WEEKDAY(NOW()))+(?-1)*7) DAY)) GROUP BY date(date)`;
            getCon().query(sql,[weeknumber,weeknumber],function(err, result){
                if (err) throw err;
                return res.send(result);
            })
        })
    }
    if(fillterType==="monthly"){
        var sql = `SELECT date,SUM(amount) AS amount FROM sales
        WHERE date(date)>=date(DATE_ADD(LAST_DAY(NOW()), INTERVAL -DAYOFMONTH(LAST_DAY(NOW()))+1 DAY))&& date(date)<=date(LAST_DAY(NOW())) GROUP BY date(date)`;
        getCon().query(sql,function(err, result){
            if (err) throw err;
            return res.send(result);
        })
    }
})
module.exports = router;