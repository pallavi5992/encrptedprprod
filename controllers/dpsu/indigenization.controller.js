const db = require("../../models");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const Indigenization = db.indigenization;

const indigenizationData = async (req, res) => {
  try {
    const {
      OrganisationID,
      Component,
      TypePlatform,
      ValueInCr,
      StartDate,
      EndDate,
      Financial,
      Pysical,
      Remarks,
    } = req.body;
    const token = req.headers["x-access-token"];
    const actualToken=await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;

    await Indigenization.create({
      OrganisationID: OrganisationID,
      Component:Component,
      TypePlatform:TypePlatform,
      ValueInCr:ValueInCr,
      StartDate:StartDate,
      EndDate:EndDate,
      Financial:Financial,
      Pysical:Pysical,
      Remarks:Remarks,
      Deleted: "1",
      ModifiedBy: userId,
    });

    return res.status(200).send({
      status: true,
      message: "Indigenization Added Successfully",
    });
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
};
const getAllIndigenizationData = async (req, res) => {
  try {
    const indigenData=[]
    const getAllData = await Indigenization.findAll({
      where: {
        Deleted: "1",
      },    
      order: [
        ["IndigenizationID", "DESC"], // Sorts by COLUMN in ascending order
      ],
      attributes: [
        "IndigenizationID",
        "OrganisationID",
        "Component",
        "TypePlatform",
        "ValueInCr",
        "StartDate",
        "EndDate",
        "Financial",
        "Pysical",
        "Remarks",
        "Deleted",
      ],
    });
    for (let i = 0; i < getAllData.length; i++) {
      if (getAllData[i].IndigenizationID != req.IndigenizationID) {
        indigenData.push({
          IndigenizationID: getAllData[i].IndigenizationID,
          OrganisationID: getAllData[i].OrganisationID,
          Component:getAllData[i].Component,
          TypePlatform: getAllData[i].TypePlatform,
          ValueInCr: getAllData[i].ValueInCr,
          StartDate: getAllData[i].StartDate,
          EndDate: getAllData[i].EndDate,
          Financial: getAllData[i].Financial,
          Pysical: getAllData[i].Pysical,
          Remarks: getAllData[i].Remarks || "",
          Deleted: getAllData[i].Deleted,
          // FYear:   getAllData[i].YearID
          //   ? await helper.getFYear(getAllData[i].YearID)
          //   : "",
          OrganisationName: getAllData[i].OrganisationID
            ? await helper.organName(getAllData[i].OrganisationID)
            : "",
        });
      }
    }

    const page = parseInt(req.query.page) || 0;
    const limit = req.query.limit || 10;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    const result = {};
    result.dataItems = indigenData.slice(startIndex, endIndex);
    result.totalItems = indigenData.length;
    result.totalPage = Math.ceil(indigenData.length / limit);
    result.currentPage = page;
    
    if (result.dataItems.length == 0) {
        return res
          .status(200)
          .send({ status: false, message: "Data not found", data: result });
    }
    

    return res.status(200).json({
      status: true,
      message: "List of Indigenization data",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// const orderBookPositionDataById = async (req, res) => {
//   try {
//     const { OrderBookID } = req.params;
//     if (!OrderBookID) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Please enter OrderBookID" });
//     }
//     const OderBookExsist = await orderBook.findOne({
//       where: {
//         OrderBookID: OrderBookID,
//       },
//       include: [
//         {
//           model: Organisation,
//           required: true,
//           attributes: ["OrganisationID", "Name"],
//           as: "OrgNam",
//         },
//       ],
//       attributes: [
//         "OrderBookID",
//         "OrganisationID",
//         "NoOfOrderBookFrom",
//         "NoOfOrderBookTo",
//         "SelectedMonth",
//         ["SelectedMonth", "formattedSelectedMonth"],
//         "Remarks",
//       ],
//     });

//     if (!OderBookExsist) {
//       return res.status(404).send({
//         status: false,
//         message: `Data ${OrderBookID} not found`,
//       });
//     }
//     return res.status(200).send({
//       status: true,
//       message: "Data found Successfully",
//       data: OderBookExsist,
//     });
//   } catch (error) {
//     res.status(500).send({ status: false, message: error.message });
//   }
// };

// const updateOrderBookPositionDataById = async (req, res) => {
//   try {
//     const token = req.headers["x-access-token"];
//     const decodeToken = jwt.decode(token);
//     const userId = decodeToken.id;
//     const { OrderBookID } = req.params;
//     const { OrganisationID, NoOfOrderBookFrom, NoOfOrderBookTo,SelectedMonth, Remarks } = req.body;
//     if (!OrderBookID) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Please enter OrderBookID" });
//     }
//     const orderBookExsist = await orderBook.findOne({
//       where: {
//         OrderBookID: OrderBookID,
//       },
//     });
//     if (!orderBookExsist) {
//       return res.status(404).send({
//         status: false,
//         message: `Data ${OrderBookID} not found`,
//       });
//     }

//     await orderBook.update(
//       { OrganisationID,NoOfOrderBookFrom, NoOfOrderBookTo,SelectedMonth, Remarks, ModifiedBy: userId },
//       { where: { OrderBookID } }
//     );

//     return res.status(200).send({
//       status: true,
//       message: `Order book updated successfully`,
//     });
//   } catch (error) {
//     res.status(500).send({ status: false, message: error.message });
//   }
// };

// const deleteOrderBookById = async (req,res)=>{
//     try {
//         const { OrderBookID } = req.params;
//         // if (!OrderBookID) {
//         //     return res
//         //       .status(400)
//         //       .send({ status: false, message: "Please enter OrderBookID" });
//         //   }
//         //   const orderBookExsist = await orderBook.findOne({
//         //     where: {
//         //       OrderBookID: OrderBookID,
//         //     },
//         //   });

//         //   console.log(orderBookExsist,"orderBookExsistorderBookExsist")
//         //   if (!orderBookExsist) {
//         //     return res.status(404).send({
//         //       status: false,
//         //       message: `Data ${OrderBookID} not found`,
//         //     });
//         //   }
//         //   await orderBook.update(
//         //     { Deleted: "0"},
//         //     { where: { OrderBookID:OrderBookID } }
//         //   );
//         await orderBook.update(
//             {
//               Deleted: "0",
//             },
//             {
//               where: {
//                 OrderBookID: OrderBookID,
//               },
//             }
//           );
//           return res
//           .status(200)
//           .send({ status: true, message: "Order Book deleted successfully" });
//     } catch (error) {
//         res.status(500).send({ status: false, message: error.message });
//     }
// }

const pieChartIndigenization = async (req, res) => {
  try {
    const indigenizationData = [];
    const totalOrgCount = await Indigenization.count({
      where: { Deleted: "1" },
    });
    let totalAmount = await Indigenization.sum('ValueInCr',{
    where: { Deleted: "1" },
    });  
    const indigenData = await Indigenization.findAll({
      attributes: [
        "IndigenizationID",
        "OrganisationID",
        "Component",
        "TypePlatform",
        "ValueInCr",
        "StartDate",
        "EndDate",
        "Financial",
        "Pysical",
        "Remarks",
        "Deleted",
        [sequelize.fn("COUNT", sequelize.col("OrganisationID")), "countOrganisation"],   
        [sequelize.fn("SUM", sequelize.col("ValueInCr")), "sumOfAmnt"],
        [sequelize.fn("AVG", sequelize.col("ValueInCr")), "avgOfAmnt"],
      ],
      group: ["OrganisationID"], 
      where: { Deleted: "1" },   
    });
    for (let i = 0; i < indigenData.length; i++) {
      if (indigenData[i].IndigenizationID != req.IndigenizationID) {
        
        const organisationName = indigenData[i].OrganisationID
          ? await helper.organName(indigenData[i].OrganisationID)
          : "";
          indigenizationData.push({
          IndigenizationID: indigenData[i].IndigenizationID,
          OrganisationID: indigenData[i].OrganisationID,
          Component: indigenData[i].Component,
          TypePlatform: indigenData[i].TypePlatform,
          ValueInCr: indigenData[i].ValueInCr,
          StartDate:indigenData[i].StartDate,
          EndDate:indigenData[i].EndDate,
          Financial:indigenData[i].Financial,
          Pysical:indigenData[i].Pysical,
          Remarks: indigenData[i].Remarks || "",
          Deleted: indigenData[i].Deleted,
          countOrganisation: indigenData[i].dataValues.countOrganisation,
          sumOfAmnt:indigenData[i].dataValues.sumOfAmnt,
          avgOfAmnt: indigenData[i].dataValues.avgOfAmnt,
          OrganisationName: organisationName
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `Indigenization Percentage Found`,
      data: { totalOrgCount, totalAmount, indigenizationData },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
module.exports = {
    indigenizationData,
    getAllIndigenizationData,
//   orderBookPositionDataById,
//   updateOrderBookPositionDataById,
//   deleteOrderBookById

    pieChartIndigenization
};
