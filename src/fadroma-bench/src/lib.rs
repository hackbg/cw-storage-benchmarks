#[fadroma::dsl::contract]
pub mod contract {
    use fadroma::{
        dsl::*,
        schemars::{self, JsonSchema},
        cosmwasm_std::{
            self, StdError, Response, Addr, Uint128,
            Decimal256, Binary, to_binary, to_vec, from_slice
        },
        storage::{TypedKey, map::Map},
        bin_serde::{FadromaSerialize, FadromaDeserialize},
        namespace
    };
    use serde::{Serialize, Deserialize};

    namespace!(MapNs, b"map");
    namespace!(JsonMapNs, b"json_map");

    #[derive(FadromaSerialize, FadromaDeserialize, Serialize, Deserialize, JsonSchema, Debug)]
    pub struct State {
        a: Addr,
        b: Uint128,
        c: Decimal256
    }

    impl Contract {
        #[init(entry_wasm)]
        pub fn init() -> Result<Response, StdError> {
            Ok(Response::new())
        }

        #[execute]
        pub fn bench_map(items: Vec<State>) -> Result<Response, StdError> {
            let mut map = map();

            for item in &items {
                map.insert(deps.storage, &item.a, &item)?;
            }

            let mut items = Vec::with_capacity(items.len());

            for item in map.values(deps.storage)? {
                items.push(item?);
            }

            for item in &items {
                map.remove(deps.storage, &item.a)?;
            }

            let data = to_binary(&items)?;

            Ok(Response::new().set_data(data))
        }

        #[execute]
        pub fn bench_json_map(items: Vec<State>) -> Result<Response, StdError> {
            let mut map = json_map();

            for item in &items {
                let data = to_vec(&item)?;
                map.insert(deps.storage, &item.a, &Binary(data))?;
            }

            let mut items: Vec<State> = Vec::with_capacity(items.len());

            for item in map.values(deps.storage)? {
                items.push(from_slice(&item?.0)?);
            }

            for item in &items {
                map.remove(deps.storage, &item.a)?;
            }

            let data = to_binary(&items)?;

            Ok(Response::new().set_data(data))
        }
    }

    #[inline]
    fn map() -> Map<TypedKey<'static, Addr>, State, MapNs> {
        Map::new()
    }

    #[inline]
    fn json_map() -> Map<TypedKey<'static, Addr>, Binary, JsonMapNs> {
        Map::new()
    }
}