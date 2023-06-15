import { Wallet, SecretNetworkClient, TxResponse, MsgInstantiateContract } from 'secretjs'
import * as fs from 'fs'

interface ContractInfo {
    address: string,
    code_hash: string
}

interface State {
    // Addr
    a: string,
    // Uint128
    b: string,
    // Decimal
    c: string
}

async function benchmark() {
    const wallet = new Wallet('grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar')
    const client = new SecretNetworkClient({
        wallet,
        walletAddress: 'secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03',
        chainId: 'secretdev-1',
        url: 'http://localhost:1317'
    })

    const fadroma = await init(client, 'fadroma-bench')
    const toolkit = await init(client, 'toolkit-bench')

    const gasLimit = 5000000
    const items = random_data(1000)
    const fadroma_resp = await client.tx.compute.executeContract(
        {
            sender: client.address,
            contract_address: fadroma.address,
            code_hash: fadroma.code_hash,
            msg: { bench_json_map: { items } }
        },
        { gasLimit }
    )

    const toolkit_resp = await client.tx.compute.executeContract(
        {
            sender: client.address,
            contract_address: toolkit.address,
            code_hash: toolkit.code_hash,
            msg: { bench_map: { items } }
        },
        { gasLimit }
    )

    if (fadroma_resp.code != 0 || toolkit_resp.code != 0) {
        console.log('TX unsuccessful! Terminating...')

        return
    }

    console.log(`fadroma: ${fadroma_resp.gasUsed}`)
    console.log(`toolkit: ${toolkit_resp.gasUsed}`)
}

async function init(client: SecretNetworkClient, name: string): Promise<ContractInfo> {
    console.log(`Uploading ${name}`)
    
    const code = fs.readFileSync(`./${name}.wasm.gz`)

    const upload = await client.tx.compute.storeCode({
        sender: client.address,
        wasm_byte_code: code,
        source: '',
        builder: ''
    },{
        gasLimit: 4450000
    })

    if (upload.code != 0) {
        console.log(`Failed to upload ${name}, logs:\n${upload.rawLog}`)
        process.exit(1)
    }

    let code_id = Number.parseInt(get_value(upload, 'code_id')!);
    console.log(`code id: ${code_id}`)
    let msg = new MsgInstantiateContract({
        sender: client.address,
        code_id,
        label: `${(Date.now() / 1000).toFixed(0)}`,
        init_msg: { }
    })

    const init = await client.tx.broadcast([msg], { gasLimit: 400000  })
    const address = get_value(init, 'contract_address')!

    const code_hash = await client.query.compute.codeHashByContractAddress({ contract_address: address })

    return { address, code_hash: code_hash.code_hash! }
}

function get_value(resp: TxResponse, key: string): string | undefined {
    if (!resp.jsonLog || resp.jsonLog.length == 0)
        return undefined

    const wasm = resp.jsonLog[0].events.find(x =>
        x.type === 'wasm' ||
            x.type === 'message'
    )

    const attrs = wasm?.attributes ?? []

    for (let i = attrs.length - 1; i >= 0; i--) {
        const attr = attrs[i]

        if (attr.key === key)
            return attr.value
    }

    return undefined
}

function random_data(count: number): State[] {
    const result = []
    const a = 'secret1stn58qtmk64jvuk8u33fqdngad90djx7ycs82s'

    const random_int = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min) + min)

    for (let i = 0; i < count; i++) {
        const scale = random_int(6, 19)
        const int = random_int(1, 999) * (1 * 10 ** scale)
        const decimal = Math.random() * 1000

        result.push({
            a,
            b: int.toString(),
            c: decimal.toString()
        })
    }

    return result
}

benchmark().catch(console.log)
