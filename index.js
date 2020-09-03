const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const SettingsBill = require("./settings-bill");
const moment = require('moment'); 
moment().format();

const app = express();
const settingsBill = SettingsBill();

app.engine('handlebars', exphbs({
    layoutsDir: './views/layouts'}));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("index", {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        color: settingsBill.colorCode() 

    });
});

app.post("/settings", function (req, res){
    
    settingsBill.setSettings({
      
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });


    res.redirect("/");
})

app.post("/action", function (req, res){
    settingsBill.recordAction(req.body.actionType)
    res.redirect("/");

})

app.get("/actions", function (req, res){

    var actionList = settingsBill.actions() 
    for (let key of actionList){
        key.ago = moment(key.timestamp).fromNow()
        }
    res.render("actions", {actions: actionList});
   
})

app.get("/actions/:actionType", function (req, res){

    var actionList = settingsBill.actionsFor(req.params.actionType) 
    for (let key of actionList){
        key.ago = moment(key.timestamp).fromNow()
    }
    const actionType = req.params.actionType;
    res.render("actions", {actions: settingsBill.actionsFor(actionType) });
})

const PORT = process.env.PORT || 3003;

app.listen(PORT, function(){
    console.log("App started at port:", PORT)
});