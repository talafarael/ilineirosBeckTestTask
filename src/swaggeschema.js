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
 *     summary: это первая часть регистрации
 *     description: после первой части вы должны кинутль запрос sendemail дял получение одноразвого пароля .
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
 *                 description: Электронная почта пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *               name:
 *                  type: string
 *                  description: User's authentication token
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
 *     summary: это вторая часть регистрации
 *     description: после второй на вашу почту приходит письмо с паролем  а дальше registercreate .
 *     requestBody:
 *       description: User data for authentication
 *       required: true
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/registration", (req, res) => {})