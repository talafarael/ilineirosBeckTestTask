/**
 * @swagger
 *
 * /api/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Авторизует пользователя, используя электронную почту и пароль.
 *     requestBody:
 *       description: Данные пользователя для авторизации
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Электронная почта пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *       401:
 *         description: Неверные учетные данные
 */
app.post("/api/login", (req, res) => {})

/**
 * @swagger
 *
 * /api/getuser:
 *   post:
 *     summary: Get user information
 *     description: Retrieve user information using the provided token.
 *     requestBody:
 *       description: User data for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's authentication token
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/getuser", (req, res) => {})

/**
 * @swagger
 *
 * /api/registration:
 *   post:
 *     summary: This is the first part of registration
 *     description: After the first part, you should send a request to /api/sendemail to receive a one-time password.
 *     requestBody:
 *       description: User data for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *               name:
 *                  type: string
 *                  description: User's name
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/registration", (req, res) => {})

/**
 * @swagger
 *
 * /api/sendemail:
 *   get:
 *     summary: This is the second part of registration
 *     description: After the second part, an email with a password will be sent to your email address, then proceed to /api/registercreate.
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.get("/api/sendemail", (req, res) => {})

/**
 * @swagger
 *
 * /api/registercreate:
 *   post:
 *     summary: Third part of registration
 *     description: Enter the one-time password sent to your email.
 *     requestBody:
 *       description: User data for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: User's authentication token
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/registercreate", (req, res) => {})

/**
 * @swagger
 *
 * /api/editprofileimage:
 *   post:
 *     summary: change img profile
 *     description: In this endpoint, the user can change their profile image. They need to provide an authentication token along with the image they want to set as their profile picture..
 *     requestBody:
 *       description: img and token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's authentication token
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/editprofileimage", (req, res) => {})

/**
 * @swagger
 *
 * /api/validatetoken:
 *   post:
 *     summary: check token user
 *     requestBody:
 *       description: token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's authentication token
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/validatetoken", (req, res) => {})

/**
 * @swagger
 *
 * /api/recoverypassword:
 *   post:
 *     summary: change password
 *     description: you send email and after that you get once password
 *     requestBody:
 *       description: your email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's authentication token
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/recoverypassword", (req, res) => {})

/**
 * @swagger
 *
 * /api/checktoken:
 *   post:
 *     summary: verify changePasswordToken
 *     description:
 *     requestBody:
 *       description: token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's authentication token
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/checktoken", (req, res) => {})

/**
 * @swagger
 *
 * /api/changepassword:
 *   post:
 *     summary: you change password 
	*     description: you enter new password and change password 
 *     requestBody:
 *       description: token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's authentication token  
	*               password:
	*                 type: string
 *                 description: User's new password  
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/changepassword", (req, res) => {})

/**
 * @swagger
 *
 * /api/getseller:
 *   post:
 *     summary: you get info about seller  
 *     requestBody:
 *       description:sellerID
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sellerID:
 *                 type: string
 *                 description: User's authentication token  
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
	app.post("/api/getseller", (req, res) => {})