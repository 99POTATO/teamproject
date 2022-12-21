//page 연결이 쉬워지도록
//
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./../db.js");
//notice=====================================
router.get("/", (req, res) => {
    res.render("main");
});
// router.get("/notice_list", (req, res) => {
//     db.getNotice((rows) => {
//         res.render("notice_list", { rows: rows }); //ejs의 rows를 받아서 rows라는 이름으로 보낸다
//     });
// });
router.get("/notice_list", (req, res) => {
    db.getNotice((rows1, rows2) => {
        console.log(rows1);
        res.render("notice_list", { rows1: rows1, rows2: rows2 }); //ejs의 rows를 받아서 rows라는 이름으로 보낸다
    });
});
router.get("/notice_write", (req, res) => {
    res.render("notice_write");
});
router.post("/w_notice", (req, res) => {
    let param = JSON.parse(JSON.stringify(req.body));
    let title = param["title"];
    let writer = param["writer"];
    let category = param["category"];
    let password = param["password"];
    let content = param["content"];

    db.writeNotice(title, writer, category, password, content, () => {
        res.redirect("/notice_list");
    });
});
router.get("/notice_detail", (req, res) => {
    let id = req.query.id;
    db.getNoticeByid(id, (row) => {
        res.render("notice_content", { row: row[0] }); //테이블의 한 행만 보내줄거기 때문에
    });
});

//notice====2222222=====================================

router.get("/notice_write_event", (req, res) => {
    res.render("notice_write_event");
});
router.post("/w_notice_event", (req, res) => {
    let param = JSON.parse(JSON.stringify(req.body));
    let title = param["title"];
    let writer = param["writer"];
    let category = param["category"];
    let password = param["password"];
    let content = param["content"];

    db.writeNotice_event(title, writer, category, password, content, () => {
        res.redirect("/notice_write_event");
    });
});
//==============modify button==================================================
router.get("/modifyNotice", (req, res) => {
    let id = req.query.id;
    db.modify_N(id, (row) => {
        res.render("notice_modify", { row: row[0] });
    });
});
// 업데이트 된 내용 내보내기=================================================
router.post("/m_notice", (req, res) => {
    let param = JSON.parse(JSON.stringify(req.body));
    let id = req.query.id;
    let title = param["title"];
    let writer = param["writer"];
    let category = param["category"];
    let password = param["password"];
    let content = param["content"];
    db.updateNotice(id, title, writer, category, password, content, () => {
        res.redirect("/notice_list");
    });
});
//===============================아이디가 일치하면 삭제하기
router.get("/deleteNotice", (req, res) => {
    let id = req.query.id;
    db.deleteNotice(id, () => {
        res.redirect("/notice_list");
    });
});
//==============================================
router.get("/committee", (req, res) => {
    res.render("committee");
});
router.get("/festival", (req, res) => {
    res.render("festival");
});
router.get("/event", (req, res) => {
    res.render("event");
});

router.get("/gallery", (req, res) => {
    res.render("gallery");
});
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/loginCheck", (req, res) => {
    let param = JSON.parse(JSON.stringify(req.body));
    let id = param["id"];
    let pw = param["pw"];
    db.loginCheck(id, pw, (results) => {
        if (results.length > 0) {
            res.redirect("/");
        } else {
            res.send(`<script>alert('로그인정보가 일치하지 않습니다'); document.location.href="/login";</script>`);
        }
    });
});
router.get("/join", (req, res) => {
    db.getJointable((ids) => {
        res.render("join", { ids: ids });
    });
});
router.post("/joininfo", (req, res) => {
    let param = JSON.parse(JSON.stringify(req.body));
    let id = param["id"];
    let pw = param["pw"];
    let name = param["name"];
    let birth = param["birth"];
    let email = param["email"];
    db.insertIntoJoinTable(id, pw, name, birth, email, () => {
        res.redirect("/login");
    });
});
router.get("/test", (req, res) => {
    res.render("test");
});

module.exports = router;
