const db = require("../models");
const UpdefenceCorridor = db.updefenceCorridor;
const { getSystemIPAddress } = require("../helper/systemIp");
const { Base64toId, idIntoBase64 } = require("../helper/idIntoBase64");
const helperUpdefence=require("../helper/helper")
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
const addupdefencecorridor = async (req, res) => {
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
            LocationName: "Uttar Pradesh"
          },
          attributes:["LocationId"]
        })

        await UpdefenceCorridor.create({
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
            return res .status(200) .send({status:true, message:"added UP defence corridor Successfully"})
    } catch (error) {
        return res .status(500) .send({status:false, message:error.message})
        
    }


};
const getAllupdefencecorridor  = async (req, res) => {
    try {
      
        const UpdefenceCorridorData =[]
        const foundupdefencecorridor = await UpdefenceCorridor.findAll({
            attributes:[
            "CorridorID",
            "Sector",
            "OrganisationID",
            "Investment",
            "Project",
            "Deleted"
        ]
        })
     for(let i=0; i<foundupdefencecorridor.length; i++){   
     const encryptId = await idIntoBase64(foundupdefencecorridor[i].CorridorID)
     UpdefenceCorridorData.push({
        Id:encryptId,
        Sector: foundupdefencecorridor[i].Sector?sector(foundupdefencecorridor[i].Sector):"",
        OrganisationID:foundupdefencecorridor[i].OrganisationID?await helperUpdefence.organisationName(foundupdefencecorridor[i].OrganisationID):"",
        Investment: foundupdefencecorridor[i].Investment ,
        Project: foundupdefencecorridor[i].Project ,
        status: foundupdefencecorridor[i].Deleted,
       
        })
}
return res .status(200) .send({status:true ,message:"Data found " ,data:UpdefenceCorridorData,  })
} catch (error) {
        return res .status(500) .send({status:false, message: error.message})
        
    }
};
const getByIdupdefencecorridor  = async (req, res) => {

    try {
      const{id}= req.params;
      const actualID = await Base64toId(id)
        const foundupdefencecorridor = await UpdefenceCorridor.findOne(
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

        if (!foundupdefencecorridor) {
          return res.status(400).send({
            status: false,
            message: `Data not found`,
          });
        }
        const UpdefenceDefencCorridor = {
          State: foundupdefencecorridor.State,
          Sector: foundupdefencecorridor.Sector,
          OrganisationID: foundupdefencecorridor.OrganisationID,
          Investment: foundupdefencecorridor.Investment,
          Project: foundupdefencecorridor.Project,
      };
        return res.status(200).send({
          status: true,
          message: "Data found successfully",
          data: UpdefenceDefencCorridor,
        });
      } catch (error) {
        return res.status(500).send({
          status: false,
          message: error.message,
        });
      }
};
const updateupdefencecorridor  = async (req, res) => {
    try {
        const{id}= req.params;
        const actualID = await Base64toId(id)
        const {
       
          Sector,
          OrganisationID,
          Investment,
          Project
          } = req.body;
        const foundUpdefencecorridor = await UpdefenceCorridor.findByPk(actualID)
        
        if(!foundUpdefencecorridor){
          return res .status(404) .send({status:false, message: "Data not Found"});
        }
    
           await UpdefenceCorridor.update({
        
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
const deleteupdefencecorridor  = async (req, res) => {
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
          await UpdefenceCorridor.update(
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
              message: "Idexstartupdefence inActive successfully",
            });
        } 
        else if(status=="0"){
          await UpdefenceCorridor.update(
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
              message: "Make Idexstartupdefence active successfully",
            });
        }
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
      }
};


const addUpInvestmentDefecneCorridor = async (req, res) => {
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
          LocationName: "Uttar Pradesh"
        },
        attributes:["LocationId"]
      })
      
      await InvestmentDefecneCorridor.create({
          State:stateId?stateId.LocationId:"",
          InvestmentTarget:InvestmentTarget,
          InvestmentMade:InvestmentMade,
          ModifiedOn: AS_On_Date,
          ModifiedBy: userId,
          IPAddress: getSystemIPAddress(),
          Already_attached_investment:Already_attached_investment
          }) 
          return res .status(200) .send({status:true, message:"added UP defence corridor Successfully"})
  } catch (error) {
      return res .status(500) .send({status:false, message:error.message})
      
  }


};

const getUpSingleDataInvestmentDefence = async (req, res) => {
  try {
      const Founddata = await InvestmentDefecneCorridor.findOne({
        where: {
          State: 9,
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
              message: `Data not found for State `,
          });
      }

      const SingleData = {
          InvestmentTarget: Founddata.InvestmentTarget ? Founddata.InvestmentTarget : "",
          InvestmentMade: Founddata.InvestmentMade ? Founddata.InvestmentMade : "",
          ModifiedOn: Founddata.ModifiedOn ? moment(Founddata.ModifiedOn, "YYYY-MM-DD").format("DD/MM/YYYY") : "",
      };

      return res.status(200).send({ status: true, message: "Data found", data: SingleData });

  } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
  }
};

const getAlldashboardData = async (req, res) => {
  try {
    const UpdefenceCorridorData = [];
    const foundUpdefencecorridor2 = await UpdefenceCorridor.findAll({
      attributes: ["Investment", "Sector", "Project", "OrganisationID"],
      distinct: true,
    });

    for (let i = 0; i < foundUpdefencecorridor2.length; i++) {
      UpdefenceCorridorData.push({
        Sector: foundUpdefencecorridor2[i].Sector ,
        OrganisationID: foundUpdefencecorridor2[i].OrganisationID ? await helperUpdefence.organisationName(foundUpdefencecorridor2[i].OrganisationID) : "",
        Investment: foundUpdefencecorridor2[i].Investment,
        Project: foundUpdefencecorridor2[i].Project,
      });
    }

    const organisationTotals = {};
    let grandTotalInvestment = 0;
    const foundUpdefencecorridor1 = await UpdefenceCorridor.findAll({
      attributes: ["Sector", "OrganisationID", "Investment", "Project"],
    });

    foundUpdefencecorridor1.forEach((item) => {
      const orgID = item.OrganisationID;

      organisationTotals[orgID] = (organisationTotals[orgID] || 0) + item.Investment;

      grandTotalInvestment += item.Investment;
    });

const uniqueOrganisationTotals = await Promise.all(Object.keys(organisationTotals).map(async (orgID) => {
  return {
    OrganisationID: orgID ? await helperUpdefence.organisationName(orgID) : "",
    Total: organisationTotals[orgID],
  };
}));

    return res.status(200).send({
      status: true,
      message: "Data found",
      data: {
        UpdefenceCorridorData,
        uniqueOrganisationTotals,
        Grand_Total	: grandTotalInvestment,

      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};



module.exports = {
    addupdefencecorridor,
    getAllupdefencecorridor,
    getByIdupdefencecorridor,
    updateupdefencecorridor,
    deleteupdefencecorridor,

    addUpInvestmentDefecneCorridor,
    getUpSingleDataInvestmentDefence,
    getAlldashboardData
};
