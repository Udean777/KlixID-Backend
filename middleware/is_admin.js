export const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and has admin role
    if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }
    next();
  } catch (error) {
    console.error("Error in admin middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
