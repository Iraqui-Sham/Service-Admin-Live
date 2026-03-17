import SuperAdmin from "../Models/SuperAdminSchema.js";

export const CreateSuperAdmin = async (req, res) => {
  try {

    const { id, name, email, password } = req.body;
    const image = req.file ? req.file.path : null;

    // UPDATE
    if (id) {
      const admin = await SuperAdmin.findById(id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found"
        });
      }

      admin.name = name || admin.name;
      admin.email = email || admin.email;

      if (password) admin.password = password;
      if (image) admin.image = image;

      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Super Admin Updated Successfully",
        data: admin
      });
    }

    // CREATE
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Password are required"
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const existingAdmin = await SuperAdmin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email"
      });
    }

    const admin = await SuperAdmin.create({
      name,
      email,
      password,
      image
    });

    return res.status(201).json({
      success: true,
      message: "Super Admin Created Successfully",
      data: admin
    });

  } catch (error) {
    console.log(error.message); // 🔥 full debug

    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error:error
    });
  }
};

export const GetSuperAdmin = async (req, res) => {
  try {
    let SuperAdminProfile =await SuperAdmin.find().lean()
    if (!SuperAdminProfile) {
      return res.status(401).json({
        message: "Super Admin Profile Not Found"
      });
    } else {
      return res.status(201).json({
        message: "Profile Find SuccessFully",
        success: true,
        data: SuperAdminProfile
      })
    }
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Inter Server Error",
      success: false,
    })
  }
}