const sql = require("../config/db.js")
const dbConn = require("../config/db")
// const moment=require('moment')
const User = function (user) {
    this.id = user.id;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.mobile = user.mobile;
    this.gender = user.gender;
    this.date1 = user.date1;
    this.address = user.address;
    this.city = user.city;
    this.pin = user.pin;
    this.state = user.state;
    this.qualification = user.qualification;
    this.specialization = user.specialization;
    this.password = user.password;
    this.user_image = user.user_image ? user.user_image : "";
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error : ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertID, ...newUser });
    });
};

User.findById = (req, id, result) => {
    sql.query(`SELECT * FROM user WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        };

        result(null, res)
        return;

    });
};
User.getAll = function (req, count, result) {
    const start = req.body.current_page > 0 ? req.body.record_per_page * (req.body.current_page - 1) : 0;
    var sql = "SELECT u.* FROM user AS u WHERE u.id!=0 {{where}} ORDER BY {{sort}}";

    var where = ' {{search_text}}';

    var search_text = '';
    if (req.body.search_text) {
        search_text = ` AND (firstname LIKE '%${req.body.search_text}%' OR lastname LIKE '%${req.body.search_text}%' OR email LIKE '%${req.body.search_text}%')`;
    }
    where = where.replace("{{search_text}}", search_text);

    var sort = 'firstname';
    if (req.body.sort) {
        sort = req.body.sort + " " + (req.body.sort_direction ? req.body.sort_direction : "");
    }
    sql = sql.replace('{{sort}}', sort);

    if (!count) {
        sql = sql.replace("{{where}}", where);
        sql = sql + " LIMIT ?,?";
    } else {
        sql = sql.replace("{{where}}", "");
    }
    dbConn.query(sql, [start, +req.body.record_per_page], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
        // console.log('User.findAll', this.sql);
    });
    if (req.body.search_text) {
        let query = "SELECT * FROM user WHERE 1=1 ";

        query += ` AND (firstname LIKE '%${req.body.search_text}%' OR lastname LIKE '%${req.body.search_text}%' OR email
             LIKE '%${req.body.search_text}%')`;
        // console.log("query", query);
    }

};
// User.getAll = (req, result) => {
//     let query = "SELECT * FROM user WHERE 1=1 ";
//     if (req.body.search_text) {
//         query += ` AND (firstname LIKE '%${req.body.search_text}%' OR lastname LIKE '%${req.body.search_text}%' OR email
//          LIKE '%${req.body.search_text}%')`;
//     }

//     sql.query(query, (err, res) => {
//         if (err) {
//             console.log("Error : ", err);
//             result(null, err);
//             return;
//         }
//         result(null, res);
//     });
// };

User.delete = function (id, is_hard, result) {


    var query = "DELETE FROM user WHERE id = ?";

    dbConn.query(query, [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

User.update = (id, item, result) => {
    // item=req.body;
    sql.query(
        "UPDATE user SET firstname=?, lastname=?, email=?, mobile=?, gender=?, date1=?, address=?, city=? , pin=?, state=?, qualification=?, specialization=?, password=?, user_image=? WHERE id = ?",
        [item.firstname, item.lastname, item.email, item.mobile, item.gender, item.date1, item.address, item.city, item.pin, item.state, item.qualification, item.specialization, item.password, item.user_image, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found User with the id
                result({ kind: "not_found" }, null);
                return;
            }

            result(null, { id: res.insertID, ...item });
        }
    );
};

module.exports = User;
