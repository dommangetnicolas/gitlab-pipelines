const Axios = require('axios').default;
const chalk = require('chalk');
require('dotenv').config();

const projectID = process.env.PROJECT_ID;
const privateToken = process.env.PRIVATE_TOKEN;

const axios = Axios.create({
    baseURL: `https://gitlab.com/api/v4`,
    headers: {
        "PRIVATE-TOKEN": privateToken
    }
});


(async function() {
    try {
        console.log(chalk.rgb(252, 163, 38)('GitLab - Delete old pipelines 🗑'));
        const {
            data: pipelines
        } = await axios.get(`/projects/${projectID}/pipelines`, {
            params: {
                per_page: 100
            }
        });
        console.log(chalk.rgb(252, 163, 38)(`${chalk.bold(pipelines.length)} pipelines found`));

        const promises = pipelines.map((pipeline) => {
            return axios.delete(`/projects/${projectID}/pipelines/${pipeline.id}`)
        });

        console.log(chalk.green(`${chalk.bold(promises.length)} pipelines deleted ✅`));

        await Promise.all(promises);
    } catch (err) {
        console.log(chalk.red(`An error has occured: ${err}`))
    }
})();