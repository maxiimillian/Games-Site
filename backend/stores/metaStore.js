const GitHub = require('github-api');

class MetaStore {
    constructor() {
        this.supporters = [];
        //this.#getGithubData();
    }

    start() {
        //this.#addSupporters(commiters);
        //setInterval(this._getGithubData, 1000); 
        return;
    }

    stop() {
        clearInterval(this.github_task);
    }

    /**
     * Takes in a list of potential supporters and adds them to the supporters
     * list if they are valid and don't already exist
     */
    #addSupporters(newSupporters) {
        let alreadyExistsFlag = false;
        for (const newSupporter of newSupporters) {
            if (!newSupporter.id) continue;
            alreadyExistsFlag = false;
            for (const supporter of this.supporters) {
                if (newSupporter.id == supporter.id) {
                    alreadyExistsFlag = true;
                    break;
                }
            }
            if (!alreadyExistsFlag) {
                this.supporters.push(newSupporter);
            }
        }
    }

    getSupporters(amount) {
        return this.supporters.slice(0, amount);
    }

    
    //Check for new commits every 30 minutes
    #getGithubData = async () =>{
        const token = process.env.GITHUB_TOKEN;
        const oAuth = new GitHub({
            token: token
        });
        const playholdrRepository = await oAuth.getRepo("maxiimillian", "Games-Site");
        const recentCommits = await playholdrRepository.listCommits();

        const commiters = [];
        for (const commit of recentCommits["data"]) {
            commiters.push({ 
                id: commit.sha, 
                name: commit.author.login, 
                url: commit.url,
                date: commit.commit.committer.date,
            })
        }

        //this.#addSupporters(commiters);
        console.log("getting data");
        setTimeout(this.#getGithubData, 1000*60*30)
    }
}


module.exports = MetaStore;
