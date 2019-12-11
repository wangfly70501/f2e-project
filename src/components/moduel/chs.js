
module.exports = function(req, res, next) {  
const crypto = require("crypto");
  let check_msg = req.body;
  let HASH_KEY = "33743677397A24432646294A404D6351";   
  console.log("check_msg", check_msg);
  check_msg = crypto
    .createHmac("sha256", HASH_KEY)
    .update(JSON.stringify(check_msg))
    .digest("hex");
  console.log(check_msg);
  if (check_msg != check_msg) {
    var err_code = code.ERROR_CODE.WRONG_SIGNATURE;
    return res.JSON({
      error_code: err_code,
      error_message: code.ERROR_CODE_MSG[err_code]
    });
  }
  next();
};
