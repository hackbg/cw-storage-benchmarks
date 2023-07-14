# CosmWasm storage structures gas cost benches

Persistence is an important aspect of smart contracts.
In CosmWasm, smart contract developers have access to
a fundamental storage primitive: the key-value store.
In the case of Secret Network, libraries like Fadroma
and secret-toolkit build upon the CosmWasm KV store to
implement additional storage structures.

`secret-toolkit` predominantly uses binary blob pages,
where each page contains multiple items in the form of JSON bytes.
Presumably, this done to reduce the number of FFI calls
required to fetch data from the CosmWasm storage runtime.
However, this dramatically increases the complexity of the
implementation of those storage structures.

In contrast, Fadroma uses data mappings where each operation
(insert or get) for each item is a call (or more, depending
on the data structure) to storage.

The purpose of this repo is to measure the gas efficiency of
these distinct approaches with the purpose to hopefully derive
novel and better approaches to more efficiently implement such
storage structures.

The approach would of course greatly depend on the functionality
desired by the structure.

## Map

Just like a regular map, the implementations allow
inserting and getting values from the map, based on a given key.
They also allow for iterating over all the values inserted.

It should be noted that the secret-toolkit version also allows for
iterating over the keys (as opposed to values), whereas Fadroma doesn't.

The benchmark here is the contract accepts N number of items which it then
inserts one by one into the map, then uses the map iterator to iterate over
the values inserted, collecting them into a Vec to include in the response
(just so that we have something to do with those values). Finally, it removes
all the values previously inserted from the map.

The result is, even when bypassing Fadroma's binary serialization by using JSON,
it is still slightly more efficient.

|N items|secret-toolkit (baseline)|Fadroma (w/ JSON serialization)|Fadroma (w/ binary serialization)|
|-------|--------------|------------------------------------------|---------------------------------|
|10     |51318         |50071   (2.43% cheaper)                   |47472   (7.49% cheaper)          |
|100    |182156        |170392  (6.46% cheaper)                   |147534  (19.01% cheaper)         |
|1000   |1482880       |1369681 (7.63% cheaper)                   |1138502 (23.22% cheaper)         |
