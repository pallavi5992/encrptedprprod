const db = require("../models");
const Idexstartupdefence = db.idexstartupdefence;
const { getSystemIPAddress } = require("../helper/systemIp");
const helperIdex=require("../helper/helper")
const { Base64toId, idIntoBase64 } = require("../helper/idIntoBase64");

const addIdexstartupdefence = async (req, res) => {
    try {
        const {
            StartUp_name,
            Challenge_Category,
            Challenge,
            LocationId,
            Service
        }= req.body
        const userId = req.userId;
    
        await Idexstartupdefence.create({
            StartUp_name:StartUp_name,
            Challenge_Category:Challenge_Category,
            Challenge:Challenge,
            LocationId:LocationId,
            Service:Service,
            Deleted: "0",
            ModifiedOn: new Date(),
            ModifiedBy: userId,
            IPAddress: getSystemIPAddress(),
            }) 
            return res .status(200) .send({status:true, message:"added Data StartUps Defence Successfully"})
    } catch (error) {
        return res .status(500) .send({status:false, message:error.message})
        
    }


};
const getAllIdexstartupdefence = async (req, res) => {
    try {

        const IdexstartUpdefence =[]
        const key = req.query.key;
        const foundidexstartupsDefence = await Idexstartupdefence.findAll({
            attributes:[
            "StartupID",
            "StartUp_name",
            "Challenge_Category",
            "Challenge",
            "LocationId",
            "Service",
            "Deleted"
        ]
        })
  for(let i=0; i<foundidexstartupsDefence.length; i++){   
    console.log(foundidexstartupsDefence[i].Challenge_Category);
    const encryptId = await idIntoBase64(foundidexstartupsDefence[i].StartupID)
    IdexstartUpdefence.push({
        Id:encryptId,
        StartUp_name: foundidexstartupsDefence[i].StartUp_name,
        Challenge_Category: foundidexstartupsDefence[i].Challenge_Category? await helperIdex.DiscMasterData(foundidexstartupsDefence[i].Challenge_Category):"" ,
        Challenge: foundidexstartupsDefence[i].Challenge? await helperIdex.DefenceChallenge(foundidexstartupsDefence[i].Challenge):"" , 
        LocationId: foundidexstartupsDefence[i].LocationId ? await helperIdex.locationName(foundidexstartupsDefence[i].LocationId):"",
        Service: foundidexstartupsDefence[i].Service ,
        status: foundidexstartupsDefence[i].Deleted,
        })
}

if (key) {
  const idexData = IdexstartUpdefence.filter((item) => {
    return (
      
      String(item.StartUp_name).includes(key) ||
      String(item.Challenge_Category).includes(key) ||
      String(item.Service).includes(key) ||
      String(item.LocationId).includes(key) ||
      String(item.Other_PSU).includes(key)
    );
  });
  const result = {};
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = page * limit;
  const endIndex = (page + 1) * limit;
  result.dataItems = idexData.slice(startIndex, endIndex);
  result.totalItems = idexData.length;
  result.totalPage = Math.ceil(idexData.length / limit);
  result.currentPage = page;

  return res
    .status(200)
    .send({ status: true, message: "Data found", data: result });
} else {
  const result = {};
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = page * limit;
  const endIndex = (page + 1) * limit;
  result.dataItems = IdexstartUpdefence.slice(startIndex, endIndex);
  result.totalItems = IdexstartUpdefence.length;
  result.totalPage = Math.ceil(IdexstartUpdefence.length / limit);
  result.currentPage = page;
  return res
    .status(200)
    .send({ status: true, message: "Data found", data: result });
};
} catch (error) {
        return res .status(500) .send({status:false, message: error.message})
        
    }
};

const getByIDIdexstartupdefence = async (req, res) => {

    try {
      const{id}= req.params;
      const actualID = await Base64toId(id)
        const foundidexstartupsDefence = await Idexstartupdefence.findOne(
               {
                where: {
                  StartupID: actualID,
              },
            attributes: [
                "StartUp_name",
                "Challenge_Category",
                "Challenge",
                "LocationId",
                "Service"
            ],
          }
        );

        if (!foundidexstartupsDefence) {
          return res.status(400).send({
            status: false,
            message: `Data not found`,
          });
        }
        const IdexstartUpdefence = {
            StartUp_name: foundidexstartupsDefence.StartUp_name,
            Challenge_Category: foundidexstartupsDefence.Challenge_Category,
            Challenge: foundidexstartupsDefence.Challenge,
            LocationId: foundidexstartupsDefence.LocationId,
            Service: foundidexstartupsDefence.Service,
      };
        return res.status(200).send({
          status: true,
          message: "Data found successfully",
          data: IdexstartUpdefence,
        });
      } catch (error) {
        return res.status(500).send({
          status: false,
          message: error.message,
        });
      }
};
const updatemakeIdexstartupdefence = async (req, res) => {
    try {
        const{id}= req.params;
        const actualID = await Base64toId(id)
        const {
            StartUp_name,
            Challenge_Category,
            Challenge,
            LocationId,
            Service
          } = req.body;
        const foundidexstartupsDefence = await Idexstartupdefence.findByPk(actualID)
       
        if(!foundidexstartupsDefence){
          return res .status(404) .send({status:false, message: "Data not Found"});
        }
    
        await Idexstartupdefence.update({
            StartUp_name:StartUp_name,
            Challenge_Category:Challenge_Category,
            Challenge:Challenge,
            LocationId:LocationId,
            Service:Service,
            ModifiedOn:  new Date(),
            ModifiedBy: req.userId,
            IPAddress: getSystemIPAddress(),
        },
          { where: { StartupID:actualID } }
       )
        return res.status(200) .send({staus:true, message: " Data Update Successfully"})
        
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
        
      }

};
const deleteIdexstartupdefence = async (req, res) => {
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
          await Idexstartupdefence.update(
            {
              Deleted: status,
            },
            {
              where: {
                StartupID: actualID,
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
          await Idexstartupdefence.update(
            {
              Deleted: status,
            },
            {
              where: {
                StartupID: actualID,
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
module.exports = {
    addIdexstartupdefence,
    getAllIdexstartupdefence,
    getByIDIdexstartupdefence,
    updatemakeIdexstartupdefence,
    deleteIdexstartupdefence,
};
