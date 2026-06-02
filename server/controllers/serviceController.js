import Service from '../models/Service.js';

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const tenantId = req.query.tenantId;
    const filter = { isActive: true };
    if (tenantId) filter.tenant = tenantId;

    const services = await Service.find(filter);
    res.json(services);
  } catch (error) {
    console.error('Error in getServices:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error in getServiceById:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const {
      title,
      titleHindi,
      description,
      descriptionHindi,
      category,
      categoryHindi,
      price,
      estimatedTime,
      formSchema,
      instructions,
      instructionsHindi,
      requiredDocuments,
      requiredDocumentsHindi,
      image,
      isPopular,
      tenantId
    } = req.body;

    const service = new Service({
      title,
      titleHindi,
      description,
      descriptionHindi,
      category,
      categoryHindi,
      price,
      estimatedTime,
      formSchema,
      instructions,
      instructionsHindi,
      requiredDocuments,
      requiredDocumentsHindi,
      image,
      isPopular,
      tenant: tenantId || req.user.tenant,
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PATCH /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      service.title = req.body.title || service.title;
      service.titleHindi = req.body.titleHindi !== undefined ? req.body.titleHindi : service.titleHindi;
      service.description = req.body.description || service.description;
      service.descriptionHindi = req.body.descriptionHindi !== undefined ? req.body.descriptionHindi : service.descriptionHindi;
      service.category = req.body.category || service.category;
      service.categoryHindi = req.body.categoryHindi !== undefined ? req.body.categoryHindi : service.categoryHindi;
      service.price = req.body.price || service.price;
      service.estimatedTime = req.body.estimatedTime || service.estimatedTime;
      service.formSchema = req.body.formSchema || service.formSchema;
      service.instructions = req.body.instructions || service.instructions;
      service.instructionsHindi = req.body.instructionsHindi !== undefined ? req.body.instructionsHindi : service.instructionsHindi;
      service.requiredDocuments = req.body.requiredDocuments || service.requiredDocuments;
      service.requiredDocumentsHindi = req.body.requiredDocumentsHindi !== undefined ? req.body.requiredDocumentsHindi : service.requiredDocumentsHindi;
      service.image = req.body.image || service.image;
      service.isPopular = req.body.isPopular !== undefined ? req.body.isPopular : service.isPopular;
      service.isActive = req.body.isActive !== undefined ? req.body.isActive : service.isActive;

      const updatedService = await service.save();
      res.json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error in updateService:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      await Service.deleteOne({ _id: req.params.id });
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error in deleteService:', error);
    res.status(500).json({ message: error.message });
  }
};

export { getServices, getServiceById, createService, updateService, deleteService };
