var github;
var userAccount ="0xe873609364131838b5429255ebe7d9885b19ea6a";

function startApp() {
  var contractAddress = "YOUR_CONTRACT_ADDRESS";
  github = new web3js.eth.Contract(githubABI, contractAddress);

  addCommits(userAccount, n)
    .then(function() {
      // return getCommitsByOwner(userAccount);
      return;
    })
}

function addCommits(owner, number) {
  return github.methods.addCommits(owner, number).send({ from: owner })n
                      .on("receipt", function(receipt) {
                        console.log("Successfully added commits");
                      })
                      .on("error", function(error) {
                        console.error(error);
                      });
}
