export const isSuperAdmin = async (req, res, next) => {
  try {
    // Check if user exists and has super_admin role
    if (!req.user || req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super admin privileges required.",
      });
    }
    next();
  } catch (error) {
    console.error("Error in super admin middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
