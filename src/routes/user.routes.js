const { httpCreateUser } = require("../controllers/user.controller")

const router = require("express").Router()

router.route("/").post(httpCreateUser)

module.exports = router