
exports.main = function () {
  const usage = `
  Usage:  emp COMMAND [args..]

  A package manager for science.

  Commands:
      login       Authenticates with the emprical server and stores credentials
      logout      Clear credentials
      run         Run an experiment
      data        Manage datasets
      configure   Configure directory for persisting data and workspaces
      version     Show the emp version information
  `
  console.log(usage)
}

exports.data = function () {
  const usage = `
  Usage: emp data SUBCOMMAND args

  Subcommands:
      get url     Gets a data file from a url
      hash file   Print the hash of a file or directory
  `
  console.log(usage)
}
