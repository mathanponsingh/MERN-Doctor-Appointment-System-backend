import jwt from "jsonwebtoken"

export const uploadProfile = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    await Doctor.findByIdAndUpdate(req.user.id, {
      profileImage: imageUrl,
    });

    return res.status(200).json({
      image: imageUrl,
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};


export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    console.log(req.body.refreshToken)
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.id;

    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}