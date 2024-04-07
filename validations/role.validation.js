const db = require("../models");
const User = db.user;
const Roles = db.role;

const addRole = async (req, res, next) => {
  try {
    const {Role, isActive } = req.body;
    if (!Role) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter role" });
    }
    if (isActive) {
      if (isActive != "0" && isActive != "1") {
        return res
          .status(400)
          .send({ status: false, message: "Please enter valid status" });
      }
    }
    const isRoleExist = await Roles.findOne({
      where: {
        Role: Role,
      },
    });
    if (isRoleExist) {
      return res
        .status(400)
        .send({ status: false, message: "Role already exist" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  addRole,
};
