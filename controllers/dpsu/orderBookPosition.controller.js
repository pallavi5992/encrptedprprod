const db = require("../../models");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const helper = require("../../helper/helper");
const jwt = require("jsonwebtoken");
const orderBook = db.orderBook;
const Organisation = db.organisation;
const orderBookPositionData = async (req, res) => {
  try {
    const {
      OrganisationID,
      NoOfOrderBookFrom,
      NoOfOrderBookTo,
      SelectedMonth,
      Remarks,
    } = req.body;
    const token = req.headers["x-access-token"];
    const actualToken=await encryptToToken(token);
    const decodeToken = jwt.decode(actualToken);
    const userId = decodeToken.id;

    await orderBook.create({
      OrganisationID: OrganisationID,
      NoOfOrderBookFrom: NoOfOrderBookFrom,
      NoOfOrderBookTo: NoOfOrderBookTo,
      SelectedMonth: SelectedMonth,
      Remarks: Remarks,
      Deleted: "1",
      ModifiedBy: userId,
    });

    return res.status(200).send({
      status: true,
      message: "Order Book Added Successfully",
    });
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
};
const getAllOrderBookPositionData = async (req, res) => {
  try {
    const orderBookData =[]
    const getAllData = await orderBook.findAll({
      where: {
        Deleted: "1",
      },
      order: [
        ["OrderBookID", "DESC"], // Sorts by COLUMN in ascending order
      ],
      attributes: [
        "OrderBookID",
        "OrganisationID",
        "NoOfOrderBookFrom",
        "NoOfOrderBookTo",
        "SelectedMonth",
        ["SelectedMonth", "formattedSelectedMonth"],
        "Remarks",
        "Deleted",
      ],

    });
    for (let i = 0; i < getAllData.length; i++) {
      if (getAllData[i].OrderBookID != req.OrderBookID) {
          orderBookData.push({
          OrderBookID: getAllData[i].OrderBookID,
          OrganisationID: getAllData[i].OrganisationID,
          NoOfOrderBookFrom: getAllData[i].NoOfOrderBookFrom,
          NoOfOrderBookTo: getAllData[i].NoOfOrderBookTo,
          SelectedMonth: getAllData[i].formattedSelectedMonth,
          Remarks: getAllData[i].Remarks || "",
          Deleted: getAllData[i].Deleted,
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
    result.dataItems = orderBookData.slice(startIndex, endIndex);
    result.totalItems = orderBookData.length;
    result.totalPage = Math.ceil(orderBookData.length / limit);  
    result.currentPage = page;

    if(result.dataItems.length == 0) {
      return res.status(200).json({
        status: true,
        message:"No data found", 
        data: result,
      });
    } else {
      return res.status(200).json({ 
        status: true,
        message:"List of order book position data",   
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const orderBookPositionDataById = async (req, res) => {
  try {
    const { OrderBookID } = req.params;
    const orderBookData =[]
    if (!OrderBookID) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter OrderBookID" });
    }
    const OderBookExsist = await orderBook.findOne({
      where: {
        OrderBookID: OrderBookID,
      },
      // include: [
      //   {
      //     model: Organisation,
      //     required: true,
      //     attributes: ["OrganisationID", "Name"],
      //     as: "OrgNam",
      //   },
      // ],
      attributes: [
        "OrderBookID",
        "OrganisationID",
        "NoOfOrderBookFrom",
        "NoOfOrderBookTo",
        "SelectedMonth",
        ["SelectedMonth", "formattedSelectedMonth"],
        "Remarks",
      ],
    });

    if (!OderBookExsist) {
      return res.status(404).send({
        status: false,
        message: `Data ${OrderBookID} not found`,
      });
    }

    orderBookData.push({
      OrderBookID: OderBookExsist.OrderBookID,
      OrganisationID: OderBookExsist.OrganisationID,
      NoOfOrderBookFrom: OderBookExsist.NoOfOrderBookFrom,
      NoOfOrderBookTo: OderBookExsist.NoOfOrderBookTo,
      SelectedMonth:OderBookExsist.SelectedMonth,
      formattedMonth: OderBookExsist.formattedSelectedMonth,
      Remarks: OderBookExsist.Remarks || "",
      OrganisationName: OderBookExsist.OrganisationID
        ? await helper.organName(OderBookExsist.OrganisationID)
        : "",
    });
    return res.status(200).send({
      status: true,
      message: "Data found Successfully",
      data: orderBookData,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const updateOrderBookPositionDataById = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const userId = decodeToken.id;
    const { OrderBookID } = req.params;
    const { OrganisationID, NoOfOrderBookFrom, NoOfOrderBookTo,SelectedMonth, Remarks } = req.body;
    if (!OrderBookID) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter OrderBookID" });
    }
    const orderBookExsist = await orderBook.findOne({
      where: {
        OrderBookID: OrderBookID,
      },
    });
    if (!orderBookExsist) {
      return res.status(404).send({
        status: false,
        message: `Data ${OrderBookID} not found`,
      });
    }

    await orderBook.update(
      { OrganisationID,NoOfOrderBookFrom, NoOfOrderBookTo,SelectedMonth, Remarks, ModifiedBy: userId },
      { where: { OrderBookID } }
    );

    return res.status(200).send({
      status: true,
      message: `Order book updated successfully`,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const deleteOrderBookById = async (req,res)=>{
    try {
        const { OrderBookID } = req.params;
        if (!OrderBookID) {
            return res
              .status(400)
              .send({ status: false, message: "Please enter OrderBookID" });
          }
          const orderBookExsist = await orderBook.findOne({
            where: {
              OrderBookID: OrderBookID,
            },
          });
          if (!orderBookExsist) {
            return res.status(404).send({
              status: false,
              message: `Data ${OrderBookID} not found`,
            });
          }
    
        await orderBook.update(
            {
              Deleted: "0",
            },
            {
              where: {
                OrderBookID: OrderBookID,
              },
            }
          );
          return res
          .status(200)
          .send({ status: true, message: "Order Book deleted successfully" });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const pieChartOrderBook = async (req, res) => {
  try {
    const orderData = [];
    const totalOrgCount = await orderBook.count({
      where: { Deleted: "1" },
    });
    let totalOnDate = await orderBook.sum('NoOfOrderBookTo',{
    where: { Deleted: "1" },
    });  
    const orderBookData = await orderBook.findAll({  
      attributes: [
        "OrderBookID",
        "OrganisationID",
        "NoOfOrderBookFrom",
        "NoOfOrderBookTo",
        "SelectedMonth",
        ["SelectedMonth", "formattedSelectedMonth"],
        "Remarks",
        "Deleted",
        [sequelize.fn("COUNT", sequelize.col("OrganisationID")), "countOrganisation"],
        [sequelize.fn("SUM", sequelize.col("NoOfOrderBookTo")), "sumofOrderTillNow"],  
        [sequelize.fn("AVG", sequelize.col("NoOfOrderBookTo")), "avgOrderTillNow"],  
      ],
      group: ["OrganisationID"], 
      where: { Deleted: "1" },   
    });
    for (let i = 0; i < orderBookData.length; i++) {
      if (orderBookData[i].OrderBookID != req.OrderBookID) {
        
        const organisationName = orderBookData[i].OrganisationID
          ? await helper.organName(orderBookData[i].OrganisationID)
          : "";
        orderData.push({
          OrderBookID: orderBookData[i].OrderBookID,
          OrganisationID: orderBookData[i].OrganisationID,
          NoOfOrderBookFrom: orderBookData[i].NoOfOrderBookFrom,
          NoOfOrderBookTo: orderBookData[i].NoOfOrderBookTo,
          // SelectedMonth: orderBookData[i].SelectedMonth,
          // formattedSelectedMonth: orderBookData[i].formattedSelectedMonth,
          Remarks: orderBookData[i].Remarks || "",
          Deleted: orderBookData[i].Deleted,
          countOrganisation: orderBookData[i].dataValues.countOrganisation,
          sumofOrderTillNow:orderBookData[i].dataValues.sumofOrderTillNow,
          avgOrderTillNow: orderBookData[i].dataValues.avgOrderTillNow,
          OrganisationName: organisationName,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: `Order Book Position Percentage Found`,
      data: { totalOrgCount, totalOnDate, orderData },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
module.exports = {
  orderBookPositionData,
  getAllOrderBookPositionData,
  orderBookPositionDataById,
  updateOrderBookPositionDataById,
  deleteOrderBookById,
  pieChartOrderBook
};
