// <reference path="../common/common.ts"/>
// <reference path="../resources/resources.ts"/>
//* IMPORT
//import { HoloObject, LinkRepo, Hash, VfObject, PhysicalLocation, Dict, CrudResponse, notError } from "../../../lib/ts/common";
import {
  HoloObject, Hash, VfObject, PhysicalLocation, Dict, CrudResponse,
  notError, deepAssign, Initializer, reader, creator, HoloClass, AgentProperty
} from "../common/common";
import {LinkRepo} from "../common/LinkRepo"
import "../common/holochain-proto";
import "../common/es6";
import resources from "../resources/resources";

/*/
/**/

/* TYPE-SCOPE
import "../resources/resources";
import {LinkRepo, LinkSet} from "../common/LinkRepo";
import "../common/holochain-proto"
import "../common/common";

/*/
/**/

/**
 * A Holo-zome defining functions that deal with agents, relationships, and locations
 */
interface AgentEntry {
  primaryLocation: PhysicalLocation;
  name: string;
}

class Agent<T = {}> extends VfObject<T & AgentEntry & typeof VfObject.entryType> {
  static className = "Agent";
  className = "Agent";
  static entryType: AgentEntry & typeof VfObject.entryType;
  static entryDefaults = deepAssign({}, VfObject.entryDefaults, <AgentEntry> {
      primaryLocation: []
    });

  static get(hash: Hash<Agent>): Agent {
    return <Agent> super.get(hash);
  }
  static create(entry: AgentEntry & typeof VfObject.entryType): Agent {
    return <Agent> super.create(entry);
  }
  constructor(entry?: T & AgentEntry & typeof VfObject.entryType, hash?: Hash<Agent>) {
    super(entry, hash);
  }

}


//* TYPE-SCOPE
declare global {
/*/
/**/
namespace agents {
  export type Agent = typeof Agent.entryType;
  //export type AgentProperty = typeof AgentProperty;

}
//* TYPE-SCOPE
}
/*/
/**/

//* EXPORT
export default agents;
/*/
/**/

// <zome> public functions
//* HOLO-SCOPE
const createAgent = creator(Agent);


function getOwnedResources(
  {agents, types}: {agents: Hash<Agent>[], types?: Hash<resources.ResourceClassification>[]}
): {
  [agent: string]: { [classification: string]: Hash<resources.EconomicResource>[] }
} {
  //              [agent][class][resource]
  let agentDicts: Dict<Dict<Hash<resources.EconomicResource>[]>> = {},
    typeSet: Set<Hash<resources.ResourceClassification>> = null;
  if (types) {
    typeSet = new Set(types);
  }
  // This is going to have to be a query-filter-collate.
  for (let agentHash of agents) {

    let classDict: Dict<Hash<resources.EconomicResource>[]> = {},
      stuffHeHas = AgentProperty.get(agentHash, "owns").tags<resources.EconomicResource>(`owns`);

    stuffHeHas.data().forEach((resource: resources.EconomicResource, index: number) => {
      let type = resource.resourceClassifiedAs;
      if (!types || typeSet.has(type)) {
        let instances = classDict[type] || [];
        instances.push(stuffHeHas[index].Hash);
        classDict[type] = instances;
      }
    });

    agentDicts[agentHash] = classDict;
  }

  return agentDicts;
}

const readAgents = reader(Agent);

// callbacks
function genesis() {
  // YAGNI
  return true;
}

function validateCommit(entryType, entry, header, pkg, sources) {
  // check against schema: YAGNI
  return true;
}

function validatePut(entryType, entry, header, pkg, sources) {
  // check for data sanity: YAGNI
  return validateCommit(entryType, entry, header, pkg, sources);
}

function validateMod(entryType, entry, header, replaces, pkg, sources) {
  // messages are immutable for now.
  return true;
}

function validateDel(entryType, hash, pkg, sources) {
  // messages are permanent for now
  return true;
}

function validateLink(entryType, hash, links, pkg, sources) {
  return true;
}

function validatePutPkg(entryType) {
  // don't care.
  return null;
}

function validateModPkg(entryType) {
  // can't happen, don't care
  return null;
}

function validateDelPkg(entryType) {
  // can't happen, don't care
  return null;
}

function validateLinkPkg(entryType) {
  // can't happen, don't care
  return null;
}

/*/
/**/
