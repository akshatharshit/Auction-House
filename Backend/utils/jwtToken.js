export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,        // 🔒 Send only over HTTPS
      sameSite: "None",    // 🔁 Allow cross-origin cookies
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
