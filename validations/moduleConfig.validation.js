const db = require("../models");
const Module = db.module;
const ModuleConfig = db.moduleConfig;
const addModuleConfig = async (req, res, next) => {
  try {
    const {
      ModuleID,
      DataYearID,
      Target,
      TargetYearID,
      DataRefershFrequency,
      As_On_Date,
    } = req.body;
    if (!ModuleID) {
      return res
        .status(400)
        .send({ status: false, message: "Please select module" });
    } else if (!DataYearID) {
      return res.status(400).send({
        status: false,
        message: "Please select data year!",
      });
    } else if (!Target) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Target!",
      });
    } else if (!TargetYearID) {
      return res.status(400).send({
        status: false,
        message: "Please select Data year!",
      });
    } else if (!DataRefershFrequency) {
      return res.status(400).send({
        status: false,
        message: "Please select data refesh frequency!",
      });
    } else if (!As_On_Date) {
      return res.status(400).send({
        status: false,
        message: "Please select as on date!",
      });
    }

    const moduleIdExist = await Module.findOne({
      where: {
        ModuleID: ModuleID,
      },
    });
    if (!moduleIdExist) {
      return res
        .status(400)
        .send({ status: false, message: "Module not exist" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const upadteModuleConfig = async (req, res, next) => {
    try {
      const {
        configId,
        ModuleID,
        DataYearID,
        Target,
        TargetYearID,
        DataRefershFrequency,
        As_On_Date,
      } = req.body;
      if (!configId) {
        return res
          .status(400)
          .send({ status: false, message: "Please select module" });
      }
      else if (!ModuleID) {
        return res
          .status(400)
          .send({ status: false, message: "Please select module" });
      } else if (!DataYearID) {
        return res.status(400).send({
          status: false,
          message: "Please Enter data year!",
        });
      } else if (!Target) {
        return res.status(400).send({
          status: false,
          message: "Please Enter Target!",
        });
      } else if (!TargetYearID) {
        return res.status(400).send({
          status: false,
          message: "Please select Data year!",
        });
      } else if (!DataRefershFrequency) {
        return res.status(400).send({
          status: false,
          message: "Please select data refesh frequency!",
        });
      } else if (!As_On_Date) {
        return res.status(400).send({
          status: false,
          message: "Please select as on date!",
        });
      }
  
      const configIdExist = await ModuleConfig.findOne({
        where: {
          ConfigID: configId,
        },
      });

      if (!configIdExist) {
        return res
          .status(400)
          .send({ status: false, message: "Module configuration not exist" });
      }

      const moduleIdExist = await Module.findOne({
        where: {
          ModuleID: ModuleID,
        },
      });
      if (!moduleIdExist) {
        return res
          .status(400)
          .send({ status: false, message: "Module not exist" });
      }
  
      next();
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports={
    addModuleConfig,
    upadteModuleConfig
}