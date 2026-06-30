const Voter = require('../models/Voter');

// @desc   Register a new voter
// @route  POST /api/voters/register
const registerVoter = async (req, res) => {
  try {
    const {
      fullName, dateOfBirth, age, gender, nationality,
      phone, email, address, city, state, pinCode,
      aadharNumber, panCard,
    } = req.body;

    // Check if voter with same Aadhar already exists
    const existing = await Voter.findOne({ aadharNumber });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A voter with this Aadhar number is already registered.',
        voterIdNumber: existing.voterIdNumber,
      });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const voter = await Voter.create({
      fullName, dateOfBirth, age, gender, nationality,
      phone, email, address, city, state, pinCode,
      aadharNumber, panCard, photoUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Voter registered successfully!',
      data: voter,
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @desc   Get all voters (admin)
// @route  GET /api/voters
const getAllVoters = async (req, res) => {
  try {
    const { search, state, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { voterIdNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (state) query.state = state;
    if (status) query.status = status;

    const total = await Voter.countDocuments(query);
    const voters = await Voter.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-aadharNumber -panCard'); // hide sensitive fields

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: voters,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Get single voter by ID
// @route  GET /api/voters/:id
const getVoterById = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);
    if (!voter) {
      return res.status(404).json({ success: false, message: 'Voter not found.' });
    }
    res.status(200).json({ success: true, data: voter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Update voter status (admin)
// @route  PATCH /api/voters/:id/status
const updateVoterStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const voter = await Voter.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!voter) return res.status(404).json({ success: false, message: 'Voter not found.' });
    res.status(200).json({ success: true, data: voter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Delete voter (admin)
// @route  DELETE /api/voters/:id
const deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.params.id);
    if (!voter) return res.status(404).json({ success: false, message: 'Voter not found.' });
    res.status(200).json({ success: true, message: 'Voter deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc   Get stats (admin)
// @route  GET /api/voters/stats
const getStats = async (req, res) => {
  try {
    const total = await Voter.countDocuments();
    const pending = await Voter.countDocuments({ status: 'Pending' });
    const approved = await Voter.countDocuments({ status: 'Approved' });
    const rejected = await Voter.countDocuments({ status: 'Rejected' });
    const byState = await Voter.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.status(200).json({ success: true, data: { total, pending, approved, rejected, byState } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { registerVoter, getAllVoters, getVoterById, updateVoterStatus, deleteVoter, getStats };
