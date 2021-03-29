const Joi = require("joi");

const schema = Joi.object({
  reports: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().allow("").empty("").default("noFile"),
        isCorrect: Joi.boolean().required(),
        level: Joi.string().valid("info", "warning", "fatal"),
        display_type: Joi.string().valid(
          "actions",
          "issues",
          "pull_requests",
          "pages",
          "projects"
        ),
        msg: Joi.string().allow("", null).empty("", null).default(""),
        error: Joi.object({
          expected: Joi.string().allow("").empty("").default(""),
          got: Joi.string().allow("").empty("").default(""),
        }),
      })
    )
    .required(),
});

module.exports = schema;
