const core = require("@actions/core");
const github = require("@actions/github");
const schema = require("./payloadSignature");

const { ValueError, SchemaError } = require("./customErrors");
const { FeedbackMessages } = require("./feedbackMessages");

// const token = core.getInput("github-token");
class LookingGlass {
  constructor(feedback) {
    this.token = core.getInput("github-token") || "none";
    this.octokit = github.getOctokit(this.token) || {};
    this.context = github.context || {};
    this.feedback = feedback;
  }

  async provideFeedbackUsingIssues(report) {
    let user = this.context.actor;
    let payload = {
      owner: this.context.repo.owner,
      repo: this.context.repo.repo,
    };

    let issueBody = new FeedbackMessages(user, "surveyLink");

    if (report.msg !== "Error") {
      if (report.isCorrect) {
        payload.title = `Step feedback for ${user}`;
        payload.body = issueBody.success(report.msg);
      }
      if (!report.isCorrect) {
        payload.title = "Incorrect Solution";
        payload.body = issueBody.failure(report.error);
        payload.labels = ["invalid"];
        // this.forceWorkflowToFail("You're wrong!");
      }
    }

    if (report.msg === "Error") {
      payload.title = "Oops, there is an error";
      payload.body = issueBody.failure(report.error);
      payload.labels = ["bug"];
      // this.forceWorkflowToFail("throw a ServiceError");
    }

    const res = await this.octokit.issues.create(payload);

    return { payload, res };
  }

  forceWorkflowToFail(msg) {
    core.setFailed(msg);
  }

  getReportLevel(report) {
    return report.level;
  }

  validatePayloadSignature() {
    const { error, value } = schema.validate(this.feedback);
    if (error) {
      throw new SchemaError();
    }

    for (const report of value.reports) {
      if (!report.msg) {
        report.msg = "Error";
      }

      if (
        report.msg === "Error" &&
        (!report.error.expected || !report.error.got)
      ) {
        throw new ValueError(
          "error.expected and error.got cannot be blank if msg is 'Error'"
        );
      }

      // if (
      //   report.msg !== "Error" &&
      //   (report.error.got || report.error.expected)
      // ) {
      //   throw new ValueError(
      //     "error.expected or error.got cannot be populated if msg is something other than 'Error'"
      //   );
      // }

      if (report.msg !== "Error" && !report.error.expected) {
        report.error.expected = null;
      }

      if (report.msg !== "Error" && report.error.got) {
        report.error.got = null;
      }
    }

    return value.reports;
  }
}
module.exports = LookingGlass;
