import User from "../models/User.js";

export const setRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["team member", "manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { role },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Role and employeeId updated", role: updated.role })
      .cookies({ role: updated.role, httpOnly: true, secure: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await User.find({ role: "team member" }).select(
      "name employeeId role"
    );
    res.status(200).json(teamMembers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};
