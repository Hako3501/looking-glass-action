# looking-glass-action

Looking Glass is a reporting agent that provides feedback to users based on a payload signature. Looking Glass reads the output of a previous GitHub action. To use Looking Glass your action will need to **set output** matching the following payload signature.

**Sample payload signature**

```javascript
{
  report: [
    {
      filename: "the filename associated with the report",
      isCorrect: true,
      level: "info",
      display_type: "actions",
      msg: "some string that contains a message",
    },
    {
      filename: "can be empty if no file is associated with the report",
      isCorrect: false,
      display_type: "issues",
      level: "fatal",
      msg:
        "# something was incorrect\n**expected:** some correct answer\n**got:** some incorrect answewr",
    },
  ];
}
```

| Key            | Value   | Description                                                                                                                        | Required | Values                                                                                        |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `filename`     | string  | If there is a file associated with the report pass it's full path as the value to `filename`                                       | NO       | Any string                                                                                    |
| `isCorrect`    | Boolean | Was the task associated with this report completed correctly.                                                                      | YES      | <ul><li>true</li><li>false</li></ul>                                                          |
| `level`        | string  | What is the severity of the report. Useful apply labels to issues or highlighting text and other data in the GitHub Actions runner | YES      | <ul><li>info</li><li>warning</li><li>fatal</li></ul>                                          |
| `display_type` | string  | Desired GitHub repository feature to use for displaying `msg`.                                                                     | YES      | <ul><li>actions</li><li>issues</li><li>pages</li><li>projects</li><li>pull_requests</li></ul> |
| `msg`          | string  | Message to be provided to the user.                                                                                                | YES      | Any string                                                                                    |

## Using Looking Glass

**Input Parameters**

| Parameter      | Description                                                                                                                                             | Required |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `feedback`     | Output from a previous action containing a **stringified** version of the payload signature.                                                            | YES      |
| `github-token` | A token scoped with the ability to use repository features to provide feedback. It is best to use `secrets.GITHUB_TOKEN` as a value for this parameter. | YES      |

**Basic configuration**
In this example Looking Glass reads the output of a previous action which has an ID of `events` as supplied input for the `feedback` parameter.

```yaml
- name: Troubleshooting info for grading
  if: failure()
  uses: githubtraining/looking-glass-action@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    feedback: ${{ steps.events.outputs.report }}
```
