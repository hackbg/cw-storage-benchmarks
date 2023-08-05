use cosmwasm_std::{
    StdResult, Response, Addr, Uint128, Decimal256,
    Binary, DepsMut, Deps, Env, MessageInfo,
    to_binary, entry_point
};
use secret_toolkit::storage::Keymap;
use serde::{Serialize, Deserialize};
use schemars::JsonSchema;

static MAP: Keymap<'static, Addr, State> = Keymap::new(b"map");

#[derive(Serialize, Deserialize, JsonSchema)]
pub struct InstantiateMsg { }

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    BenchMap { items: Vec<State> }
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg { }

#[derive(Serialize, Deserialize, JsonSchema)]
pub struct State {
    a: Addr,
    b: Uint128,
    c: Decimal256
}

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg
) -> StdResult<Response> {
    Ok(Response::new())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::BenchMap { items } => {
            for item in &items {
                MAP.insert(deps.storage, &item.a, &item)?;
            }

            let mut items = Vec::with_capacity(items.len());

            for item in MAP.iter(deps.storage)? {
                items.push(item?.1);
            }

            for item in &items {
                MAP.remove(deps.storage, &item.a)?;
            }

            let data = to_binary(&items)?;

            Ok(Response::new().set_data(data))
        }
    }
}

#[entry_point]
pub fn query(
    _deps: Deps,
    _env: Env,
    _msg: QueryMsg
) -> StdResult<Binary> {
    Ok(Binary(Vec::new()))
}