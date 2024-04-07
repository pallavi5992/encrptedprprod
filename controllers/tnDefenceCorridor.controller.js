const db = require("../models");
const TndefenceCorridor = db.tndefenceCorridor;
const { getSystemIPAddress } = require("../helper/systemIp");
const helperTndefence=require("../helper/helper")
const { Base64toId, idIntoBase64 } = require("../helper/idIntoBase64");
const Location = db.location;
const moment =require('moment')
const InvestmentDefecneCorridor =db.InvestmentDefecneCorridor



function sector(id){
  if(id===0){
    return "Private"
  }
  else if (id==0) {
    return "Private"
    }
    else if(id==1){
      return "Public"
    }
}
const addTndefencecorridor = async (req, res) => {

  try {
    const {

      Sector,
      OrganisationID,
      Investment,
      Project
    }= req.body
    const userId = req.userId;

    const stateId = await Location.findOne({
      where:{
        LocationName: "Tamil Nadu"
      },
      attributes:["LocationId"]
    })

    await TndefenceCorridor.create({
        State:stateId?stateId.LocationId:"",
        Sector:Sector,
        OrganisationID:OrganisationID,
        Investment:Investment,
        Project:Project,
        Deleted: "0",
        ModifiedOn: new Date(),
        ModifiedBy: userId,
        IPAddress: getSystemIPAddress(),
        }) 
        return res .status(200) .send({status:true, message:"added Tamil Nadu defence corridor Successfully"})
} catch (error) {
    return res .status(500) .send({status:false, message:error.message})
    
}

};
const getAllTndefencecorridor = async (req, res) => {
  
  try {
    
    console.log("Request received");

    const TndefenceCorridorData = [];
    const foundTndefencecorridor = await TndefenceCorridor.findAll({
      attributes: [
        "CorridorID",
        "Sector",
        "OrganisationID",
        "Investment",
        "Project",
        "Deleted",
      ],
    });

    console.log("Data fetched from database");

    if (foundTndefencecorridor.length === 0) {
      console.log("No data found");
      return res.status(404).send({
        status: false,
        message: "No data found",
      });
    }

    for (let i = 0; i < foundTndefencecorridor.length; i++) {
      const encryptId = await idIntoBase64(foundTndefencecorridor[i].CorridorID);
      TndefenceCorridorData.push({
        Id: encryptId,
        Sector: foundTndefencecorridor[i].Sector ? sector(foundTndefencecorridor[i].Sector) : "",
        OrganisationID: foundTndefencecorridor[i].OrganisationID ? await helperTndefence.organisationName(foundTndefencecorridor[i].OrganisationID) : "",
        Investment: foundTndefencecorridor[i].Investment,
        Project: foundTndefencecorridor[i].Project,
        status: foundTndefencecorridor[i].Deleted,
      });
    }

    console.log("Sending 200 response");

    return res.status(200).send({
      status: true,
      message: "Data found",
      data: TndefenceCorridorData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};


const getByTndefencecorridor  = async (req, res) => {

  try {
    const{id}= req.params;
    const actualID = await Base64toId(id)
      const foundTndefencecorridor = await TndefenceCorridor.findOne(
             {
              where: {
                CorridorID: actualID,
            },
          attributes: [
            "CorridorID",
            "State",
            "Sector",
            "OrganisationID",
            "Investment",
            "Project",
          ],
        }
      );

      if (!foundTndefencecorridor) {
        return res.status(400).send({
          status: false,
          message: `Data not found`,
        });
      }
      const TndefenceDefencCorridor = {
        State: foundTndefencecorridor.State,
        Sector: foundTndefencecorridor.Sector,
        OrganisationID: foundTndefencecorridor.OrganisationID,
        Investment: foundTndefencecorridor.Investment,
        Project: foundTndefencecorridor.Project,
    };
      return res.status(200).send({
        status: true,
        message: "Data found successfully",
        data: TndefenceDefencCorridor,
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        message: error.message,
      });
    }
};
const updateTndefencecorridor  = async (req, res) => {
  try {
    const{id}= req.params;
    const actualID = await Base64toId(id)
    const {
   
      Sector,
      OrganisationID,
      Investment,
      Project
      } = req.body;
    const foundTndefencecorridor = await TndefenceCorridor.findByPk(actualID)
   
    if(!foundTndefencecorridor){
      return res .status(404) .send({status:false, message: "Data not Found"});
    }

       await TndefenceCorridor.update({
    
       Sector:Sector,
       OrganisationID:OrganisationID,
       Investment:Investment,
       Project:Project,
        ModifiedOn:  new Date(),
        ModifiedBy: req.userId,
        IPAddress: getSystemIPAddress(),
    },
      { where: { CorridorID:actualID } }
   )
    return res.status(200) .send({staus:true, message: " Data Update Successfully"})
    
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
    
  }

};
const deleteTndefencecorridor  = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.query.status;
    const actualID = await Base64toId( id)
    if (!status) {
      return res
        .status(400)
        .send({ status: true, message: "Please enter status" });
    }

    if (status == "1") {
      await TndefenceCorridor.update(
        {
          Deleted: status,
        },
        {
          where: {
            CorridorID: actualID,
          },
        }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "Tamil nadu defence Corridor inActive successfully",
        });
    } 
    else if(status=="0"){
      await TndefenceCorridor.update(
        {
          Deleted: status,
        },
        {
          where: {
            CorridorID: actualID,
          },
        }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "Tamil nadu defence Corridor active successfully",
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};




const addTnInvestmentDefecneCorridor = async (req, res) => {
  try {
      const {
        InvestmentTarget,
        InvestmentMade,
        AS_On_Date,
        Already_attached_investment
      }= req.body
      const userId = req.userId;
  
      const stateId = await Location.findOne({
        where:{
          LocationName: "Tamil Nadu"
        },
        attributes:["LocationId"]
      })
      
      await InvestmentDefecneCorridor.create({
          State:stateId?stateId.LocationId:"",
          InvestmentTarget:InvestmentTarget,
          InvestmentMade:InvestmentMade,
          ModifiedOn: AS_On_Date,
          Already_attached_investment:Already_attached_investment,
          ModifiedBy: userId,
          IPAddress: getSystemIPAddress(),
          }) 
          return res .status(200) .send({status:true, message:"Added TN defence corridor Successfully"})
  } catch (error) {
      return res .status(500) .send({status:false, message:error.message})
      
  }


};

const getTnSingleDataInvestmentDefence = async (req, res) => {
  try {
      const Founddata = await InvestmentDefecneCorridor.findOne({
          where: {
              State: 3
          },
          order: [["ModifiedOn", "DESC"]],
          attributes: [
              "InvestmentTarget",
              "InvestmentMade",
              "ModifiedOn",
          ],
      });

      if (!Founddata) {
          return res.status(200).send({
              status: false,
              message: `Data not found for State`,
          });
      }

      const SingleData = {
          InvestmentTarget: Founddata.InvestmentTarget ? Founddata.InvestmentTarget : "",
          InvestmentMade: Founddata.InvestmentMade ? Founddata.InvestmentMade : "",
          ModifiedOn: Founddata.ModifiedOn ? moment(Founddata.ModifiedOn, "YYYY-MM-DD").format("DD/MM/YYYY") : "",
      };

      return res.status(200).send({
          status: true,
          message: "Last data found",
          data: SingleData,
      });

  } catch (error) {
      return res.status(500).send({
          status: false,
          message: error.message,
      });
  }
};

const getAlldashboardData = async (req, res) => {
  try {
    const TndefenceCorridorData = [];
    const foundTndefencecorridor2 = await TndefenceCorridor.findAll({
      attributes: ["Investment", "Sector", "Project", "OrganisationID"],
      distinct: true,
    });

    for (let i = 0; i < foundTndefencecorridor2.length; i++) {
      TndefenceCorridorData.push({
        Sector: foundTndefencecorridor2[i].Sector ,
        OrganisationID: foundTndefencecorridor2[i].OrganisationID ? await helperTndefence.organisationName(foundTndefencecorridor2[i].OrganisationID) : "",
        Investment: foundTndefencecorridor2[i].Investment,
        Project: foundTndefencecorridor2[i].Project,
      });
    }

    const organisationTotals = {};
    let grandTotalInvestment = 0;
    const foundTndefencecorridor1 = await TndefenceCorridor.findAll({
      attributes: ["Sector", "OrganisationID", "Investment", "Project"],
    });

    foundTndefencecorridor1.forEach((item) => {
      const orgID = item.OrganisationID;

      organisationTotals[orgID] = (organisationTotals[orgID] || 0) + item.Investment;

      grandTotalInvestment += item.Investment;
    });

const uniqueOrganisationTotals = await Promise.all(Object.keys(organisationTotals).map(async (orgID) => {
  return {
    OrganisationID: orgID ? await helperTndefence.organisationName(orgID) : "",
    Total: organisationTotals[orgID],
  };
}));

    return res.status(200).send({
      status: true,
      message: "Data found",
      data: {
        TndefenceCorridorData,
        uniqueOrganisationTotals,
        Grand_Total	: grandTotalInvestment,
      },

    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
    addTndefencecorridor,
    getAllTndefencecorridor,
    getByTndefencecorridor,
    updateTndefencecorridor,
    deleteTndefencecorridor,
    addTnInvestmentDefecneCorridor,
    getTnSingleDataInvestmentDefence,
    getAlldashboardData,
    

};
