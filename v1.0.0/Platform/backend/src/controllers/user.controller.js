import User from "../models/User.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -phone");

    if (!users) {
      res.status(404).json({
        success: false,
        message: "Unable to fetch users",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetched all users successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -phone -email");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Cannot find user by that id" });

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBySearch = async (req, res, next) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        message: "Search query required",
      });
    }

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const users = await User.aggregate([
      {
        $match: {
          $or: [
            {
              username: {
                $regex: `^${escapedSearch}`,
                $options: "i",
              },
            },
            {
              name: {
                $regex: `^${escapedSearch}`,
                $options: "i",
              },
            },
          ],
        },
      },

      {
        $addFields: {
          priority: {
            $switch: {
              branches: [
                // exact username match
                {
                  case: {
                    $regexMatch: {
                      input: "$username",
                      regex: `^${escapedSearch}$`,
                      options: "i",
                    },
                  },
                  then: 1,
                },

                // username starts with
                {
                  case: {
                    $regexMatch: {
                      input: "$username",
                      regex: `^${escapedSearch}`,
                      options: "i",
                    },
                  },
                  then: 2,
                },

                // exact name match
                {
                  case: {
                    $regexMatch: {
                      input: "$name",
                      regex: `^${escapedSearch}$`,
                      options: "i",
                    },
                  },
                  then: 3,
                },

                // name starts with
                {
                  case: {
                    $regexMatch: {
                      input: "$name",
                      regex: `^${escapedSearch}`,
                      options: "i",
                    },
                  },
                  then: 4,
                },
              ],

              default: 5,
            },
          },
        },
      },

      {
        $sort: {
          priority: 1,
          username: 1,
        },
      },

      {
        $project: {
          password: 0,
          phone: 0,
          role: 0,
          email: 0,
        },
      },

      {
        $limit: 20,
      },
    ]);

    if(!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found matching the search criteria",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};
