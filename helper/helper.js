const db = require("../models");
const Roles = db.role;
const Access=db.access;
const Module=db.module
const User = db.user;
const Organization=db.organisation
const Location = db.location;
const DiscMaster = db.discMaster;
const DefenceChallange = db.defenceChallange;
const Year = db.tblYear;

function isRole(role) {
  if (role == "SuperAdmin") {
    return "Super Admin";
  } else if (role == "Admin") {
    return "Module Admin";
  } else if (role == "Unit") {
    return "Restricted User-AI";
  } else if (role == "Organization") {
    return "Restricted User-offset & AI";
  }else if(role=="Factory"){
    return "Restricted User-offset & AI"
  }
};

async function getRole(roleId) {
  const result = await Roles.findOne({
    where: {
      RoleId: parseInt(roleId),
    },
  });
  if (result) {
    return isRole(result.Role);
  }
  return "";
}

async function getRoleforLogin(roleId) {
  const result = await Roles.findOne({
    where: {
      RoleId: parseInt(roleId),
    },
  });
  if (result) {
    return result.Role||"";
  }
  return "";
};

async function getAccessModuleUser(moduleId){
  const moduleName=[]
  for(let i=0;i<moduleId.length;i++){
    const getAccessData=await Module.findOne({
      where:{
        ModuleID:moduleId[i]
      }
    });
    if(getAccessData){
      moduleName.push(getAccessData?.ModuleName)
    }
  }
  return moduleName.length>0?moduleName:""
}


async function userModuleAssign(userId){
 
  const getUserAccessData=await Access.findOne({
    where:{
      UserID:parseInt(userId)
    }
  })
  if(getUserAccessData){
    const result=await getAccessModuleUser(getUserAccessData?.ModuleID)
    return result
  }
return ""
}

async function userName(userId){
  const user=await User.findOne({
    where:{
      UserID:parseInt(userId)
    }
  })
  if(user){
    return user.User_Name
  }
  return ""
}
async function moduleName(moduleId){
  const module=await Module.findOne({
    where:{
      ModuleID:parseInt(moduleId)
    }
  })
  if(module){
    return module.ModuleName
  }
  return ""
}

async function organisationName(id){
  const organization=await Organization.findOne({
    where:{
      OrganisationID:parseInt(id)
    }
  })
  if(organization){
    return organization.Code
  }
  return ""
}

async function locationName(id) {
  const location = await Location.findOne({
    where: {
      LocationId: parseInt(id)
    }
  });

  if (location) {
    return location.LocationName; 
  }

  return "";
}

async function DiscMasterData(id) {
  const Discmaster = await DiscMaster.findOne({
    where: {
      id: parseInt(id)
    }
  });

  if (Discmaster) {
    return Discmaster.Name; 
  }

  return "";
}
async function DefenceChallenge(id) {
  console.log(" DefenceChallenge Input id:", id);
  const defenceChallenge = await DefenceChallange.findOne({
    where: {
      id: parseInt(id)
    }
  });

  if (defenceChallenge) {
    return defenceChallenge.ChallangeName; 
  }

  return "";
}


async function getFYear(YearID) {
  const result = await Year.findOne({
    where: {
      YearID: parseInt(YearID),
    },
  });
  if (result) {
    return result.Year
   
  }
  return "";
}

async function organName(id) {
  const organization = await Organization.findOne({
    where: {
      OrganisationID: parseInt(id),
    },
  });
  if (organization) {
    return {
      name: organization.Name,
      code: organization.Code,
    };
  }
  return "";
}

module.exports = {
  getRole,
  getRoleforLogin,
  getAccessModuleUser,
  userModuleAssign,
  userName,
  moduleName,
  organisationName,
  locationName,
  DiscMasterData,
  DefenceChallenge,
  getFYear,
  organName
  
};
