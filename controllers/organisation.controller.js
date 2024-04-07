const db = require("../models");
const Organisation = db.organisation;
const { Op } = require("sequelize");
const pagination = require("../helper/pagination");
const {Base64toId, idIntoBase64} =require('../helper/idIntoBase64')

const addorganisation = async (req, res) => {
  try {
    const { Code, Name, PublicSector } = req.body;
    const userId = req.userId;
    await Organisation.create({
      Code: Code,
      Name: Name,
      PublicSector: PublicSector,
      ModifiedOn: new Date(),
      ModifiedBy: userId,
    });
    return res
      .status(200)
      .send({ status: true, message: "Add organisation Successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getAllOrganisationData = async (req, res) => {
  const data = [];
  const resultData = await Organisation.findAll({
    where: {
      Deleted: "0",
    },
    attributes: ["OrganisationID", "Code", "Name", "PublicSector"],
  });

  for (let i = 0; i < resultData.length; i++) {
    const encryptId = await idIntoBase64(resultData[i].OrganisationID)
    data.push({
      id: encryptId,
      Code: resultData[i].Code,
      Name: resultData[i].Name,
      PublicSector: resultData[i].PublicSector,
    });
  }

  const page = parseInt(req.query.page) || 0;
  const limit = req.query.limit || 10;
  const startIndex = page * limit;
  const endIndex = (page + 1) * limit;
  const result = {};
  result.dataItems = data.slice(startIndex, endIndex);
  result.totalItems = data.length;
  result.totalPage = Math.ceil(data.length / limit);
  result.currentPage = page;

  if (result.dataItems.length == 0) {
    return res
      .status(200)
      .send({ status: true, message: "Data not found", data: result });
  }

  return res
    .status(200)
    .send({ status: true, message: "Data found", data: result });
};
const getByIdOrganisationData = async (req, res, next) => {
  try {
    const { OrganisationID } = req.params;
    const actualID= await Base64toId(OrganisationID)
    const foundOrganisation = await Organisation.findByPk(actualID, {
      attributes: ["Code", "Name", "PublicSector"],
    });

    if (!foundOrganisation) {
      return res.status(404).send({  
        status: false,
        message: `Data ${actualID} not found`,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Data found Successfully",
      data: foundOrganisation,
    });
  } catch (error) {
    next(error);
  }
};
const updateOrganisationData = async (req, res, next) => {
  try {
    const { OrganisationID } = req.params;
    const actualID =await Base64toId(OrganisationID)
    const { Code, Name, PublicSector } = req.body;

    const foundOrganisation = await Organisation.findByPk(actualID);

    if (!foundOrganisation) {
      return res.status(404).send({
        status: "error",
        message: `Organization with ID ${actualID} not found`,
      });
    }

    await Organisation.update(
      { Code, Name, PublicSector },
      { where: { OrganisationID:actualID } }
    );

    return res.status(200).send({
      status: true,
      message: `Organization updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};
const deleteOrganisation = async (req, res) => {
  try {
    const { OrganisationID } = req.params;
    const actualID = await Base64toId(OrganisationID)
    await Organisation.update(
      {
        Deleted: "1",
      },
      {
        where: {
          OrganisationID: actualID,
        },
      }
    );

    return res
      .status(200)
      .send({ status: true, message: "Organisation deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const SearchOrganisation = async (req, res) => {
  try {
    const { key } = req.params;
    const data = await Organisation.findAll({
      attributes: [["OrganisationID", "id"], "Code", "Name", "PublicSector"],
      where: {
        [Op.or]: [
          { Code: { [Op.like]: `%${key}%` } },
          { Name: { [Op.like]: `%${key}%` } },
        ],
      },
    });

    return res.status(200).send({ status: true, data });
  } catch (error) {
    return res.status(500).send({ status: false, messasge: error.message });
  }
};

const getOrganisationBySectorId = async (req, res) => {
  try {
         const sectorId = req.query.sectorId;
console.log("sectorId",sectorId);
  const actualID = await Base64toId(sectorId)
  console.log("ajfaskdfhkjasdhf",actualID)
   const data =[]
  const resultData = await Organisation.findAll(
      {
        where: {
          Deleted: "0",
          PublicSector: actualID,
        },
        attributes: ["OrganisationID", "Code", "Name", "PublicSector"],
      },
      
    );
    for (let i = 0; i < resultData.length; i++) {
      const encryptId = await idIntoBase64(resultData[i].OrganisationID)
      data.push({
        id: encryptId,
        Code: resultData[i].Code,
        Name: resultData[i].Name,
        PublicSector: resultData[i].PublicSector,
      });
    }
    const page = parseInt(req.query.page) || 0;
    const limit = req.query.limit || 10;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const result = {};
    // console.log("sssssss",result);
    result.dataItems = data.slice(startIndex, endIndex);
    result.totalItems = data.length;
    result.totalPage = Math.ceil(data.length / limit);
    result.currentPage = page;

    return res.status(200).send({
      status: true,
      message: "Data found Successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, messasge: error.message });
  }
};

const getAllOrganisationCode = async (req, res) => {
  
  const resultData = await Organisation.findAll({ 
    attributes: [ ["Code","Organization"]],
  });

  return res
    .status(200)
    .send({ status: true, message: "Data found", data: resultData });
};

const getAllOrganisationIdName = async (req, res) => {
  
  const resultData = await Organisation.findAll({ 
    attributes: ["OrganisationID","Code"],
  });

  return res
    .status(200)
    .send({ status: true, message: "Data found", data: resultData });
};

module.exports = {
  addorganisation,
  getAllOrganisationData,
  getByIdOrganisationData,
  updateOrganisationData,
  deleteOrganisation,
  SearchOrganisation,
  getOrganisationBySectorId,
  getAllOrganisationCode,
  getAllOrganisationIdName
};
