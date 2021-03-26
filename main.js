const core = require("@actions/core");
const github = require("@actions/github");
const { Feedback } = require("./lib/feedback");

async function run() {
  try {
    // {
    //   reports: [
    //     {
    //       filename: "the filename associated with the report",
    //       isCorrect: true,
    //       level: "info",
    //       display_type: "actions",
    //       msg: "the message",
    //       error: {
    //         expected: "the expected string",
    //         got: "the gotten string",
    //       },
    //     },
    //     {
    //       filename: "",
    //       isCorrect: false,
    //       display_type: "issues",
    //       level: "fatal",
    //       msg: "the message",
    //       error: {
    //         expected: "",
    //         got: "",
    //       },
    //     },
    //   ];
    // }
    const fb = core.getInput("feedback");
    if (!fb) return;

    const { reports } = JSON.parse(fb);

    const token = core.getInput("github-token");
    const octokit = github.getOctokit(token);
    const context = github.context;
    const feedback = new Feedback(octokit, context, ...reports);

    for (const report of feedback.reports) {
      switch (report.display_type) {
        case "issues":
          feedback.provideFeebackUsingIssues(report);
          break;
        // case "pull_requests":
        //   feedback.createPullRequests(octokit, report.msg);
        //   break;
        default:
          console.log("default case");
          break;
      }
    }
    // if (report.type !== "actions") {
    //   // decide how to display feedback based on paylaod from reort.type
    //   const res = await octokit.issues.create({
    //     owner: github.context.repo.owner,
    //     repo: github.context.repo.repo,
    //     title: "Oh no!",
    //     labels: ["bug"],
    //     body: report.msg,
    //   });

    //   return;
    // }
    // if (report.level === "warning" || report.level === "fatal") {
    //   core.warning(report.msg);
    // } else {
    //   core.info(report.msg);
    // }
  } catch (error) {
    core.setFailed(error);
  }
}

run();
