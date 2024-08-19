import UserModel from '../model/User.model.js'
import ItemModel from '../model/Item.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';

/** middleware for verify User */
export async function verifyUser(req, res, next) {
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}



export async function checkone(req, res, next) {
    try {
        const { username, email } = req.method == "GET" ? req.query : req.body;

        let usernameExist = await UserModel.findOne({ username });
        let emailExist = await UserModel.findOne({ email });
        if (!usernameExist) return res.status(404).send({ error: "Username is available" });
        if (!emailExist) return res.status(404).send({ error: "Email is available" });
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Huai Kwhang",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, firstName, lastName, profile, email } = req.body;

        // Check for existing username
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function (err, user) {
                if (err) reject(new Error(err));
                if (user) reject({ error: "Please use unique username" });
                resolve();
            });
        });

        // Check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function (err, email) {
                if (err) reject(new Error(err));
                if (email) reject({ error: "Please use unique Email" });
                resolve();
            });
        });

        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {

                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                firstName,
                                lastName,
                                profile: profile || '',
                                email
                            });

                            // Save the user to the database
                            user.save()
                                .then(result => {
                                    // Generate JWT token
                                    const token = jwt.sign(
                                        {
                                            userId: result._id,
                                            username: result.username
                                        },
                                        ENV.JWT_SECRET);

                                    // Return success response with token
                                    res.status(201).send({
                                        msg: "User registered successfully",
                                        token: token
                                    });
                                })
                                .catch(error => res.status(500).send({ error: "Error saving user" }));
                        })
                        .catch(error => {
                            return res.status(500).send({
                                error: "Unable to hash password"
                            });
                        });
                } else {
                    return res.status(400).send({ error: "Password is required" });
                }
            })
            .catch(error => {
                return res.status(400).send({ error });
            });

    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}



/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {

    const { username, password } = req.body;

    try {

        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if (!passwordCheck) return res.status(400).send({ error: "Don't have Password" });

                        // create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, ENV.JWT_SECRET);

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });

                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not Match" })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not Found" });
            })

    } catch (error) {
        return res.status(500).send({ error });
    }
}



/** GET: http://localhost:8080/api/getuser/:username */
export async function alphasrequestforgetuser(req, res) {
    const { username } = req.params;

    try {
        if (!username) return res.status(400).send({ error: "Invalid Username" });

        UserModel.findOne({ username }, function (err, user) {
            if (err) return res.status(500).send({ error: "Internal Server Error" });
            if (!user) return res.status(404).send({ error: "Couldn't Find the User" });

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = user.toObject();

            const token = ENV.JWT_SECRET

            return res.status(200).send({user: rest, token});
        });
    } catch (error) {
        return res.status(500).send({ error: "Cannot Find User Data" });
    }
}



/**
 * POST: http://localhost:8080/api/createitem
 * @param: {
 *   "type": "Internship",
 *   "name": "High School Student Stanford Summer Internship",
 *   "industry": ["Medicine"],
 *   "description": "Description of the internship...",
 *   "image": "",
 *   "link": "https://example.com",
 *   "status": "closed",
 *   "opening": "01-04-2024",
 *   "deadline": "01-05-2024",
 *   "organization": "Stanford CSSEC"
 * }
 */
export async function createItem(req, res) {
    try {
        const { type, name, industry, description, link, status, opening, deadline, organization, post_date, author } = req.body;

        // Validate required fields
        if (!type || !description || !status || !post_date || !author) {
            return res.status(400).send({ error: "All fields are required" });
        }

        // Create a new item instance
        const item = new ItemModel({
            type,
            name,
            industry,
            description,
            link,
            status,
            opening,
            deadline,
            organization,
            post_date,
            author
        });

        // Save the item to the database
        const savedItem = await item.save();
        return res.status(201).send({ msg: "Item Created Successfully", item: savedItem });

    } catch (error) {
        // Handle any errors that occur during the item creation
        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: error.message });
        }
        return res.status(500).send({ error: "Internal Server Error" });
    }
}



/** GET: http://localhost:8080/api/getitem
 * @param : {
  "type" : "exampleType"
 }
 */

export async function getItem(req, res) {
    try {
        const { type, name, industry, status, organization, post_date, author} = req.query;

        // Build the query object
        let query = {};
        if (type) query.type = type;
        if (name) query.name = name;
        if (industry) query.industry = industry;
        if (status) query.status = status;
        if (organization) query.organization = organization;
        if (post_date) query.post_date = post_date;
        if (author) query.author = author;

        // Retrieve items from the database
        let items = await ItemModel.find(query);

        if (!items.length) return res.status(404).send({ error: "No items found" });

        return res.status(200).send(items);

    } catch (error) {
        return res.status(500).send(error);
    }
}




/** GET: http://localhost:8080/api/example123 */
export async function getUser(req, res) {

    const { username } = req.params;

    try {

        if (!username) return res.status(501).send({ error: "Invalid Username" });

        UserModel.findOne({ username }, function (err, user) {
            if (err) return res.status(500).send({ err });
            if (!user) return res.status(501).send({ error: "Couldn't Find the User" });

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error: "Cannot Find User Data" });
    }

}


/** PUT: http://localhost:8080/api/updateUser
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
    try {

        // const id = req.query.id;
        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id: userId }, body, function (err, data) {
                if (err) throw err;

                return res.status(201).send({ msg: "Record Updated...!" });
            })

        } else {
            return res.status(401).send({ error: "User Not Found...!" });
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!' })
    }
    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired!" })
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

        const { username, password } = req.body;

        try {

            UserModel.findOne({ username })
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username: user.username },
                                { password: hashedPassword }, function (err, data) {
                                    if (err) throw err;
                                    req.app.locals.resetSession = false; // reset session
                                    return res.status(201).send({ msg: "Record Updated...!" })
                                });
                        })
                        .catch(e => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error: "Username not Found" });
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}


