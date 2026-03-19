import AdminModal from "../Models/AdminSchema.js";
import bcrypt from "bcryptjs";

export const CreateAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      fatherName,
      aadharNumber,
      panNumber,
      address,
      bankDetails,
      password,
      role,
      status,
    } = req.body;

    if (!name || !email || !phone || !aadharNumber || !panNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, Phone, Aadhar, PAN, Password are required",
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    } else {
      const requiredFields = [
        "state",
        "district",
        "subDistrict",
        "ps",
        "panchayat",
        "village",
        "pincode",
      ];

      const missingFields = requiredFields.filter(
        (field) => !address[field]
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `${missingFields.join(", ")} field(s) are missing`,
        });
      }
    }

    if (bankDetails) {
      const {
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
        branch,
      } = bankDetails;

      if (
        !accountHolderName ||
        !accountNumber ||
        !ifscCode ||
        !bankName ||
        !branch
      ) {
        return res.status(400).json({
          success: false,
          message: "All bank details are required",
        });
      }
    }

    const existingAdmin = await AdminModal.findOne({
      $or: [{ email }, { phone }, { aadharNumber }, { panNumber }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with given details",
      });
    }

    const files = req.files || {};

    const image = files.image ? files.image[0].path : null;

    const documents = {
      aadharFile: files.aadharFile ? files.aadharFile[0].path : null,
      panFile: files.panFile ? files.panFile[0].path : null,
      passbookFile: files.passbookFile ? files.passbookFile[0].path : null,
      agreementFile: files.agreementFile ? files.agreementFile[0].path : null,
    };

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    if (!documents.aadharFile || !documents.panFile) {
      return res.status(400).json({
        success: false,
        message: "Aadhar and PAN documents are required",
      });
    }

    const admin = await AdminModal.create({
      name,
      email,
      phone,
      fatherName,
      aadharNumber,
      panNumber,
      address,
      bankDetails,
      password,
      role,
      status,
      image,
      documents,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const GetAllAdmins = async (req, res) => {
  try {
    const admins = await AdminModal.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const GetAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminModal.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const UpdateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminModal.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const files = req.files || {};

    if (files.image) {
      updateData.image = files.image[0].path;
    }

    updateData.documents = {
      aadharFile: files.aadharFile
        ? files.aadharFile[0].path
        : admin.documents?.aadharFile,

      panFile: files.panFile
        ? files.panFile[0].path
        : admin.documents?.panFile,

      passbookFile: files.passbookFile
        ? files.passbookFile[0].path
        : admin.documents?.passbookFile,

      agreementFile: files.agreementFile
        ? files.agreementFile[0].path
        : admin.documents?.agreementFile,
    };

    const updatedAdmin = await AdminModal.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const DeleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminModal.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const UpdateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["active", "inactive", "blocked"];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (active, inactive, blocked)",
      });
    }

    const admin = await AdminModal.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    admin.status = status;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: `Admin status updated to ${status}`,
      data: admin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};