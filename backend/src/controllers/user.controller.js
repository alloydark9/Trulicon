import User from "../models/User.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -phone");

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
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

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
