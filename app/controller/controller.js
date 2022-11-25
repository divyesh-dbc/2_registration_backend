const User = require("../models/model")
const validator = require("../helper/validate")
const fs = require("fs");

exports.create = (req, res) => {
    req.body.user_image = req.files && req.files.user_image.length ? req.files.user_image[0].filename : "";
    const new_item = new User(req.body);
    const validationRule = {
        // "id": "required|string",
        "firstname": "required|string",
        "lastname": "required|string",
        "email": "required|string",
        "mobile": "required|string",
        "gender": "required|string",
        "date1": "required|string",
        "address": "required|string",
        "city": "required|string",
        "pin": "required|string",
        "state": "required|string",
        "qualification": "required|string",
        "specialization": "required|string",
        "password": "required|string",
        // "photo":"required"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
            res.end();
            return false;
        } else {
            User.create(new_item, function (err, item) {
                if (err) {
                    res.send({ success: false, message: 'error', error: err });
                    return false;
                }

                return res.status(200).json({
                    status: "success",
                    code: 200,
                    message: "Registration success",
                    data: item,
                    totalItems: 0,
                    error: []
                });
            });

        }
    });

};



exports.update = (req, res) => {
    console.log("req.files", req.files);
    req.body.user_image = req.files && req.files.user_image.length ? req.files.user_image[0].filename : "";


    // console.log("req.body", req.body);
    const validationRule = {
        // "id": "required|string",
        "firstname": "required|string",
        "lastname": "required|string",
        "email": "required|string",
        "mobile": "required|string",
        "gender": "required|string",
        "date1": "required|string",
        "address": "required|string",
        "city": "required|string",
        "pin": "required|string",
        "state": "required|string",
        "qualification": "required|string",
        "specialization": "required|string",
        "password": "required|string",
    }

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
            res.end();
            return false;
        } else {

            if (!req.body || !req.params.id) {
                res.status(400).send({
                    message: "Content can not be empty!"
                });
            }
            console.log("req.params.id", req.params.id);

            User.findById(req, req.params.id, function (err, userItem) {
                if (err) {
                    res.status(500).send({
                        status: "error",
                        code: 500,
                        message: "Internal Server Error",
                        data: [],
                        error: err
                    });
                } else {

                    var dir = 'uploads/profile/';
                    // console.log("userItem", userItem);
                    if (userItem[0].user_image) {
                        if (fs.existsSync(dir + userItem[0].user_image)) {
                            fs.unlinkSync(dir + userItem[0].user_image);
                            console.log("Existing file deleted");
                        }
                        
                    }
                   

                    User.update(
                        req.params.id,
                        new User(req.body),
                        (err, data) => {
                            if (err) {
                                if (err.kind === "not_found") {
                                    res.status(404).send({
                                        message: `Not found User with id ${req.params.id}.`
                                    });
                                } else {
                                    res.status(500).send({
                                        message: "Error updating User with id " + req.params.id
                                    });
                                }
                            } else {
                                res.send(data);
                            }

                        }
                    );
                }
            });
        }
    });

};


exports.findAll = (req, res) => {
    req.body.status = req.body.status ? req.body.status : 'active';
    User.getAll(req, 1, function (err, totalRecords) {

        if (totalRecords.length) {
            User.getAll(req, 0, function (err, results) {
                if (err) {
                    return res.status(400).send({
                        status: "error",
                        code: 400,
                        message: "Error",
                        data: [],
                        error: err
                    });
                }

                return res.status(200).json({
                    status: "success",
                    code: 200,
                    message: "SUCCESS",
                    data: results,
                    totalRecords: totalRecords.length,
                    error: []
                });
            });
        } else {
            return res.status(200).json({
                status: "success",
                code: 200,
                message: "SUCCESS",
                data: [],
                totalItems: 0,
                totalRecords: totalRecords.length,
                error: []
            });
        }


    });
    // User.getAll(req, function (err, totalRecords) {
    //     return res.status(200).json({
    //         status: "success",
    //         code: 200,
    //         message: "SUCCESS",
    //         data: totalRecords,
    //         error: []
    //     });
    // });
};

exports.findById = (req, res) => {

    const user_id = +req.params.user_id;

    User.findById(req, user_id, function (err, user) {
        if (err) {
            res.status(500).send({
                status: "error",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {


            return res.status(200).send({
                type: 'user',
                status: "success",
                code: 200,
                message: "USER SUCCESS",
                data: user,
                error: []
            });
        }
    });
};

exports.delete = function (req, res) {
    const user_id = +req.params.user_id;
    if (!user_id) {
        res.status(400).send({
            message: "Id is required!"
        });
    }
    User.findById(req, user_id, function (err, user) {
        if (err) {
            res.send({ success: false, message: 'error', error: err });
            return false;
        }

        User.delete(user_id, req.params.is_hard, function (err) {
            if (err)
                res.send({ success: false, message: 'error', error: err });



            return res.status(200).json({
                status: "success",
                code: 200,
                message: "user_deleted_success",
                data: [],
                totalItems: 0,
                error: []
            });

        });
    });
};
