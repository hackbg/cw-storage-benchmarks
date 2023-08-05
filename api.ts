import { Client, Deployment } from '@fadroma/agent'

export default class CwStorageBenchmarks extends Deployment {

  fadromaBench = this.contract({
    name: "fadroma-bench",
    crate: "fadroma-bench",
    client: FadromaBench,
    initMsg: async () => ({})
  })

  toolkitBench = this.contract({
    name: "toolkit-bench",
    crate: "toolkit-bench",
    client: ToolkitBench,
    initMsg: async () => ({})
  })

  // Define your contract roles here with:
  //   contract = this.contract({...})
  //
  // See https://fadroma.tech/deploy.html
  // for more info about how to populate this section.

}

export class FadromaBench extends Client {
  // Implement methods calling the contract here:
  //
  // myTx = (arg1, arg2) => this.execute({my_tx:{arg1, arg2}})
  // myQuery = (arg1, arg2) => this.query({my_query:{arg1, arg2}})
  //
  // See https://fadroma.tech/agent.html#client
  // for more info about how to populate this section.
}


export class ToolkitBench extends Client {
  // Implement methods calling the contract here:
  //
  // myTx = (arg1, arg2) => this.execute({my_tx:{arg1, arg2}})
  // myQuery = (arg1, arg2) => this.query({my_query:{arg1, arg2}})
  //
  // See https://fadroma.tech/agent.html#client
  // for more info about how to populate this section.
}
