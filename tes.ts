import * as assert from 'node:assert'
import CwStorageBenchmarks from './api'
import { getDeployment } from '@hackbg/fadroma
const deployment = await getDeployment(CwStorageBenchmarks).deploy()
// add your assertions here