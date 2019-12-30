const core = require("@actions/core");
const github = require("@actions/github");
const codesandbox = require("codesandbox");

console.log(Object.keys(codesandbox));

main().catch(error => {
  core.setFailed(error.message);
});

async function main() {
  const client = new github.GitHub(process.env.GITHUB_TOKEN);

  const prEnvironmentLink =
    "https://codesandbox.io/api/v1/sandboxes/define?parameters=" +
    codesandbox.getParameters({
      files: {
        "sandbox.config.json": {
          content:
            "{\n" + '  "template": "create-react-app-typescript"\n' + "}\n"
        },
        "src/index.tsx": {
          content: 'import "@bradenhs/npm-release-test"'
        },
        "public/index.html": {
          content:
            '<style>a { margin-right: 10px; } nav { margin-bottom: 10px; } #root { margin: 10px; }</style><div id="root"></div>'
        },
        "package.json": {
          content: {
            dependencies: {
              "@bradenhs/npm-release-test": "test",
              "type-route": "latest",
              react: "=16.8.6",
              "@types/react": "=16.8.18",
              "react-dom": "=16.8.6",
              "@types/react-dom": "=16.8.4"
            }
          }
        }
      }
    });

  await client.issues.createComment({
    issue_number: github.context.payload.pull_request.number,
    body: `[PR Environment](${prEnvironmentLink})`,
    owner: "bradenhs",
    repo: "npm-release-test"
  });
}
