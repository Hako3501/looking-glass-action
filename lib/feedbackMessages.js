class FeedbackMessages {
  constructor(user, surveyLink) {
    this.user = user;
    this.surveyLink = surveyLink;
  }
}

class IssueFeedback extends FeedbackMessages {
  constructor(user, surveyLink) {
    super(user, surveyLink);
  }
  success(msg) {
    return `# Step feedback for ${this.user}\n${msg}** task!\n\n_please [provide feedback](${this.surveyLink}) for this lab_`;
  }

  failure(err) {
    return `# ${this.user} It looks like you performed an action we didn't expect. 😦\n**We expected:**\n ${err.expected}\n**We received:**\n ${err.got}. Try performing the expected action.`;
  }

  error(err, payload) {
    return `# ${err.name}\n${err.userMessage}\n**payload details:**\n\`\`\`${payload.err}\`\`\``;
  }
}

module.exports = { IssueFeedback };
