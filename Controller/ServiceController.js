import ServiceSchema from "../Models/ServiceSchema.js";

export const getAllService = async (req, res) => {
  try {
    const services = await ServiceSchema.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await ServiceSchema.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      priceType,
      duration,
      features,
      location,
    } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, Description and Price are required",
      });
    }

    const newService = await ServiceSchema.create({
      name,
      description,
      price,
      category,
      priceType,
      duration,
      features,
      location,
      image: req.file?.path || null,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedService = await ServiceSchema.findByIdAndUpdate(
      id,
      {
        ...req.body,
        ...(req.file && { image: req.file.path }),
      },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await ServiceSchema.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await ServiceSchema.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.status = service.status === "active" ? "inactive" : "active";

    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service is now ${service.status}`,
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

