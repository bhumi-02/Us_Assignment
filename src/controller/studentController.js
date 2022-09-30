const studentModel = require("../model/studentModel");
const bcrypt = require("bcrypt");
const { isString, isEmail, isPin, ismobile, isStreet, isPassword } = require("../utilities/validator")
const redis = require("redis");
const SolrNode = require('solr-node');

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    { url: "//redis-14007.c264.ap-south-1-1.ec2.cloud.redislabs.com:14007" },
);

redisClient.auth("AJI4jGJNA1IXYZ66Xlx680DLqzJA3JmG", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :

//Connection setup for redis
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
//---------------------------------------------------------------------------------//
const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === null) {
        return false
    }
    if (typeof (value).trim().length == 0) {
        return false
    }
    if (typeof (value) === "string" && (value).trim().length > 0) {
        return true
    }
}
// ************************************************* POST /register ********************************* //

const createStudent = async function (req, res) {
    try {
        let body = req.body;

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, message: "Please provide the data" })
        }

        if (!body.fname) {
            return res.status(400).send({ Status: false, message: "Please enter the first name" })
        }

        if (!isString(body.fname)) {
            return res.status(400).send({ Status: false, message: "first name is not valid" })
        }

        if (!body.lname) {
            return res.status(400).send({ Status: false, message: "Please enter the last name" })
        }
        if (!isString(body.lname)) {
            return res.status(400).send({ Status: false, message: "last name is not valid" })
        }

        //---------Email and Phone validation -------------------------------------------------------------//
        if (!body.email) {
            return res.status(400).send({ Status: false, message: "Please enter the email" })
        }
        if (!isEmail(body.email)) {
            return res.status(400).send({ Status: false, message: "email is not valid" })
        }
        if (!body.phone) {
            return res.status(400).send({ Status: false, message: "Please enter the 10 digit indian mobile number" })
        }
        if (!ismobile(body.phone)) {
            return res.status(400).send({ Status: false, message: "mobile number is not valid" })
        }

        //-----------------------------Email and Phone uniqcheck ----------------------------------------------------//
        let uniqueCheck = await studentModel.findOne({ email: body.email.toLowerCase().trim() })
        if (uniqueCheck) {
            if (uniqueCheck.email) {
                return res.status(400).send({ Status: false, message: "This email has been used already" })
            }
        }
        let uniqueCheckPhone = await studentModel.findOne({ phone: body.phone })
        if (uniqueCheckPhone) {
            if (uniqueCheckPhone.phone) {
                return res.status(400).send({ Status: false, message: "This phone has been used already" })
            }
        }
        //----------------------------------------------------------------------------------------------------------//

        if (!body.password) {
            return res.status(400).send({ Status: false, message: "Please enter the password" })
        }
        if (!isPassword(body.password)) {
            return res.status(400).send({ Status: false, message: "Please enter the valid password" })
        }

        //------------------------------------------Address validation------------------------------------------------------------------//

        if (!body.address) {
            return res.status(400).send({ Status: false, message: "Please enter the address" })
        }


        if (Object.keys(body.address).length === 0) {
            return res.status(400).send({ Status: false, message: "Please provide the address data" })
        }

        let { address } = body

        if (address) {
            if (!address.street) {
                return res.status(400).send({ Status: false, message: "Please enter the street address" })
            }
            if (!isStreet(address.street)) {
                return res.status(400).send({ Status: false, message: "Please enter the valid shipping street address" })
            }
            if (!address.city) {
                return res.status(400).send({ Status: false, message: "Please enter the shipping city address" })
            }
            if (!isStreet(address.city)) {
                return res.status(400).send({ Status: false, message: "Please enter the valid shipping city address" })
            }
            if (!address.pincode) {
                return res.status(400).send({ Status: false, message: "Please enter the shipping pin code" })
            }
            if (!isPin(address.pincode)) {
                return res.status(400).send({ Status: false, message: "Please enter the valid shipping pin code" })
            }
        }
        //------------------------------------------Encrypting the password------------------------------------------------------//

        body.password = await bcrypt.hash(body.password, 10)

        //----------------------------------------User Creation-------------------------------------------------------//

        const createStudent = await studentModel.create(body)
        let resultUser = await studentModel.findOne({ _id: createStudent._id }).select({ "__v": 0 })
        return res.status(201).send({ Status: true, data: resultUser })
    } catch (err) {
        return res.status(500).send({ Status: false, message: err.message })
    }
}

const getStudentData = async function (req, res) {

    try {
        const emailId = req.query.emailId;
        let studentData = await GET_ASYNC(emailId);
        studentData = JSON.parse(studentData);
        if (!emailId) {
            return res.status(400).send({ status: false, message: "valid emailId is required" })
        }
        if (!studentData) {
            studentData = await studentModel.findOne({ email: emailId }).select({ "__v": 0 });
            await SET_ASYNC(`${emailId}`, JSON.stringify(studentData));
        }
        if (!studentData)
            return res.status(400).send({ status: false, message: "no data found with user Id" })

        return res.status(200).send({ status: true, message: "user Details", data: studentData })

    } catch (err) {
        return res.status(500).send({ Status: false, message: err.message })
    }

}
//connection to solr
  var client = new SolrNode({
      host: 'localhost',
      port: '8983',
      core: 'products',
      protocol: 'http'
  });

module.exports = { createStudent, getStudentData}