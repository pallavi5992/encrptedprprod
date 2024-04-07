 function finalyear(id){
    if(id===1){
      return "2016-17"
    }
    else if (id==1) {
      return " 2016-17"
      }
      else if(id==2){
        return "2017-18"
      }
      else if(id==3){
        return "2018-19"
      }
      else if(id==4){
        return "2019-20"
      }
      else if(id==5){
        return "2020-21"
      }
      else if(id==6){
        return "2021-22"
      }
      else if(id==7){
        return "2022-23"
      }
      else if(id==8){
        return "2023-24"
      }
      else if(id==11){
        return "2024-25"
      }
      
      
  };


 function months(id) {
  if (id === 1) {
    return "Mar";
  } else if (id == 1) {
    return " Mar";
  } else if (id == 2) {
    return "Apr";
  } else if (id == 3) {
    return "May";
  } else if (id == 4) {
    return "June";
  } else if (id == 5) {
    return "July";
  } else if (id == 6) {
    return "Aug";
  } else if (id == 7) {
    return "Sep";
  } else if (id == 8) {
    return "Oct";
  } else if (id == 9) {
    return "Nov";
  } else if (id == 10) {
    return "Dec";
  } else if (id == 11) {
    return "Jan";
  }else if (id == 12) {
    return "Feb";
  }else if (id == 13) {
    return "Mar";
  }
}
module.exports = {
  finalyear,
  months,
};